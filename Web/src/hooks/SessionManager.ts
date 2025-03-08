import { StateCreator } from "zustand";
import { createSession, getRecentSessions } from "@/apis/Session";
import { CreateSessionInput } from "@/types/Sessionts";
import { ChatCompleteInput } from "@/types/Chat";
import { ChatStore } from "@/stores/chatStore";

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
     * 发送聊天消息并获取回复
     * @param input 聊天参数
     */
    chatComplete: (input: ChatCompleteInput) => Promise<void>;
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
        const result = await getRecentSessions();
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
    
    /**
     * 发送聊天消息并获取回复
     * 处理聊天完成逻辑
     */
    chatComplete: async (param: ChatCompleteInput) => {
        // 实现聊天完成逻辑
        // TODO: 添加具体实现
    }
});

