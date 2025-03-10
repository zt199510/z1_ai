import React, { useEffect, useRef, useState } from 'react';
import { Button, Modal, Spin, Avatar, Tooltip } from 'antd';
import { DeleteOutlined, SettingOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import { useConversation } from '../hooks/useConversation';
import { Message } from '../hooks/useConversation';

interface MessageListProps {
    chatId: string;
}

export const MessageList = ({ chatId }: MessageListProps) => {
    const { messages, loading, clearMessages } = useConversation(chatId);
    const [isHistorySettingOpen, setIsHistorySettingOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    // Add state for avatars
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [aiAvatar, setAiAvatar] = useState<string | null>(null);
    const [avatarsLoaded, setAvatarsLoaded] = useState<boolean>(false);

    // Load user avatar
    useEffect(() => {
        // In a real app, you would fetch this from user profile
        // For now, we'll use a placeholder avatar
        const loadUserAvatar = async () => {
            try {
                // You can replace this with an actual API call to get the user's avatar
                // const response = await fetch('/api/user/profile');
                // const data = await response.json();
                // setUserAvatar(data.avatarUrl);
                
                // For demo purposes, using a placeholder
                setUserAvatar('https://api.dicebear.com/7.x/avataaars/svg?seed=user123');
            } catch (error) {
                console.error('Failed to load user avatar:', error);
                // Use null to trigger the fallback icon
                setUserAvatar(null);
            }
        };
        
        // Load AI avatar
        const loadAiAvatar = async () => {
            try {
                // For demo purposes, using a placeholder
                setAiAvatar('https://api.dicebear.com/7.x/bottts/svg?seed=ai456');
            } catch (error) {
                console.error('Failed to load AI avatar:', error);
                // Use null to trigger the fallback icon
                setAiAvatar(null);
            }
        };
        
        Promise.all([loadUserAvatar(), loadAiAvatar()])
            .finally(() => setAvatarsLoaded(true));
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initial data loading
    useEffect(() => {
        if (chatId) {
            // Load messages for this chat
            console.log('Loading messages for chat:', chatId);
            // Example: loadMessages(chatId);
        }
    }, [chatId]);

    const handleHistorySettingOpenChange = (open: boolean) => {
        setIsHistorySettingOpen(open);
    };

    const handleClearHistory = (): void => {
        Modal.confirm({
            title: '清空对话历史',
            content: '确定要清空所有对话历史吗？此操作不可撤销。',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                clearMessages();
            },
            onCancel() { },
        });
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // 处理消息内容，将代码块转换为HTML
    const formatMessageContent = (content: string) => {
        // 检查是否包含代码块
        if (content.includes('```')) {
            const parts = [];
            let currentIndex = 0;
            const codeBlockRegex = /```(\w*)\n([\s\S]*?)\n```/g;
            let match;

            while ((match = codeBlockRegex.exec(content)) !== null) {
                // 添加代码块前的文本
                if (match.index > currentIndex) {
                    parts.push(
                        <p key={`text-${currentIndex}`} className="whitespace-pre-wrap break-words">
                            {content.substring(currentIndex, match.index)}
                        </p>
                    );
                }

                // 添加代码块
                const language = match[1] || 'plaintext';
                const code = match[2];
                parts.push(
                    <div key={`code-${match.index}`} className="my-2 rounded-md overflow-hidden">
                        <div className="bg-gray-800 text-white text-xs px-3 py-1">
                            {language}
                        </div>
                        <pre className="bg-gray-900 text-gray-100 p-3 overflow-x-auto">
                            <code>{code}</code>
                        </pre>
                    </div>
                );

                currentIndex = match.index + match[0].length;
            }

            // 添加最后一个代码块后的文本
            if (currentIndex < content.length) {
                parts.push(
                    <p key={`text-${currentIndex}`} className="whitespace-pre-wrap break-words">
                        {content.substring(currentIndex)}
                    </p>
                );
            }

            return <>{parts}</>;
        }

        // 如果没有代码块，直接返回文本
        return <p className="whitespace-pre-wrap break-words">{content}</p>;
    };

    const renderMessage = (message: Message) => {
        const isUser = message.role === 'user';
        
        return (
            <div 
                key={message.id} 
                className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'} items-start`}
            >
                {/* Avatar for assistant (only show on left side) */}
                {!isUser && (
                    <Tooltip title="AI Assistant">
                        <Avatar 
                            icon={<RobotOutlined />} 
                            style={{ 
                                backgroundColor: aiAvatar ? 'transparent' : '#1890ff',
                                marginRight: '8px',
                                flexShrink: 0,
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                            }}
                            size={40}
                            src={aiAvatar} // Use AI avatar if available
                        />
                    </Tooltip>
                )}
                
                <div 
                    className={`max-w-3/4 p-3 rounded-lg ${
                        isUser 
                            ? 'bg-blue-500 text-white rounded-tr-none' 
                            : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}
                    style={{
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                        maxWidth: '70%' // Limit message width
                    }}
                >
                    {formatMessageContent(message.content)}
                    <div className="text-xs mt-1 text-right opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                </div>
                
                {/* Avatar for user (only show on right side) */}
                {isUser && (
                    <Tooltip title="You">
                        <Avatar 
                            icon={<UserOutlined />} 
                            style={{ 
                                backgroundColor: userAvatar ? 'transparent' : '#52c41a',
                                marginLeft: '8px',
                                flexShrink: 0,
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                            }}
                            size={40}
                            src={userAvatar} // Use user's avatar if available
                        />
                    </Tooltip>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-end p-2">
                <Button 
                    icon={<SettingOutlined />} 
                    type="text" 
                    onClick={() => handleHistorySettingOpenChange(true)}
                    className="mr-1"
                />
                <Button 
                    icon={<DeleteOutlined />} 
                    type="text" 
                    onClick={handleClearHistory}
                    danger
                />
            </div>
            
            <div className="flex-grow overflow-auto p-4">
                {loading && messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <Spin size="large" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-500">
                        暂无消息记录
                    </div>
                ) : (
                    <>
                        {messages.map(renderMessage)}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>
        </div>
    );
}; 