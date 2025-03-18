export interface ModelOption {
    value: string;
    label: string;
    providerKey: string; // 用于图标映射
}

export interface ModelProvider {
    key: string;
    iconName: string;
    displayName: string;
}

// 模型提供商配置
export const MODEL_PROVIDERS: Record<string, ModelProvider> = {
    openai: {
        key: 'openai',
        iconName: 'OpenAI',
        displayName: 'OpenAI'
    },
    anthropic: {
        key: 'anthropic',
        iconName: 'Anthropic',
        displayName: 'Anthropic'
    },
    google: {
        key: 'google',
        iconName: 'Gemini',
        displayName: 'Google'
    },
    deepseek: {
        key: 'deepseek',
        iconName: 'DeepSeek',
        displayName: 'DeepSeek'
    }
};

// 模型选项配置
export const MODEL_OPTIONS: ModelOption[] = [
    { value: 'gpt-4o-mini', label: 'GPT-4o mini', providerKey: 'openai' },
    { value: 'gpt-4o', label: 'GPT-4o', providerKey: 'openai' },
    { value: 'chatgpt-4o', label: 'ChatGPT-4o', providerKey: 'openai' },
    { value: 'openai-o1-mini', label: 'OpenAI o1-mini', providerKey: 'openai' },
    { value: 'claude-3-7-sonnet', label: 'Claude 3.7 Sonnet', providerKey: 'anthropic' },
    { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet New', providerKey: 'anthropic' },
    { value: 'claude-3-5-haiku', label: 'Claude 3.5 Haiku', providerKey: 'anthropic' },
    { value: 'claude-3-opus', label: 'Claude 3 Opus', providerKey: 'anthropic' },
    { value: 'gemini-2-flash', label: 'Gemini 2.0 Flash', providerKey: 'google' },
    { value: 'gemini-1-5-pro', label: 'Gemini 1.5 Pro', providerKey: 'google' },
    { value: 'deepseek-v3', label: 'DeepSeek V3', providerKey: 'deepseek' },
];

// 获取用户最近使用的模型（示例实现）
export function getRecentModels(): string[] {
    try {
        const recentModels = localStorage.getItem('recentModels');
        return recentModels ? JSON.parse(recentModels) : ['gpt-4o']; // 默认返回gpt-4o
    } catch (error) {
        console.error('Error getting recent models:', error);
        return ['gpt-4o'];
    }
}

// 保存最近使用的模型（示例实现）
export function saveRecentModel(modelValue: string): void {
    try {
        const recentModels = getRecentModels();
        // 将当前模型放到最前面
        const updatedModels = [
            modelValue,
            ...recentModels.filter(model => model !== modelValue)
        ].slice(0, 5); // 只保留最近5个
        
        localStorage.setItem('recentModels', JSON.stringify(updatedModels));
    } catch (error) {
        console.error('Error saving recent model:', error);
    }
}

// 根据模型值获取对应的提供商信息
export function getProviderByModelValue(modelValue: string): ModelProvider | undefined {
    const model = MODEL_OPTIONS.find(option => option.value === modelValue);
    if (!model) return undefined;
    
    return MODEL_PROVIDERS[model.providerKey];
} 