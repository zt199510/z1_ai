import React, { useEffect, useRef, useState } from 'react';
import { Spin, Avatar, Tooltip, Typography } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import { useChatStore } from '@/stores/chatStore';

interface MessageListProps {
    chatId: string;
}

export const MessageList = ({ chatId }: MessageListProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [aiAvatar, setAiAvatar] = useState<string | null>(null);
    const [avatarsLoaded, setAvatarsLoaded] = useState<boolean>(false);
    const { messages, generateLoading } = useChatStore();

    // Load user avatar
    useEffect(() => {
        const loadUserAvatar = async () => {
            try {
                setUserAvatar('https://api.dicebear.com/7.x/avataaars/svg?seed=user123');
            } catch (error) {
                console.error('Failed to load user avatar:', error);
                setUserAvatar(null);
            }
        };

        const loadAiAvatar = async () => {
            try {
                setAiAvatar('https://api.dicebear.com/7.x/bottts/svg?seed=ai456');
            } catch (error) {
                console.error('Failed to load AI avatar:', error);
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // 处理消息内容，将代码块转换为HTML
    const formatMessageContent = (content: string) => {
        if (content.includes('```')) {
            const parts = [];
            let currentIndex = 0;
            const codeBlockRegex = /```(\w*)\n([\s\S]*?)\n```/g;
            let match;

            while ((match = codeBlockRegex.exec(content)) !== null) {
                if (match.index > currentIndex) {
                    parts.push(
                        <Typography.Paragraph key={`text-${currentIndex}`} className="whitespace-pre-wrap break-words">
                            {content.substring(currentIndex, match.index)}
                        </Typography.Paragraph>
                    );
                }

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

            if (currentIndex < content.length) {
                parts.push(
                    <Typography.Paragraph key={`text-${currentIndex}`} className="whitespace-pre-wrap break-words">
                        {content.substring(currentIndex)}
                    </Typography.Paragraph>
                );
            }

            return <>{parts}</>;
        }

        return <Typography.Paragraph className="whitespace-pre-wrap break-words">{content}</Typography.Paragraph>;
    };

    const renderMessage = (message: any) => {
        const isUser = message.role === 'user';

        return (
            <div
                key={message.id}
                className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'} items-start`}
            >
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
                            src={aiAvatar}
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
                        maxWidth: '70%',
                        position: 'relative'
                    }}
                >
                    {formatMessageContent(message.texts[0].text)}
                    <div 
                        className={`absolute top-0 ${
                            isUser ? 'right-0' : 'left-0'
                        } w-3 h-3 transform ${
                            isUser ? 'translate-x-1/2' : '-translate-x-1/2'
                        } -translate-y-1/2 ${
                            isUser ? 'bg-blue-500' : 'bg-gray-100'
                        } rotate-45`}
                    />
                </div>

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
                            src={userAvatar}
                        />
                    </Tooltip>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-auto p-4">
                {generateLoading && messages.length === 0 ? (
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
