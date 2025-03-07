
import {
    AssistantRuntimeProvider,
    useLocalRuntime,
    type ChatModelAdapter
} from "@assistant-ui/react";
import { Thread } from '../components/assistant-ui/thread';
import { Layout } from 'antd';


export default function Desktop() {

    const MyModelAdapter: ChatModelAdapter = {
        async *run({ messages, abortSignal, context }) {
            // const stream = await backendApi({ messages, abortSignal, context });
            console.log(messages, abortSignal, context);
            console.log("wocaonima ");
            // let text = "";
            // for await (const part of stream) {
            //     text += part.choices[0]?.delta?.content || "";

            //     yield {
            //         content: [{ type: "text", text }],
            //     };
            // }
        },
    };
    const runtime = useLocalRuntime(MyModelAdapter);
    return (
        <AssistantRuntimeProvider runtime={runtime}>
            <Thread />
        </AssistantRuntimeProvider>
    );
} 