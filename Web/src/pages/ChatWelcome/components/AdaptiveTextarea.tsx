import React from 'react';
import MessageInput from '@/pages/Conversations/components/MessageInput';

interface AdaptiveTextareaProps {
    submit: (message: string, attachments?: Array<{ mimeType: string; data: string }>, needWebSearch?: boolean) => void;
    model?: string;
}

const AdaptiveTextarea = (props: AdaptiveTextareaProps) => {
    const {
        submit,
        model = 'gpt-4o'
    } = props;

    return (
        <div className="w-full">
            <MessageInput
                submit={submit}
                placeholder="开始新的对话..."
                model={model}
            />
        </div>
    );
};

export default AdaptiveTextarea;
