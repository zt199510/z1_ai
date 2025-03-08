
import { SessionManager, useSessionManager } from '@/hooks/SessionManager';
import { ChatState, initialState } from '@/stores/ChatState';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';
import { createDevtools } from './middleware/createDevtools';


/**
 * 聊天存储类型
 * 结合了聊天状态和会话管理功能
 */
export type ChatStore = ChatState & SessionManager;


// Create the store using the session manager
const createStore: StateCreator<ChatStore, [['zustand/devtools', never]]> = (...parameters) => ({
    ...initialState,
    ...useSessionManager(...parameters)
});



const devtools = createDevtools('user');

export const useChatStore = createWithEqualityFn<ChatStore>()(
    subscribeWithSelector(devtools(createStore)),
    shallow,
);