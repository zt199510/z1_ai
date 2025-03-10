import React, { useEffect, useState, useRef } from 'react';
import ConversationHeader from '../components/ConversationHeader';
import { MessageList } from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import { useParams } from 'react-router-dom';
import { useChatStore } from '@/stores/chatStore';
import { getMessages } from '@/apis/Message';

export default function Desktop() {
    const [showGuideAlert, setShowGuideAlert] = useState(false);
    const [chatId, setChatId] = useState<string>('');
    const params = useParams();
    // Add state for input container height
    const [inputHeight, setInputHeight] = useState<number>(100);
    const [headerHeight, setHeaderHeight] = useState<number>(80); // 默认头部高度
    const messageListRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const { createMessageAndSend, generateLoading, setMessages } = useChatStore();
    
    // Get chat ID from URL path parameter
    useEffect(() => {
        // 从路由参数中获取对话ID
        const id = params.id;
        if (id) {
            setChatId(id);
            loadMessages();
            console.log('Found conversation ID in URL path:', id);
        } else {
            console.log('No conversation ID found in URL path');
            // 可以在这里添加重定向逻辑或显示错误信息
        }
    }, [params.id]);

    // 监听头部高度变化
    useEffect(() => {
        const updateHeaderHeight = () => {
            if (headerRef.current) {
                setHeaderHeight(headerRef.current.offsetHeight);
            }
        };

        // 初始更新
        updateHeaderHeight();

        // 创建ResizeObserver来监听头部大小变化
        const resizeObserver = new ResizeObserver(updateHeaderHeight);
        if (headerRef.current) {
            resizeObserver.observe(headerRef.current);
        }

        // 清理函数
        return () => {
            if (headerRef.current) {
                resizeObserver.unobserve(headerRef.current);
            }
            resizeObserver.disconnect();
        };
    }, [showGuideAlert]); // 当showGuideAlert变化时重新计算

    const loadMessages = async () => {
        try {
            if (!chatId) return;
            if (chatId === '-1') return;

            const result = await getMessages(chatId);
            if (result.success) {
                setMessages(result.data);
                console.log('Messages loaded:', result.data);
            }
        } catch (error) {
            console.error(error);
        }
    }
    // 处理消息发送
    const handleSendMessage = async (text: string, attachments?: Array<{ mimeType: string; data: string }>) => {
        if (!chatId) {
            console.error('No conversation ID available');
            return;
        }

        console.log('Sending message:', text, attachments);
        // 发送文本消息
        const result = await createMessageAndSend({
            sessionId: parseInt(chatId),
            value: text,
        });
        // 如果有附件，可以在这里处理   
        if (attachments && attachments.length > 0) {
            // 这里可以添加处理附件的逻辑
            console.log('Attachments:', attachments);
        }
    };

    // Function to handle input height changes
    const handleInputHeightChange = (height: number) => {
        setInputHeight(height + 32); // Add padding

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
            <div ref={headerRef}>
                {chatId && <ConversationHeader 
                    chatId={chatId} 
                    showGuideAlert={showGuideAlert}
                    onGuideAlertClose={() => setShowGuideAlert(false)}
                />}
            </div>

            {chatId ? (
                <>
                    {/* Message list with its own scrollbar */}
                    <div className="flex-grow overflow-hidden" style={{
                        position: 'absolute',
                        top: `${headerHeight}px`, // 使用状态中的headerHeight
                        left: 0,
                        right: 0,
                        bottom: `${inputHeight}px`, // Dynamic bottom spacing based on input height
                        padding: '0 16px',
                        transition: 'all 0.2s ease' // Smooth transition when height changes
                    }}>
                        <div
                            ref={messageListRef}
                            className="h-full overflow-auto custom-scrollbar"
                            style={{ paddingBottom: '0px' }} // Add padding at the bottom to prevent scrollbar from being hidden
                        >
                            <div className="container max-w-4xl mx-auto">
                                <MessageList chatId={chatId} />
                            </div>
                        </div>
                    </div>

                    {/* Fixed message input at the bottom */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '0px 20px', // Reduced top/bottom padding, kept left/right padding
                        paddingRight: '28px', // Extra padding on the right to avoid overlapping with scrollbar
                        background: 'white',
                        borderTop: '0px solid #f0f0f0',
                        zIndex: 10,
                        minHeight: `${inputHeight}px`,
                        transition: 'min-height 0.2s ease' // Smooth transition when height changes
                    }}>
                        <div className="container max-w-4xl mx-auto">
                            <MessageInput
                                submit={handleSendMessage}
                                onHeightChange={handleInputHeightChange}
                                generateLoading={generateLoading}
                            />
                        </div>
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