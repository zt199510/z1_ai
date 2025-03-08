export interface ChatState {
    currentSession?: any;
    sessions: any[];
    messages: any[];
}

export const initialState: ChatState = {
    currentSession: {
        id: -1,
    },
    sessions: [],
    messages: [],
}





