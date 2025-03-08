import { create } from 'zustand';
import { LLMModelProvider } from '@/types/ModelProvider';
//开放接口
interface IModelListStore {
    currentModel: any;
    modelList: any[];
    providerList: LLMModelProvider[];
    providerListByKey: { [key: string]: LLMModelProvider } | null;
    allProviderListByKey: { [key: string]: LLMModelProvider } | null;
    allProviderList: LLMModelProvider[];
    isPending: Boolean;
    setIsPending: (isPending: Boolean) => void;
    setModelList: (modelList: any[]) => void;
    initAllProviderList: (providers: LLMModelProvider[]) => Promise<void>;
}

const useModelListStore = create<IModelListStore>((set, get) => ({
    currentModel: null,
    modelList: [],
    providerList: [],
    providerListByKey: null,
    allProviderListByKey: null,
    allProviderList: [],
    isPending: true,
    setIsPending: (isPending: Boolean) => {
        set((state) => ({
            ...state,
            isPending, // 更新 isPending 状态
        }));
    },
    setModelList: (modelList: any[]) => set({ modelList }),
    initAllProviderList: async (providers: LLMModelProvider[]) => {
        const providerByKey = providers.reduce<{ [key: string]: LLMModelProvider }>((result, provider) => {
            result[provider.id] = provider;
            return result;
        }, {});

        set((state) => ({
            ...state,
            allProviderList: providers,
            allProviderListByKey: providerByKey,
        }));
    },

    addCustomProvider: async (provider: LLMModelProvider) => {
        set((state) => {
            const newAllProviderList = [...state.allProviderList, provider];
            const newAllProviderListByKey = {
                ...state.allProviderListByKey,
                [provider.id]: provider,
            };
            return {
                ...state,
                allProviderList: newAllProviderList,
                allProviderListByKey: newAllProviderListByKey,
            };
        });
    },

    renameProvider: async (providerId: string, newName: string) => {
        set((state) => {
            // 更新 allProviderList
            const newAllProviderList = state.allProviderList.map((provider) =>
                provider.id === providerId ? { ...provider, providerName: newName } : provider
            );

            // 更新 allProviderListByKey
            const newAllProviderListByKey = {
                ...state.allProviderListByKey,
                [providerId]: {
                    ...state.allProviderListByKey![providerId],
                    providerName: newName,
                },
            };

            return {
                ...state,
                allProviderList: newAllProviderList,
                allProviderListByKey: newAllProviderListByKey,
            };
        });
    },

    deleteCustomProvider: async (providerId: string) => {
        set((state) => {
            const newAllProviderList = state.allProviderList.filter(
                (provider) => provider.id !== providerId
            );

            const { [providerId]: _, ...newAllProviderListByKey } = state.allProviderListByKey || {};

            return {
                ...state,
                allProviderList: newAllProviderList,
                allProviderListByKey: newAllProviderListByKey,
            };
        });
    },
}))

export default useModelListStore;

