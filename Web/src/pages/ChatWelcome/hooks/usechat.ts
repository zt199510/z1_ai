import { CreateSession } from '../../../types/Sessionts';
import { createSession } from '@/apis/Session'

export const useChat = () => {
    const createChatSession = async (session: CreateSession): Promise<any> => {
        const response = await createSession(session);
        return response;
    }
    return { createSession: createChatSession };
}
