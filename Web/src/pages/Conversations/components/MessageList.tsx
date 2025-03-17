import React, { useEffect, useRef, useState } from 'react';
import { Spin, Avatar, Tooltip, Typography, Flex } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import { useChatStore } from '@/stores/chatStore';
import { Bubble, type BubbleProps } from '@ant-design/x';
import markdownit from 'markdown-it';

interface MessageListProps {
    chatId: string;
}

export const MessageList = ({ chatId }: MessageListProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [aiAvatar, setAiAvatar] = useState<string | null>(null);
    const [avatarsLoaded, setAvatarsLoaded] = useState<boolean>(false);
    const { messages, generateLoading } = useChatStore();
    const md = markdownit({ html: true, breaks: true });

    const renderMarkdown: BubbleProps['messageRender'] = (content) => (
        <Typography>
            <div dangerouslySetInnerHTML={{ __html: md.render(content || '') }} />
        </Typography>
    );

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

    const renderMessage = (message: any) => {
        const isUser = message.role === 'user';
        const bubbleProps: BubbleProps = {
            content: message.texts[0].text,
            placement: isUser ? 'end' : 'start',
            avatar: isUser ? (
                <Avatar
                    icon={<UserOutlined />}
                    style={{
                        backgroundColor: userAvatar ? 'transparent' : '#52c41a',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                    }}
                    size={40}
                    src={userAvatar}
                />
            ) : (
                <Avatar
                    icon={<RobotOutlined />}
                    style={{
                        backgroundColor: aiAvatar ? 'transparent' : '#1890ff',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                    }}
                    size={40}
                    src={aiAvatar}
                />
            ),
            variant: isUser ? 'filled' : 'outlined',
            shape: 'round',
            messageRender: renderMarkdown,
            styles: {
                content: {
                    maxWidth: '70%',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                }
            }
        };

        return (
            <div key={message.id} className="mb-4">
                <Bubble {...bubbleProps} />
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
                        <Flex gap="middle" vertical>
                            {messages.map(renderMessage)}
                            <div ref={messagesEndRef} />
                        </Flex>
                    </>
                )}
            </div>
        </div>
    );
}; 
