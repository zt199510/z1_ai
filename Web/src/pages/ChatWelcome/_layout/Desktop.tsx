import React, { useEffect, useState } from 'react'
import { Alert } from 'antd';
import GreetingHeader from '../components/GreetingHeader';
import ChatHeader from '../components/ChatHeader';
import AdaptiveTextarea from '../components/AdaptiveTextarea';
import { useChatStore } from '@/stores/chatStore';

export default function Desktop() {
    const [showGuideAlert, setShowGuideAlert] = useState(false);
    const [greetingText, setGreetingText] = useState('');
    const { createSession } = useChatStore();
    
    useEffect(() => {
        function getGreeting(): string {
            const currentHour = new Date().getHours();
            if (currentHour >= 5 && currentHour < 12) {
                return "早上好";
            } else if (currentHour >= 12 && currentHour < 14) {
                return "中午好";
            } else if (currentHour >= 14 && currentHour < 18) {
                return "下午好";
            } else {
                return "晚上好";
            }
        }
        setGreetingText((getGreeting()));
    }, []);

    const newChat = async (text: string, attachments?: Array<{ mimeType: string; data: string }>) => {
        const session = await createSession({
            modelId: 'gpt-4o',
            value: text,
            files: attachments || []
        });
        console.log('Created session:', session);
    };

    return (
        <>
            {/* <ChatHeader /> */}
            {showGuideAlert &&
                <div className='m-6'>
                    <Alert message={'12312'}
                        type='warning'
                        showIcon={true}
                    />
                </div>
            }
            <div className='flex w-full grow flex-col items-center justify-center h-full'>
                <div className='container max-w-3xl mx-auto -mt-16 relative items-center justify-center'>
                    <GreetingHeader greetingText={greetingText} />
                    <AdaptiveTextarea model={'gpt-4o'} submit={newChat} />
                </div>
            </div>
        </>
    );
} 