import { create } from 'zustand';
import { ChatStore, useSessionManager } from '@/hooks/SessionManager';
import { initialState } from '@/stores/ChatState';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { StateCreator } from 'zustand/vanilla';
import { createDevtools } from './middleware/createDevtools';





// Create the store using the session manager
export const createStore = create<ChatStore>((...parameters)=> ({
    ...initialState,
    ...useSessionManager(...parameters)
})); 


const devtools = createDevtools('user');

export const useChatStore = createWithEqualityFn<ChatStore>()(
    subscribeWithSelector(devtools(createStore)),
    shallow,
);