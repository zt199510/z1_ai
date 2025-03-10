import React, { useEffect, useState, useRef } from 'react';
import { Alert } from 'antd';
import ConversationHeader from '../components/ConversationHeader';
import { MessageList } from '../components/MessageList';
import MessageInput from '../components/MessageInput';

import { useParams } from 'react-router-dom';

export default function Mobile() {
    const [showGuideAlert, setShowGuideAlert] = useState(false);
    const [chatId, setChatId] = useState<string>('');
    const params = useParams();
    // Add state for input container height
    const [inputHeight, setInputHeight] = useState<number>(70);
    const messageListRef = useRef<HTMLDivElement>(null);
    
    // Get chat ID from URL path parameter
    useEffect(() => {
        // 从路由参数中获取对话ID
        const id = params.id;
        if (id) {
            setChatId(id);
            console.log('Found conversation ID in URL path:', id);
        } else {
            console.log('No conversation ID found in URL path');
            // 可以在这里添加重定向逻辑或显示错误信息
        }
    }, [params.id]);

 

    // 处理消息发送
    const handleSendMessage = async (text: string, attachments?: Array<{ mimeType: string; data: string }>) => {
        if (!chatId) {
            console.error('No conversation ID available');
            return;
        }
        
        console.log('Sending message:', text, attachments);
        
  
        
        // 如果有附件，可以在这里处理
        if (attachments && attachments.length > 0) {
            // 这里可以添加处理附件的逻辑
            console.log('Attachments:', attachments);
        }
    };

    // Function to handle input height changes
    const handleInputHeightChange = (height: number) => {
        setInputHeight(height + 12); // Reduced padding (was 16)
        
        // Scroll message list to bottom when input height changes
        if (messageListRef.current) {
            setTimeout(() => {
                messageListRef.current?.scrollTo({
                    top: messageListRef.current.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            <ConversationHeader chatId={chatId} />
            {showGuideAlert && (
                <div className='m-6'>
                    <Alert 
                        message="对话指南" 
                        type='info' 
                        showIcon={true}
                        closable
                        onClose={() => setShowGuideAlert(false)}
                    />
                </div>
            )}
            
            {chatId ? (
                <>
                    {/* Message list with its own scrollbar */}
                    <div className="flex-grow overflow-hidden" style={{ 
                        position: 'absolute',
                        top: '56px', // Account for header height
                        left: 0,
                        right: 0,
                        bottom: `${inputHeight - 10}px`, // Reduced bottom spacing to match reduced input padding
                        padding: '0 8px',
                        paddingRight: '16px', // Extra padding on the right for scrollbar visibility
                        transition: 'bottom 0.2s ease' // Smooth transition when height changes
                    }}>
                        <div 
                            ref={messageListRef}
                            className="h-full overflow-auto custom-scrollbar message-list-container"
                            style={{ 
                                paddingBottom: '30px', // Increased padding at the bottom to prevent scrollbar from being hidden
                                marginRight: '-8px', // Negative margin to prevent scrollbar from being cut off
                                paddingRight: '8px'  // Padding to compensate for the negative margin
                            }}
                        >
                            <MessageList chatId={chatId} />
                        </div>
                    </div>
                    
                    {/* Fixed message input at the bottom */}
                    <div style={{ 
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '8px', // Reduced padding for mobile
                        paddingRight: '20px', // Extra padding on the right to avoid overlapping with scrollbar
                        background: 'white',
                        borderTop: '0px solid #f0f0f0',
                        zIndex: 10,
                        minHeight: `${inputHeight}px`,
                        transition: 'min-height 0.2s ease' // Smooth transition when height changes
                    }}>
                        <MessageInput 
                            submit={handleSendMessage} 
                            onHeightChange={handleInputHeightChange}
                        />
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p>未找到对话，请确保URL中包含正确的ID参数</p>
                </div>
            )}
        </div>
    );
} 