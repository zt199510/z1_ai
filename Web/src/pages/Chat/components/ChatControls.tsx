import React from 'react';
import { Button, Space } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { NetworkStatus } from '../types';
import '../styles/index.css';

interface ChatControlsProps {
    useStreamMode: boolean;
    toggleStreamMode: () => void;
    clearConversation: () => void;
    handleRetry: () => void;
    networkStatus: NetworkStatus;
    lastUserMessage: string | null;
    loading: boolean;
}

const ChatControls: React.FC<ChatControlsProps> = ({
    useStreamMode,
    toggleStreamMode,
    clearConversation,
    handleRetry,
    networkStatus,
    lastUserMessage,
    loading
}) => {
    return (
        <Space>
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
        </Space>
    );
};

export default ChatControls; 