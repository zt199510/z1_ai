import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    Bubble,
    Sender,
    Prompts,
    Welcome
} from '@ant-design/x';
import { Button, Space, Typography, Spin, Avatar, Collapse, message, Alert, Badge } from 'antd';
import {
    CopyOutlined,
    CheckOutlined,
    SoundOutlined,
    LoadingOutlined,
    UserOutlined,
    RobotOutlined,
    BulbOutlined,
    StopOutlined,
    ReloadOutlined,
    WifiOutlined,
    DisconnectOutlined
} from '@ant-design/icons';
import { sendChatRequest, sendStreamChatRequest, createAbortController, ChatMessage } from '../../api/chat';
import './styles.css'; // Import the custom CSS file

const { Text } = Typography;

// 定义消息接口
interface Message extends ChatMessage {
    id: string;
    timestamp: Date;
    loading?: boolean;
}

// 添加CSS动画样式
const pulseAnimation = `
  @keyframes pulse {
    0% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.7);
    }
    
    70% {
      transform: scale(1.05);
      box-shadow: 0 0 0 10px rgba(24, 144, 255, 0);
    }
    
    100% {
      transform: scale(1);
      box-shadow: 0 0 0 0 rgba(24, 144, 255, 0);
    }
  }
`;

const AIAssistant: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [useStreamMode, setUseStreamMode] = useState(true); // 默认使用流式模式，因为mock服务器是流式的
    const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'error'>('online');
    const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
    const welcomeShownRef = useRef(false); // 添加一个ref来跟踪欢迎消息是否已显示

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
           // 只在第一次渲染时显示提示
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
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
            message.info('已停止生成回复');
        }
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
            // 创建新的AbortController
            abortControllerRef.current = createAbortController();
            
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

            // 创建新的助手消息（初始为空，带loading状态）
            const assistantMessage: Message = {
                id: assistantMessageId,
                role: 'assistant',
                content: '',
                timestamp: new Date(),
                loading: true
            };
            setMessages(prev => [...prev, assistantMessage]);

            // 准备发送到API的消息
            const apiMessages: ChatMessage[] = messages
                .filter(msg => msg.role !== 'system')
                .map(msg => ({
                    role: msg.role,
                    content: msg.content
                }));

            // 添加用户消息
            apiMessages.push({
                role: userMessage.role,
                content: userMessage.content
            });

            console.log('Sending messages to API:', JSON.stringify(apiMessages, null, 2));

            // 设置超时
            const timeoutPromise = new Promise<never>((_, reject) => {
                setTimeout(() => {
                    reject(new Error('API请求超时，服务器可能暂时不可用'));
                }, 15000); // 15秒超时
            });

            try {
                if (useStreamMode) {
                    // 使用流式请求
                    let responseContent = '';
                    
                    // 使用Promise.race来实现超时
                    await Promise.race([
                        sendStreamChatRequest(
                            apiMessages,
                            (chunk) => {
                                responseContent += chunk;
                                // 更新助手消息
                                setMessages(prev => {
                                    const newMessages = [...prev];
                                    const lastMessage = newMessages.find(msg => msg.id === assistantMessageId);
                                    if (lastMessage) {
                                        lastMessage.content = responseContent;
                                        lastMessage.loading = false;
                                    }
                                    return newMessages;
                                });
                            },
                            abortControllerRef.current.signal
                        ),
                        timeoutPromise
                    ]);
                    
                    console.log('Stream response completed');
                } else {
                    // 使用普通请求
                    // 使用Promise.race来实现超时
                    const aiResponse = await Promise.race([
                        sendChatRequest(
                            apiMessages,
                            abortControllerRef.current.signal
                        ),
                        timeoutPromise
                    ]);

                    console.log('Received response:', aiResponse);

                    // 更新助手消息
                    setMessages(prev => {
                        const newMessages = [...prev];
                        const lastMessage = newMessages.find(msg => msg.id === assistantMessageId);
                        if (lastMessage) {
                            lastMessage.content = aiResponse;
                            lastMessage.loading = false;
                        }
                        return newMessages;
                    });
                }
            } catch (apiError) {
                // 检查是否是JSON解析错误
                if (apiError instanceof Error && 
                    (apiError.message.includes('JSON') || apiError.name === 'SyntaxError')) {
                    console.error('JSON解析错误，尝试使用备用响应:', apiError);
                    
                    // 使用备用响应
                    const fallbackResponse = `我理解您询问的是关于"${text}"。由于技术原因，我无法提供完整的回答。请尝试重新表述您的问题，或者稍后再试。`;
                    
                    // 更新助手消息
                    setMessages(prev => {
                        const newMessages = [...prev];
                        const lastMessage = newMessages.find(msg => msg.id === assistantMessageId);
                        if (lastMessage) {
                            lastMessage.content = fallbackResponse;
                            lastMessage.loading = false;
                        }
                        return newMessages;
                    });
                    
                    // 显示警告但不中断对话
                    message.warning('服务器响应格式异常，已使用备用回答');
                    
                    // 不抛出错误，让对话继续
                    return;
                }
                
                throw apiError; // 重新抛出其他类型的错误，让外层catch处理
            }
        } catch (err) {
            // 检查是否是中断错误
            if (err instanceof Error && err.name === 'AbortError') {
                console.log('生成被用户中断');
                message.info('回复生成已被中断');
                // 移除loading消息
                setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId));
            } else {
                console.error('聊天错误:', err);
                
                // 设置网络状态为错误
                setNetworkStatus('error');
                
                // 特别处理JSON解析错误
                let errorMessage = '未知错误';
                if (err instanceof Error) {
                    errorMessage = err.message;
                    
                    // 检查是否是JSON解析错误
                    if (err.message.includes('JSON') || err.name === 'SyntaxError') {
                        errorMessage = 'API返回了无效的数据格式。可能是服务器暂时不可用或响应不完整。';
                        console.error('JSON解析错误详情:', err);
                        message.error('服务器返回了无效的数据格式，请稍后再试');
                    } else if (err.message.includes('超时')) {
                        errorMessage = '服务器响应超时，请稍后再试。';
                        message.error('服务器响应超时，请稍后再试');
                    } else {
                        message.error(`发生错误: ${errorMessage}`);
                    }
                }
                
                setError(err instanceof Error ? err : new Error('未知错误'));
                
                // 更新助手消息为错误状态
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMessage = newMessages.find(msg => msg.id === assistantMessageId);
                    if (lastMessage) {
                        lastMessage.content = `抱歉，发生了错误: ${errorMessage}`;
                        lastMessage.loading = false;
                    }
                    return newMessages;
                });
            }
        } finally {
            setLoading(false);
            abortControllerRef.current = null;
        }
    };

    // 重试上一次请求
    const handleRetry = () => {
        if (lastUserMessage) {
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
            handleSend(lastUserMessage);
        }
    };

    // 复制文本到剪贴板
    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(id);
            message.success('已复制到剪贴板');
            setTimeout(() => setCopiedId(null), 2000);
        }).catch(err => {
            console.error('复制失败:', err);
            message.error('复制失败');
        });
    };

    // 文本转语音
    const textToSpeech = (text: string) => {
        try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            window.speechSynthesis.speak(utterance);
            message.info('正在播放语音');
        } catch (err) {
            console.error('语音合成错误:', err);
            message.error('语音播放失败');
        }
    };

    // 提示建议列表
    const promptItems = [
        {
            label: '你能做什么？',
            key: 'what-can-you-do'
        },
        {
            label: '如何使用这个应用？',
            key: 'how-to-use'
        },
        {
            label: '给我讲个笑话',
            key: 'tell-joke'
        },
        {
            label: '今天的天气怎么样？',
            key: 'weather'
        }
    ];

    // 处理提示点击
    const handlePromptClick = (info: { data: any }) => {
        if (info.data && info.data.label) {
            handleSend(info.data.label);
        }
    };

    // 切换流式模式
    const toggleStreamMode = () => {
        setUseStreamMode(prev => !prev);
        message.info(`已切换到${!useStreamMode ? '流式' : '普通'}模式`);
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

    // 自定义消息渲染
    const renderMessage = (message: Message) => {
        if (message.loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                </div>
            );
        }
        
        return (
            <div style={{
                position: 'relative',
                paddingBottom: '24px',
                width: '100%'
            }}>
                <div style={{ whiteSpace: 'pre-wrap' }}>
                    {message.content}
                </div>

                <div style={{
                    position: 'absolute',
                    right: '0',
                    bottom: '0',
                    opacity: 0.7
                }}>
                    <Space>
                        <Button
                            type="text"
                            icon={copiedId === message.id ? <CheckOutlined /> : <CopyOutlined />}
                            size="small"
                            onClick={() => copyToClipboard(message.content, message.id)}
                            title="复制到剪贴板"
                        />
                        <Button
                            type="text"
                            icon={<SoundOutlined />}
                            size="small"
                            onClick={() => textToSpeech(message.content)}
                            title="文本转语音"
                        />
                    </Space>
                </div>
            </div>
        );
    };

    // 获取头像
    const getAvatar = (role: string) => {
        if (role === 'user') {
            return <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />;
        } else if (role === 'assistant') {
            return <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />;
        } else {
            return <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#faad14', opacity: 0.7 }} />;
        }
    };

    // 转换消息格式以适配Bubble.List
    const bubbleItems = messages.map(msg => ({
        key: msg.id,
        role: msg.role,
        content: msg.content,
        loading: msg.loading,
        avatar: getAvatar(msg.role),
        messageRender: () => renderMessage(msg)
    }));

    return (
        <div className="ai-assistant-container" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '95vh',
            maxWidth: '1200px',
            margin: '0 auto',
            overflow: 'hidden'
        }}>
            <h1 style={{
                textAlign: 'center',
                margin: '20px 0 10px 0',
                flexShrink: 0
            }}>AI 助手</h1>
            {/* 错误提示 */}
            {error && (
                <Alert
                    message="发生错误"
                    description={error.message}
                    type="error"
                    showIcon
                    closable
                    action={
                        <Button 
                            size="small" 
                            type="primary" 
                            onClick={handleRetry}
                            disabled={!lastUserMessage || loading}
                        >
                            重试
                        </Button>
                    }
                    style={{ margin: '0 20px 10px 20px', flexShrink: 0 }}
                />
            )}

            {/* 消息区域 - 使用flex-grow使其占据剩余空间并内部滚动 */}
            <div className="ai-assistant-message-container">
                <div style={{ width: '100%' }}>
                    <Bubble.List
                        items={bubbleItems}
                        roles={{
                            user: {
                                placement: 'end',
                                variant: 'filled',
                                shape: 'round'
                            },
                            assistant: {
                                placement: 'start',
                                variant: 'outlined',
                                shape: 'round'
                            },
                            system: {
                                placement: 'start',
                                variant: 'borderless',
                                shape: 'round'
                            }
                        }}
                        autoScroll={true}
                    />

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* 提示和输入区域 - 固定在底部 */}
            <div style={{
                padding: '0 20px 20px 20px',
                borderTop: '1px solid #f0f0f0',
                background: '#fff',
                flexShrink: 0
            }}>
                <div style={{ 
                    marginBottom: '15px', 
                    maxWidth: '1200px', 
                    margin: '0 auto 15px auto', 
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {/* <Prompts
                        items={promptItems}
                        onItemClick={handlePromptClick}
                        title="你可能想问："
                        wrap
                    /> */}
                    {/* <Space>
                        <Button 
                            type="link" 
                            onClick={toggleStreamMode}
                            title={useStreamMode ? "切换到普通模式" : "切换到流式模式"}
                        >
                            {useStreamMode ? "流式模式" : "普通模式"}
                        </Button>
                        <Button 
                            type="link" 
                            onClick={clearConversation}
                            title="清空当前对话"
                        >
                            清空对话
                        </Button>
                        {networkStatus === 'error' && (
                            <Button 
                                type="link" 
                                icon={<ReloadOutlined />}
                                onClick={handleRetry}
                                disabled={!lastUserMessage || loading}
                                title="重试上一次请求"
                            >
                                重试
                            </Button>
                        )}
                    </Space> */}
                </div>

                <Sender
                    onSubmit={handleSend}
                    loading={loading}
                    disabled={loading || networkStatus === 'offline'}
                    placeholder={
                        loading ? "AI正在思考中..." : 
                        networkStatus === 'offline' ? "网络已断开，无法发送消息..." :
                        networkStatus === 'error' ? "API连接异常，请重试..." :
                        "输入您的问题..."
                    }
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        width: '100%',
                        "--x-sender-textarea-max-height": "150px",
                        "--x-sender-textarea-overflow": "auto"
                    } as React.CSSProperties}
                    actions={loading ? [
                        <>
                            <style>{pulseAnimation}</style>
                            <Button 
                                key="stop" 
                                type="primary" 
                                icon={<StopOutlined />} 
                                onClick={handleStopGeneration}
                                shape="circle"
                                style={{ 
                                    backgroundColor: '#1890ff', 
                                    animation: 'pulse 1.5s infinite',
                                    boxShadow: '0 0 0 0 rgba(24, 144, 255, 0.7)',
                                    marginRight: '8px',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px'
                                }}
                            />
                        </>
                    ] : undefined}
                />
            </div>
        </div>
    );
};

export default AIAssistant; 