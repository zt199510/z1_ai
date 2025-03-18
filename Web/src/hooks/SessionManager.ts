import { StateCreator } from "zustand";
import { createSession, getSessionLite } from "@/apis/Session";
import { CreateSessionInput } from "@/types/Sessionts";
import { ChatCompleteInput, ChatCompleteParams, ChatRole } from "@/types/Chat";
import { ChatStore } from "@/stores/chatStore";
import { createMessage } from "@/apis/Message";
import { chatComplete, generateSessionName } from "@/apis/Chat";
import { uploadFile } from "@/apis/FileStorage";

/**
 * 会话管理器接口
 * 定义了管理会话相关的方法
 */
export interface SessionManager {
    /**
     * 加载会话列表
     * @param value 搜索关键词
     */
    loadSessions: (value: string) => Promise<void>;

    /**
     * 创建新会话
     * @param input 创建会话所需参数
     * @returns 返回创建的会话ID
     */
    createSession: (input: CreateSessionInput) => Promise<number>;
    /**
     * 创建消息并且发送
     * @param input 
     * @returns 
     */
    createMessageAndSend: (param: CreateMessageInput) => Promise<void>;
    /**
     * 发送聊天消息并获取回复
     * @param input 聊天参数
     */
    chatComplete: (input: ChatCompleteInput) => Promise<void>;

    /**
     * 重命名session
     */
    renameSession: (id: number) => Promise<void>;

    /**
     * 设置消息
     * @param messages
     */
    setMessages: (messages: any[]) => void;
}


export interface CreateMessageInput {
    sessionId: number;
    value: string;
}

/**
 * 会话管理器实现
 * 提供会话相关功能的具体实现
 */
export const useSessionManager: StateCreator<
    ChatStore,
    [['zustand/devtools', never]],
    [],
    SessionManager
