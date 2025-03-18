import React from 'react';
import { Avatar, Button, Flex } from 'antd';
import { UserOutlined, RobotOutlined, SyncOutlined, SmileOutlined, FrownOutlined } from '@ant-design/icons';
import { Bubble, type BubbleProps } from '@ant-design/x';
import { ReasoningPanel } from './ReasoningPanel';
import { ModelUsage } from './ModelUsage';

interface MessageBubbleProps {
    message: {
        role: string;
        texts: Array<{
            text: string;
            reasoningUpdate?: string;
        }>;
        modelUsages?: {
            promptTokens: number;
            completeTokens: number;
            responseTime: number;
        };
    };
    renderMarkdown: (content: string) => React.ReactNode;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, renderMarkdown }) => {
    const isUser = message.role === 'user';
    const hasReasoning = !isUser && message.texts[0].reasoningUpdate;

    const messageContent = (
        <div>
            {hasReasoning && <ReasoningPanel reasoningUpdate={message.texts[0].reasoningUpdate || ''} />}
            <div className="markdown-content">
                {renderMarkdown(message.texts[0].text)}
            </div>
            {!isUser && <ModelUsage modelUsages={message.modelUsages} />}
        </div>
    );

    const bubbleProps: BubbleProps = {
        loading: (message.texts[0].text === '...' && message.texts[0].reasoningUpdate === ''),
        content: messageContent,
        placement: isUser ? 'end' : 'start',
        avatar: isUser ? (
            <Avatar
                icon={<UserOutlined />}
                style={{
                    backgroundColor: '#52c41a',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
                size={40}
            />
        ) : (
            <Avatar
                icon={<RobotOutlined />}
                style={{
                    backgroundColor: '#1890ff',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
                size={40}
            />
        ),
        variant: isUser ? 'filled' : 'outlined',
        shape: 'round',
        styles: {
            content: {
                maxWidth: '70%',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
            }
        },
        footer: (
            <Flex>
                <Button
                    size="small"
                    type="text"
                    icon={<SyncOutlined />}
                    style={{ marginInlineEnd: 'auto' }}
                />
                <Button size="small" type="text" icon={<SmileOutlined />} />
                <Button size="small" type="text" icon={<FrownOutlined />} />
            </Flex>
        ),
    };

    return (
        <div className="mb-4">
            <Bubble {...bubbleProps} />
        </div>
    );
}; 