import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    Bubble,
    Sender,
    Prompts,
    Welcome
} from '@ant-design/x';
import { Button, Space, Typography, Spin, Avatar, Collapse } from 'antd';
import {
    CopyOutlined,
    CheckOutlined,
    SoundOutlined,
    LoadingOutlined,
    UserOutlined,
    RobotOutlined,
    BulbOutlined,
    StopOutlined
} from '@ant-design/icons';

const { Text } = Typography;

// 定义消息接口
interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant' | 'thinking'; // 添加thinking角色
    timestamp: Date;
    loading?: boolean; // 添加loading状态
    typing?: boolean;  // 添加打字效果状态
}

// API消息接口
interface ApiMessage {
    role: 'user' | 'assistant';
    content: string;
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
    const [isGenerating, setIsGenerating] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    // 初始化欢迎消息
    useEffect(() => {
        const welcomeMessage: Message = {
            id: uuidv4(),
            content: '你好！我是AI助手，有什么我可以帮助你的吗？',
            role: 'assistant',
            timestamp: new Date(),
            typing: true // 为欢迎消息添加打字效果
        };
        setMessages([welcomeMessage]);
    }, []);

    // 滚动到最新消息
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 处理停止生成
    const handleStopGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
        setIsGenerating(false);
        setLoading(false);
    };

    // 处理发送消息
    const handleSend = async (text: string) => {
        if (!text.trim() || loading) return;

        // 创建新的AbortController
        abortControllerRef.current = new AbortController();
        
        // 添加用户消息
        const userMessage: Message = {
            id: uuidv4(),
            content: text,
            role: 'user',
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);
        setIsGenerating(true);
        setError(null);

        try {
            // 准备发送到API的消息
            const apiMessages: ApiMessage[] = messages
                .filter(msg => msg.role !== 'thinking') // 过滤掉thinking角色的消息
                .map(msg => ({
                    role: msg.role as 'user' | 'assistant',
                    content: msg.content
                }));

            // 修复TypeScript类型错误
            if (userMessage.role !== 'thinking') {
                apiMessages.push({
                    role: userMessage.role,
                    content: userMessage.content
                });
            }

            // 创建新的助手消息（初始为空，带loading状态）
            const assistantMessageId = uuidv4();
            const assistantMessage: Message = {
                id: assistantMessageId,
                role: 'assistant',
                content: '',
                timestamp: new Date(),
                loading: true
            };
            setMessages(prev => [...prev, assistantMessage]);

            // 模拟API调用和流式响应
            let response = `
      <think>
      让我思考一下这个问题...
      用户问了: "${text}"
      我需要提供一个有帮助的回答。
      这是一个模拟的思考过程，在实际应用中，这里可以展示AI的推理过程。
      </think>
      我收到了你的消息: "${text}"。这是一个模拟的回复，在实际应用中，这里应该调用AI API获取响应。`;

            // 解析思考内容和回复内容
            const thinkMatch = response.match(/<think>([\s\S]*?)<\/think>/);
            const thinkContent = thinkMatch ? thinkMatch[1].trim() : '';
            const replyContent = response.replace(/<think>[\s\S]*?<\/think>/, '').trim();

            // 短暂延迟后开始显示回复
            await new Promise(resolve => setTimeout(resolve, 500));

            // 移除loading状态
            setMessages(prev => {
                const newMessages = [...prev];
                const lastMessage = newMessages.find(msg => msg.id === assistantMessageId);
                if (lastMessage) {
                    // 从消息列表中移除loading消息
                    return newMessages.filter(msg => msg.id !== assistantMessageId);
                }
                return newMessages;
            });

            // 创建包含思考内容和回复内容的消息
            const combinedMessageId = uuidv4();
            const combinedMessage: Message = {
                id: combinedMessageId,
                role: 'assistant',
                // 初始化为空对象，将在流式输出过程中逐步填充
                content: JSON.stringify({
                    thinking: '',
                    reply: ''
                }),
                timestamp: new Date(),
                typing: true
            };

            setMessages(prev => [...prev, combinedMessage]);

            // 如果有思考内容，先流式输出思考内容
            if (thinkContent) {
                const thinkChars = thinkContent.split('');
                for (let i = 0; i < thinkChars.length; i++) {
                    await new Promise(resolve => setTimeout(resolve, 15)); // 调整速度

                    setMessages(prev => {
                        const newMessages = [...prev];
                        const msg = newMessages.find(m => m.id === combinedMessageId);
                        if (msg) {
                            try {
                                const content = JSON.parse(msg.content);
                                content.thinking += thinkChars[i];
                                msg.content = JSON.stringify(content);
                            } catch (e) {
                                console.error('更新思考内容时出错', e);
                            }
                        }
                        return newMessages;
                    });
                }

                // 思考内容完成后短暂暂停
                await new Promise(resolve => setTimeout(resolve, 300));
            }

            // 流式输出回复内容
            const replyChars = replyContent.split('');
            for (let i = 0; i < replyChars.length; i++) {
                await new Promise(resolve => setTimeout(resolve, 30)); // 调整速度

                setMessages(prev => {
                    const newMessages = [...prev];
                    const msg = newMessages.find(m => m.id === combinedMessageId);
                    if (msg) {
                        try {
                            const content = JSON.parse(msg.content);
                            content.reply += replyChars[i];
                            msg.content = JSON.stringify(content);
                        } catch (e) {
                            console.error('更新回复内容时出错', e);
                        }
                    }
                    return newMessages;
                });
            }

            // 完成打字效果
            setMessages(prev => {
                const newMessages = [...prev];
                const combinedMsg = newMessages.find(msg => msg.id === combinedMessageId);
                if (combinedMsg) {
                    combinedMsg.typing = false;
                }
                return newMessages;
            });
        } catch (err) {
            // 检查是否是中断错误
            if (err instanceof Error && err.name === 'AbortError') {
                console.log('生成被用户中断');
            } else {
                console.error('聊天错误:', err);
                setError(err instanceof Error ? err : new Error('未知错误'));
            }
        } finally {
            setLoading(false);
            setIsGenerating(false);
            abortControllerRef.current = null;
        }
    };

    // 复制文本到剪贴板
    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    // 文本转语音
    const textToSpeech = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'zh-CN';
        window.speechSynthesis.speak(utterance);
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

    // 自定义消息渲染
    const renderMessage = (message: Message) => {
        // 如果是加载状态，直接返回null，因为我们会使用Bubble的loading属性
        if (message.loading) {
            return null;
        }

        // 解析消息内容
        let thinkingContent = '';
        let replyContent = message.content;

        // 尝试解析JSON格式的消息内容
        if (message.role === 'assistant') {
            try {
                const parsedContent = JSON.parse(message.content);
                if (parsedContent && typeof parsedContent === 'object') {
                    thinkingContent = parsedContent.thinking || '';
                    replyContent = parsedContent.reply || '';
                }
            } catch (e) {
                // 如果解析失败，保持原始内容
                console.log('解析消息内容失败，使用原始内容');
            }
        }

        return (
            <div style={{
                position: 'relative',
                paddingBottom: '24px',
                width: '100%'
            }}>
                {/* 只有当思考内容不为空时，才显示可折叠面板 */}
                {thinkingContent && message.role === 'assistant' && (
                    <Collapse
                        defaultActiveKey={['thinking']}
                        ghost
                        style={{
                            marginBottom: '8px',
                            border: '1px solid #f0f0f0',
                            borderRadius: '4px',
                            background: '#f9f9f9'
                        }}
                    >
                        <Collapse.Panel
                            header={
                                <span>
                                    <BulbOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                                    思考过程
                                </span>
                            }
                            key="thinking"
                        >
                            <div style={{
                                fontStyle: 'italic',
                                color: '#666',
                                padding: '8px',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {thinkingContent}
                            </div>
                        </Collapse.Panel>
                    </Collapse>
                )}

                {/* 显示回复内容 */}
                <div style={{ whiteSpace: 'pre-wrap' }}>
                    {replyContent}
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
                            onClick={() => copyToClipboard(replyContent, message.id)}
                            title="复制到剪贴板"
                        />
                        <Button
                            type="text"
                            icon={<SoundOutlined />}
                            size="small"
                            onClick={() => textToSpeech(replyContent)}
                            title="文本转语音"
                        />
                    </Space>
                </div>
            </div>
        );
    };

    // 获取头像
    const getAvatar = (role: 'user' | 'assistant' | 'thinking') => {
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
        typing: msg.typing,
        avatar: getAvatar(msg.role),
        messageRender: msg.loading ? undefined : () => renderMessage(msg)
    }));

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '95vh',
            maxWidth: '1200px',
            margin: '0 auto',
            overflow: 'hidden'
        }}>
            <h1 style={{
                textAlign: 'center',
                margin: '20px 0',
                flexShrink: 0
            }}>AI 助手</h1>

            {/* 消息区域 - 使用flex-grow使其占据剩余空间并内部滚动 */}
            <div style={{
                flex: '1 1 auto',
                overflowY: 'auto',
                padding: '0 20px',
                marginBottom: '10px',
                position: 'relative'
            }}>
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
                            thinking: {
                                placement: 'start',
                                variant: 'borderless',
                                shape: 'round',
                                styles: {
                                    content: {
                                        backgroundColor: '#f5f5f5',
                                        color: '#666',
                                        fontStyle: 'italic'
                                    }
                                }
                            }
                        }}
                        autoScroll={true}
                    />

                    {error && (
                        <div style={{
                            padding: '12px',
                            color: '#ff4d4f',
                            background: '#fff2f0',
                            borderRadius: '8px',
                            marginBottom: '16px'
                        }}>
                            <Text type="danger">出错了: {error.message}</Text>
                        </div>
                    )}

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
                    width: '100%' 
                }}>
                    <Prompts
                        items={promptItems}
                        onItemClick={handlePromptClick}
                        title="你可能想问："
                        wrap
                    />
                </div>

                <Sender
                    onSubmit={handleSend}
                    loading={loading}
                    disabled={loading}
                    placeholder={loading ? "AI正在思考中..." : "输入您的问题..."}
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