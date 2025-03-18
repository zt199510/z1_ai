import React, { useEffect, useRef } from 'react';
import { Spin, Flex } from 'antd';
import { useChatStore } from '@/stores/chatStore';
import { MessageBubble } from './Message/MessageBubble';
import { MarkdownRenderer } from './Message/MarkdownRenderer';

interface MessageListProps {
    chatId: string;
}

export const MessageList = ({ chatId }: MessageListProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { messages, generateLoading } = useChatStore();

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
                            {messages.map((message) => (
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                    renderMarkdown={(content) => <MarkdownRenderer content={content} />}
                                />
                            ))}
                            <div ref={messagesEndRef} />
                        </Flex>
                    </>
                )}
            </div>
        </div>
    );
}; 
