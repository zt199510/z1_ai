import React, { useState, useRef, useEffect } from 'react';
import {
  Layout,
  Input,
  Button,
  Typography,
  List,
  Avatar,
  Space,
  Divider
} from 'antd';
import { SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import { Flexbox } from 'react-layout-kit';
import {
  AssistantRuntimeProvider,
  useLocalRuntime,
  type ChatModelAdapter
} from "@assistant-ui/react";
import { Thread } from '../components/assistant-ui/thread';

const { Content } = Layout;
const { Text, Paragraph } = Typography;

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

export default function Mobile() {
  const runtime = useLocalRuntime(MyModelAdapter);
  return (
    <div className="h-full w-full">
      <AssistantRuntimeProvider runtime={runtime}>
        <div className="h-full w-full">
          <Thread />
        </div>
      </AssistantRuntimeProvider>
    </div>
  )
}


