import React from 'react';
import { PromptItem } from './types';
import { useChatMessages } from './hooks/useChatMessages';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import PromptSuggestions from './components/PromptSuggestions';
import ChatControls from './components/ChatControls';
import ErrorDisplay from './components/ErrorDisplay';
import './styles/index.css';

const Chat: React.FC = () => {
    const {
        messages,
        loading,
        error,
        messagesEndRef,
        networkStatus,
        lastUserMessage,
        useStreamMode,
        handleSend,
        handleStopGeneration,
        handleRetry,
        toggleStreamMode,
        clearConversation
    } = useChatMessages();

    // 提示建议列表
    const promptItems: PromptItem[] = [
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

    return (
        <div className="ai-assistant-container">
            <h1 className="ai-assistant-header">AI 助手</h1>
            
            {/* 错误提示 */}
            <ErrorDisplay 
                error={error} 
                handleRetry={handleRetry} 
                lastUserMessage={lastUserMessage} 
                loading={loading} 
            />

            {/* 消息列表 */}
            <MessageList 
                messages={messages} 
                messagesEndRef={messagesEndRef} 
            />

            {/* 提示和输入区域 */}
            <div className="ai-assistant-input-area">
                <div className="ai-assistant-controls">
                    {/* <PromptSuggestions 
                        items={promptItems} 
                        onItemClick={handlePromptClick} 
                    /> */}
                    <ChatControls 
                        useStreamMode={useStreamMode}
                        toggleStreamMode={toggleStreamMode}
                        clearConversation={clearConversation}
                        handleRetry={handleRetry}
                        networkStatus={networkStatus}
                        lastUserMessage={lastUserMessage}
                        loading={loading}
                    />
                </div>

                <ChatInput 
                    onSubmit={handleSend}
                    onStopGeneration={handleStopGeneration}
                    loading={loading}
                    networkStatus={networkStatus}
                />
            </div>
        </div>
    );
};

export default Chat; 