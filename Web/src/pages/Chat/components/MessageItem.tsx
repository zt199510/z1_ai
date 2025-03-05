import React, { useState } from 'react';
import { Button, Space, Spin, message } from 'antd';
import { CopyOutlined, CheckOutlined, SoundOutlined, LoadingOutlined } from '@ant-design/icons';
import { Message } from '../types';
import '../styles/index.css';

interface MessageItemProps {
    message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
    const [copiedId, setCopiedId] = useState<string | null>(null);

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

    if (message.loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
            </div>
        );
    }
    
    return (
        <div className="ai-assistant-message">
            <div className="ai-assistant-message-content">
                {message.content}
            </div>

            <div className="ai-assistant-message-actions">
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

export default MessageItem; 