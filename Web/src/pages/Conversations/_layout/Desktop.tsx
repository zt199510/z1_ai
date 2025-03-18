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

    // 将loadMessages定义为useCallback，并使用传入的id参数
    const loadMessages = React.useCallback(async (id: string) => {
        try {
            if (!id) return;
            if (id === '-1') return;

            console.log('Loading messages for ID:', id);
            const sessionId = parseInt(id);
            console.log('Parsed sessionId:', sessionId);
            console.log('Making API request with sessionId:', sessionId.toString());

            const result = await getMessages(sessionId.toString());
            if (result.success) {
                console.log('API Response:', result);
                if (result.data && result.data.length > 0) {
                    const receivedSessionId = result.data[0].sessionId;
                    console.log('First message sessionId:', receivedSessionId);

                    if (receivedSessionId !== sessionId) {
                        console.error(`Session ID mismatch! Requested: ${id}, Received: ${receivedSessionId}`);
                        // 可以选择是否要显示这些消息
                        const shouldShowMessages = window.confirm(
                            `检测到会话ID不匹配！\n请求的ID: ${id}\n收到的ID: ${receivedSessionId}\n\n是否仍要显示这些消息？`
                        );
                        if (!shouldShowMessages) {
                            setMessages([]);
                            return;
                        }
                    }
                }
                setMessages(result.data);
            } else {
                console.error('Failed to load messages:', result);
                setMessages([]);
            }
        } catch (error) {
            console.error('Error loading messages:', error);
            setMessages([]);
        }
    }, [setMessages]);

    // Get chat ID from URL path parameter and load messages
    useEffect(() => {
        const id = params.id;
        if (id) {
            console.log('URL params id:', id);
            setChatId(id);
            loadMessages(id);  // 直接使用params.id，而不是等待chatId状态更新
        } else {
            console.log('No conversation ID found in URL path');
            setMessages([]);
        }
    }, [params.id, loadMessages]);

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

    // 处理消息发送
    const handleSendMessage = async (text: string, attachments?: Array<{ mimeType: string; data: string }>) => {
        if (!chatId) {
            console.error('No conversation ID available');
            return;
        }

        console.log('Sending message with chatId:', chatId);
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