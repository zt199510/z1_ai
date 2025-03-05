import { ChatMessage } from '../../../api/chat';

// 定义消息接口
export interface Message extends ChatMessage {
    id: string;
    timestamp: Date;
    loading?: boolean;
    error?: boolean;
}

// 定义提示项接口
export interface PromptItem {
    label: string;
    key: string;
}

// 网络状态类型
export type NetworkStatus = 'online' | 'offline' | 'error';

// 气泡项接口
export interface BubbleItem {
    key: string;
    role: string;
    content: string;
    loading?: boolean;
    error?: boolean;
    avatar: React.ReactNode;
    messageRender: () => React.ReactNode;
} 

export enum ChatRole {
    User = "user",
    System = "system",
    Assistant = "assistant",
}


export interface ChatCompleteParams {
    sessionId: number;
    parentId: number | null;
    text: string;
    fileIds: string[];
    assistantMessageId: number;
    functionCalls: string[];
    networking: boolean;
  }