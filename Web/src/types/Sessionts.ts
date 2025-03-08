export interface CreateSession {
    name: string,
    description: string,
    modelId: string,
}


export interface CreateSessionInput {
    modelId: string;
    value: string;
    files?: any[];
}