import React, { useEffect } from 'react'
import { Select, ConfigProvider } from "antd";
import useModelListStore from '@/stores/modelList';
import { Avatar } from "antd";
const ModelSelect = () => {
    const { currentModel, modelList, setModelList, providerList, providerListByKey, allProviderListByKey, setCurrentModelExact, setCurrentModel } = useModelListStore();
    
    // Initialize a default model if none is selected
    useEffect(() => {
        if (modelList.length > 0 && (!currentModel || !currentModel.provider)) {
            // Find the first model with a valid provider
            const defaultModel = modelList.find(model => model.provider && model.selected);
            if (defaultModel) {
                setCurrentModel(defaultModel);
            }
        }
    }, [modelList, currentModel, setCurrentModel]);
    
    const handleChangeModel = (value: string) => {
        const [providerId, modelId] = value.split('|');
        setCurrentModelExact(providerId, modelId);
    };
    const options = providerList.map((provider) => {
        return {
            label: <span>{provider.providerName}</span>,
            title: provider.providerName,
            options: modelList.filter((model) => model.provider.id === provider.id && model.selected).map((model) => ({
                label: (<div className='flex flex-row items-center'>
                    {allProviderListByKey && allProviderListByKey[provider.id]?.providerLogo ?
                        <Avatar
                            size={20}
                            src={allProviderListByKey[provider.id].providerLogo}
                        />
                        :
                        <Avatar
                            size={20}
                            style={{ backgroundColor: '#1c78fa' }}
                        >{allProviderListByKey && allProviderListByKey[provider.id].providerName.charAt(0)}</Avatar>
                    }

                    <span className='ml-1'>{model.displayName}</span>
                </div>),
                // value: model.id,
                value: `${model.provider.id}|${model.id}`,
            }))
        }
    });
    
    // If currentModel or currentModel.provider is null, we can't render the Select component properly
    if (!currentModel || !currentModel.provider) {
        return null; // Or return a loading state or default component
    }
    
    return (
        <ConfigProvider
            theme={{
                components: {
                    Select: {
                        selectorBg: 'transparent',
                        activeBorderColor: 'transparent',
                        activeOutlineColor: 'transparent',
                        hoverBorderColor: 'transparent',
                        colorBorder: 'transparent',
                        multipleSelectorBgDisabled: 'transparent',
                    },
                },
            }}
        >
            <Select
                value={`${currentModel.provider.id}|${currentModel.id}`}
                style={{ width: 230, border: 'none', backgroundColor: 'transparent' }}
                onChange={handleChangeModel}
                listHeight={320}
                options={options}
            />
        </ConfigProvider>
    );
}

export default ModelSelect;
