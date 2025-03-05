/**
 * useChatMessages 钩子
 * 
 * 使用 Ant Design X 的 useXAgent 钩子管理聊天消息和请求
 * 
 * 主要功能：
 * 1. 管理聊天消息列表
 * 2. 处理消息发送、流式响应和普通响应
 * 3. 提供中断请求、重试和清空对话等功能
 * 4. 处理网络状态和错误情况
 * 5. 支持切换流式/普通响应模式
 * 
 * 改进：
 * - 使用 useChatAgent 替代直接调用 API 函数
 * - 改进超时处理，使用 setTimeout 替代 Promise.race
 * - 增强错误处理，根据错误类型提供不同的错误提示
 * - 添加错误标记，便于 UI 显示错误状态
 * - 同步 loading 状态与 isRequesting 状态
 */
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { message } from 'antd';
import { Message, NetworkStatus } from '../types';

export const useChatMessages = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [useStreamMode, setUseStreamMode] = useState(true);
    const [networkStatus, setNetworkStatus] = useState<NetworkStatus>('online');
    const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
    const welcomeShownRef = useRef(false);




    // 初始化欢迎消息
    useEffect(() => {
        const welcomeMessage: Message = {
            id: uuidv4(),
            content: '你好！我是AI助手，有什么我可以帮助你的吗？',
            role: 'assistant',
            timestamp: new Date()
        };
        setMessages([welcomeMessage]);
        
        // 显示使用提示
        if (!welcomeShownRef.current) {
            message.info('AI助手已准备就绪，可以开始对话了！');
            welcomeShownRef.current = true;
        }
        
        // 监听网络状态
        const handleOnline = () => {
            setNetworkStatus('online');
            message.success('网络已连接');
        };
        
        const handleOffline = () => {
            setNetworkStatus('offline');
            message.error('网络已断开');
        };
        
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        // 初始检查网络状态
        setNetworkStatus(navigator.onLine ? 'online' : 'offline');
        
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // 滚动到最新消息
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ 
                behavior: 'smooth',
                block: 'end'
            });
        }
    }, [messages]);

    // 处理停止生成
    const handleStopGeneration = () => {
       
        message.info('已停止生成回复');
        setLoading(false);
    };

    // 处理发送消息
    const handleSend = async (text: string) => {
        if (!text.trim() || loading) return;
        
        // 保存用户消息，以便重试
        setLastUserMessage(text);
        
        // 重置网络状态
        if (networkStatus === 'error') {
            setNetworkStatus(navigator.onLine ? 'online' : 'offline');
        }

        // 声明消息ID变量，以便在catch块中也能访问
        let assistantMessageId = uuidv4();

        try {
            // 添加用户消息
            const userMessage: Message = {
                id: uuidv4(),
                content: text,
                role: 'user',
                timestamp: new Date()
            };
            
            setMessages(prev => [...prev, userMessage]);
            setLoading(true);
            setError(null);
        } catch (err) {
            
        } finally {
            setLoading(false);
        }
    };

    // 处理重试
    const handleRetry = async () => {
        if (lastUserMessage && !loading) {
            // 移除最后一条错误消息
            setMessages(prev => {
                const newMessages = [...prev];
                // 如果最后一条是助手消息且有错误，则移除
                if (newMessages.length > 0 && 
                    newMessages[newMessages.length - 1].role === 'assistant' &&
                    newMessages[newMessages.length - 1].content.includes('抱歉，发生了错误')) {
                    newMessages.pop();
                }
                return newMessages;
            });
            
            // 重新发送上一条用户消息
            await handleSend(lastUserMessage);
        }
    };

    // 切换流式模式
    const toggleStreamMode = () => {
        setUseStreamMode(prev => !prev);
        message.info(`已切换到${!useStreamMode ? '流式' : '普通'}响应模式`);
    };

    // 清空对话
    const clearConversation = () => {
        // 保留欢迎消息
        const welcomeMessage: Message = {
            id: uuidv4(),
            content: '对话已清空。有什么我可以帮助你的吗？',
            role: 'assistant',
            timestamp: new Date()
        };
        setMessages([welcomeMessage]);
        setError(null);
        message.success('对话已清空');
    };

    return {
        messages,
        loading,
        error,
        messagesEndRef,
        networkStatus,
        lastUserMessage,
        useStreamMode,
        handleSend,
        handleStopGeneration,
        handleRetry,
        toggleStreamMode,
        clearConversation
    };
}; 