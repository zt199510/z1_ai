import React from 'react';
import { Bubble } from '@ant-design/x';
import { Avatar } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';
import { Message, BubbleItem } from '../types';
import MessageItem from './MessageItem';
import '../styles/index.css';

interface MessageListProps {
    messages: Message[];
    messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, messagesEndRef }) => {
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
    const bubbleItems: BubbleItem[] = messages.map(msg => ({
        key: msg.id,
        role: msg.role,
        content: msg.content,
        loading: msg.loading,
        avatar: getAvatar(msg.role),
        messageRender: () => <MessageItem message={msg} />
    }));

    return (
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
    );
};

export default MessageList; 