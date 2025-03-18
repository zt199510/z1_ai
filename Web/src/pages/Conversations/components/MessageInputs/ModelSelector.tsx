import React, { useState, useMemo, useCallback } from 'react';
import { Space, Select, Tooltip } from 'antd';
import { getIconByName } from '@/utils/iconutil';
import { MODEL_OPTIONS, saveRecentModel, getProviderByModelValue, ModelOption } from './models.config';
import type { FlattenOptionData } from 'rc-select/lib/interface';

export interface ModelSelectorProps {
    selectedModel: string;
    setSelectedModel: (model: string) => void;
    disabled?: boolean;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
    selectedModel,
    setSelectedModel,
    disabled = false
}) => {
    const [tooltipVisible, setTooltipVisible] = useState(false);
    
    // 使用useMemo缓存获取选定模型的标签
    const selectedModelLabel = useMemo(() => {
        const option = MODEL_OPTIONS.find(opt => opt.value === selectedModel);
        return option ? option.label : '';
    }, [selectedModel]);
    
    // 使用useMemo缓存获取选定模型的图标
    const selectedModelIcon = useMemo(() => {
        const provider = getProviderByModelValue(selectedModel);
        return provider ? getIconByName(provider.iconName, 16) : null;
    }, [selectedModel]);
    
    // 使用useCallback优化事件处理函数
    const handleModelChange = useCallback((value: string) => {
        setSelectedModel(value);
        saveRecentModel(value); // 保存最近使用的模型
    }, [setSelectedModel]);
    
    const handleTooltipToggle = useCallback((visible: boolean) => {
        setTooltipVisible(visible);
    }, []);
    
    // 使用useCallback优化渲染选项函数
    const renderOption = useCallback((option: FlattenOptionData<ModelOption>, info: { index: number }) => {
        const provider = getProviderByModelValue(String(option?.value ?? ''));
        const icon = provider ? getIconByName(provider.iconName, 16) : null;
        
        return (
            <Space size={4}>
                {icon}
                <span style={{ fontSize: '14px' }}>
                    {option?.label ?? ''}
                </span>
            </Space>
        );
    }, []);

    return (
        <div 
            style={{ marginRight: '8px' }}
            onMouseEnter={() => handleTooltipToggle(true)}
            onMouseLeave={() => handleTooltipToggle(false)}
        >
            <Tooltip
                title={selectedModelLabel}
                placement="bottom"
                open={tooltipVisible}
            >
                <div>
                    <Select
                        value={selectedModel}
                        onChange={handleModelChange}
                        options={MODEL_OPTIONS}
                        style={{ width: '100%' }}
                        disabled={disabled}
                        optionRender={renderOption}
                        dropdownStyle={{
                            maxHeight: '400px',
                            overflow: 'auto',
                            zIndex: 1100,
                            width: '220px'
                        }}
                        labelRender={() => (
                            <Space size={4}>
                                {selectedModelIcon}
                            </Space>
                        )}
                    />
                </div>
            </Tooltip>
        </div>
    );
};

export default React.memo(ModelSelector); 