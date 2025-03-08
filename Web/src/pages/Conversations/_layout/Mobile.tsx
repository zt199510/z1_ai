import React, { useEffect, useState } from 'react';
import { Alert } from 'antd';
import ConversationHeader from '../components/ConversationHeader';
import { MessageList } from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import { useConversation } from '../hooks/useConversation';

export default function Mobile() {
    const [showGuideAlert, setShowGuideAlert] = useState(false);
    const [chatId, setChatId] = useState<string>('');
    
    // Get chat ID from URL or other source
    useEffect(() => {
        // 从URL中获取对话ID
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('ID'); // 注意这里使用大写的'ID'来匹配请求格式
        if (id) {
            setChatId(id);
            console.log('Found conversation ID in URL:', id);
        } else {
            console.log('No conversation ID found in URL');
            // 可以在这里添加重定向逻辑或显示错误信息
        }
    }, []);

    // 使用useConversation hook获取sendMessage方法
    const { sendMessage } = useConversation(chatId);

    // 处理消息发送
    const handleSendMessage = async (text: string, attachments?: Array<{ mimeType: string; data: string }>) => {
        if (!chatId) {
            console.error('No conversation ID available');
            return;
        }
        
        console.log('Sending message:', text, attachments);
        
        // 发送文本消息
        await sendMessage(text);
        
        // 如果有附件，可以在这里处理
        if (attachments && attachments.length > 0) {
            // 这里可以添加处理附件的逻辑
            console.log('Attachments:', attachments);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <ConversationHeader chatId={chatId} />
            {showGuideAlert && (
                <div className='mx-4 my-2'>
                    <Alert 
                        message="对话指南" 
                        type='info' 
                        showIcon={true}
                        closable
                        onClose={() => setShowGuideAlert(false)}
                    />
                </div>
            )}
            <div className='flex flex-col flex-grow overflow-hidden'>
                {chatId ? (
                    <>
                        <div className="flex-grow overflow-auto">
                            <MessageList chatId={chatId} />
                        </div>
                        <div className="px-3 pb-6">
                            <MessageInput submit={handleSendMessage} />
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p>未找到对话，请确保URL中包含正确的ID参数</p>
                    </div>
                )}
            </div>
        </div>
    );
} 