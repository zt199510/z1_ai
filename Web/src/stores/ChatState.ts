export interface ChatState {
    currentSession?: any;
    sessions: any[];
    messages: any[];
    files: any[];
    sessionConfigExpanded: boolean;
    value?: string;
    generateLoading: boolean;
    // 展开文件
    fileExpanded?: boolean;
    networking:boolean;
}

export const initialState: ChatState = {
    currentSession: {
        id: -1,
    },
    sessionConfigExpanded: false,
    value: '',
    sessions: [],
    messages: [],
    files: [],
    generateLoading: false,
    fileExpanded: false,
    networking:false
}