> = (set, get) => ({
    /**
     * 加载会话列表
     * 从服务器获取最近的会话列表
     */
    loadSessions: async (value: string) => {
        const result = await getSessionLite(value);
        if (result.success) {
            set({ sessions: result.data });
        }
    },

    /**
     * 创建新会话
     * 创建会话并发送初始消息
     */
    createSession: async ({
        modelId,
        value,
        files
    }: CreateSessionInput) => {
        // 创建新会话
        const result = await createSession({
            name: '默认会话',
            description: '默认会话',
            modelId: modelId,
        });

        // 更新状态
        set({ currentSession: result.data, messages: [] });
        await get().loadSessions('');

        // 延迟发送初始消息
        setTimeout(() => {
            get().chatComplete({
                sessionId: result.data.id,
                value,
                files
            });
        }, 300);

        return result.data.id;
    },
    createMessageAndSend: async (param: CreateMessageInput) => {
        const fileItems = []
        for (let i = 0; i < get().files.length; i++) {
            const file = get().files[i];
            const result = await uploadFile(file.originFileObj);
            if (result.success) {
                fileItems.push({
                    id: result.data.id,
                    fileName: result.data.fileName,
                    path: result.data.path,
                });
            }
        }
        const userMessage = {
            sessionId: param.sessionId,
            role: ChatRole.User,
            texts: [{ text: param.value }],
            files: fileItems.map(file => ({
                fileId: file.id,
                FileUrl: file.path,
                fileName: file.fileName
            })),
            id: 0
        };

        const messageResponse = await createMessage(userMessage);
        userMessage.id = messageResponse.data.id;
        const previousMessages = get().messages;
        set({ messages: [...previousMessages, userMessage], value: '', files: [], generateLoading: true });
        const tempAiMessage = {
            sessionId: param.sessionId,
            role: ChatRole.Assistant,
            texts: [{ text: '...', id: 0, reasoningUpdate: '', searchResults: [] }],
            isLoading: true,
            id: 0,
            modelUsages: null
        };
        const aiMessageResponse = await createMessage(tempAiMessage);
        tempAiMessage.id = aiMessageResponse.data.id;
        tempAiMessage.texts[0].id = aiMessageResponse.data.id;

        set({ messages: [...get().messages, tempAiMessage], fileExpanded: false });
        const chatCompleteParams = {
            sessionId: param.sessionId,
            parentId: 0,
            networking: false,
            text: userMessage.texts[0].text,
            fileIds: userMessage.files.map(file => file.fileId),
            functionCalls: [],
            assistantMessageId: tempAiMessage.texts[tempAiMessage.texts.length - 1].id
        };

        let accumulatedText = '';
        let reasoningUpdate = '';
        let lastUpdateTime = Date.now();
        for await (const chunk of chatComplete(chatCompleteParams)) {
            const { data, type } = chunk;
            if (type === 'chat') {
                accumulatedText += data;
                tempAiMessage.texts[tempAiMessage.texts.length - 1].text = accumulatedText;

                const currentTime = Date.now();
                if (currentTime - lastUpdateTime >= 100) {
                    set({ messages: [...get().messages] });
                    lastUpdateTime = currentTime;
                }
            } else if (type === 'reasoning') {
                reasoningUpdate += data;
                tempAiMessage.texts[tempAiMessage.texts.length - 1].reasoningUpdate = reasoningUpdate;
                const currentTime = Date.now();
                if (currentTime - lastUpdateTime >= 100) {
                    set({ messages: [...get().messages] });
                    lastUpdateTime = currentTime;
                }
            } else if (type === 'search') {
                const items = data as any[];
                items.forEach(item => {
                    // @ts-ignore
                    tempAiMessage.texts[tempAiMessage.texts.length - 1].searchResults.push(item)
                });
                set({ messages: [...get().messages] });
            } else if (type === 'model_usage') {
                tempAiMessage.modelUsages = data;
            }
        }

        set({ messages: [...get().messages], generateLoading: false });
        console.log('Previous messages length:', previousMessages.length);

        // 如果这是第一轮对话（之前没有消息），则重命名会话
        if (previousMessages.length === 0) {
            console.log('First conversation, renaming session...');
            await get().renameSession(param.sessionId);
        }
    },
    /**
     * 发送聊天消息并获取回复
     * 处理聊天完成逻辑
     * 
     * 该方法处理用户发送消息并获取AI回复的完整流程，包括：
     * 1. 创建用户消息并保存到数据库
     * 2. 创建临时AI响应消息
     * 3. 调用AI接口获取流式响应
     * 4. 实时更新UI显示AI回复
     * 
     * @param {ChatCompleteInput} param - 聊天输入参数
     *   - sessionId: 会话ID（可选，如果不提供则使用当前会话）
     *   - value: 用户输入的文本内容
     *   - files: 附加文件数组（可选）
     */
    chatComplete: async (param: ChatCompleteInput) => {
        // 获取会话ID，如果没有提供则使用当前会话ID
        const sessionId = param.sessionId ?? get().currentSession?.id;
        const previousMessages = get().messages;

        // 1. 创建用户消息对象
        const userMessage = {
            sessionId: sessionId,
            role: ChatRole.User,
            texts: [
                {
                    text: param.value
                }
            ],
            // 处理附加文件，优先使用传入的文件，如果没有则使用全局文件
            files: param.files?.map(file => ({
                fileId: file.id,
                fileName: file.fileName,
                FileUrl: file.path,
            })) ?? get().files.map(file => ({
                fileId: file.id,
                fileName: file.fileName,
                FileUrl: file.path,
            })),
            id: 0 // 临时ID，将在保存后更新
        };

        // 保存用户消息到数据库并获取真实ID
        const result = await createMessage(userMessage);
        userMessage.id = result.data.id;

        // 2. 创建临时AI响应消息（占位用）
        const tempAiMessage = {
            sessionId: sessionId,
            role: ChatRole.Assistant,
            texts: [{ text: '...', id: 0, reasoningUpdate: '', searchResults: [] }],
            isLoading: true,
            id: 0,
            modelUsages: null
        };

        // 保存临时AI消息到数据库并获取真实ID
        const messageResponse = await createMessage(tempAiMessage);
        tempAiMessage.id = messageResponse.data.id;
        tempAiMessage.texts[0].id = messageResponse.data.id;

        // 3. 更新UI状态，添加用户消息和临时AI消息
        const updatedMessages = [...previousMessages, userMessage, tempAiMessage];
        set({
            messages: updatedMessages,
            generateLoading: true // 设置加载状态
        });

        try {
            // 4. 准备AI请求参数
            const chatCompleteParams = {
                sessionId: sessionId,
                parentId: 0,
                text: userMessage.texts[0].text,
                fileIds: userMessage.files.map(file => file.fileId),
                functionCalls: [],
                networking: false,
                assistantMessageId: tempAiMessage.texts[tempAiMessage.texts.length - 1].id
            } as ChatCompleteParams;

            // 5. 用于累积AI回复的变量
            let accumulatedText = '';      // 累积的聊天文本
            let lastUpdateTime = Date.now(); // 上次更新UI的时间戳
            let reasoningUpdate = '';      // 累积的推理过程

            // 6. 处理流式响应
            for await (const chunk of chatComplete(chatCompleteParams)) {
                const { data, type } = chunk;

                // 根据不同类型的响应进行处理
                if (type === 'chat') {
                    // 处理聊天文本
                    accumulatedText += data;
                    tempAiMessage.texts[tempAiMessage.texts.length - 1].text = accumulatedText;

                    // 限制UI更新频率（每100ms更新一次）以提高性能
                    const currentTime = Date.now();
                    if (currentTime - lastUpdateTime >= 100) {
                        set({ messages: [...get().messages] });
                        lastUpdateTime = currentTime;
                    }
                } else if (type === 'reasoning') {
                    // 处理推理过程
                    reasoningUpdate += data;
                    tempAiMessage.texts[tempAiMessage.texts.length - 1].reasoningUpdate = reasoningUpdate;

                    // 同样限制UI更新频率
                    const currentTime = Date.now();
                    if (currentTime - lastUpdateTime >= 100) {
                        set({ messages: [...get().messages] });
                        lastUpdateTime = currentTime;
                    }
                } else if (type === 'search') {
                    // 处理搜索结果
                    const items = data as any[];
                    items.forEach((item: any) => {
                        // @ts-ignore - 忽略类型检查，因为searchResults的类型定义可能不完整
                        tempAiMessage.texts[tempAiMessage.texts.length - 1].searchResults.push(item);
                    });
                    set({ messages: [...get().messages] });
                } else if (type === 'model_usage') {
                    // 处理模型使用信息
                    tempAiMessage.modelUsages = data;
                    set({ messages: [...get().messages] });
                }
            }

            // 7. 完成后更新状态，关闭加载指示器
            set({
                messages: [...get().messages],
                generateLoading: false
            });

            // 8. 如果这是第一轮对话，重命名会话
            console.log('Previous messages length:', previousMessages.length);
            if (previousMessages.length === 0) {
                console.log('First conversation in chatComplete, renaming session...');
                await get().renameSession(sessionId);
            }

        } catch (error) {
            // 错误处理
            console.error('Error in chatComplete:', error);
            // 关闭加载状态，即使发生错误
            set({ generateLoading: false });
        }
    },
    renameSession: async (id: number) => {
        try {
            const result = await generateSessionName(id);
            if (result.success) {
                // 更新session列表
                const sessions = get().sessions?.map(session => session.id === id ? { ...session, name: result.data } : session);
                set({ sessions });
            }
        } catch (error) {
            console.error('Error in renameSession:', error);
        }
    },
    setMessages: (messages: any[]) => {
        set({ messages });
    }
});


