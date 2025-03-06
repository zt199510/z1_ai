import React, { useState } from 'react';
import {
    AssistantRuntimeProvider,
    useLocalRuntime,
    type ChatModelAdapter
} from "@assistant-ui/react";
import { Thread } from '../components/assistant-ui/thread';
import { Layout } from 'antd';

const MyModelAdapter: ChatModelAdapter = {
    async run({ messages, abortSignal }) {
        // TODO replace with your own API
        const result = await fetch("<YOUR_API_ENDPOINT>", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // forward the messages in the chat to the API
            body: JSON.stringify({
                messages,
            }),
            // if the user hits the "cancel" button or escape keyboard key, cancel the request
            signal: abortSignal,
        });

        const data = await result.json();
        return {
            content: [
                {
                    type: "text",
                    text: data.text,
                },
            ],
        };
    },
};
export default function Desktop() {
    const runtime = useLocalRuntime(MyModelAdapter);
    return (
        <AssistantRuntimeProvider runtime={runtime}>
            <Thread />
        </AssistantRuntimeProvider>
    );
} 