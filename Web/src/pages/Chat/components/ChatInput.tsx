import React from 'react';
import { Button } from 'antd';
import { Sender } from '@ant-design/x';
import { StopOutlined } from '@ant-design/icons';
import { NetworkStatus } from '../types';
import '../styles/index.css';

interface ChatInputProps {
    onSubmit: (text: string) => void;
    onStopGeneration: () => void;
    loading: boolean;
    networkStatus: NetworkStatus;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
    onSubmit, 
    onStopGeneration, 
    loading, 
    networkStatus 
}) => {
    // 获取输入框占位符
    const getPlaceholder = () => {
        if (loading) return "AI正在思考中...";
        if (networkStatus === 'offline') return "网络已断开，无法发送消息...";
        if (networkStatus === 'error') return "API连接异常，请重试...";
        return "输入您的问题...";
    };

    return (
        <Sender
            onSubmit={onSubmit}
            loading={loading}
            disabled={loading || networkStatus === 'offline'}
            placeholder={getPlaceholder()}
            style={{
                maxWidth: '1200px',
                margin: '0 auto',
                width: '100%',
                "--x-sender-textarea-max-height": "150px",
                "--x-sender-textarea-overflow": "auto"
            } as React.CSSProperties}
            actions={loading ? [
                <>
                    <Button 
                        key="stop" 
                        type="primary" 
                        icon={<StopOutlined />} 
                        onClick={onStopGeneration}
                        shape="circle"
                        className="stop-button pulse-animation"
                    />
                </>
            ] : undefined}
        />
    );
};

export default ChatInput; 