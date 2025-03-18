import React from 'react';
import { Space } from 'antd';
import ModelSelector from './ModelSelector';
import WebSearchButton from './WebSearchButton';

export interface HeaderTitleProps {
    selectedModel: string;
    setSelectedModel: (model: string) => void;
    needWebSearch: boolean;
    setNeedWebSearch: (need: boolean) => void;
    generateLoading?: boolean;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({
    selectedModel,
    setSelectedModel,
    needWebSearch,
    setNeedWebSearch,
    generateLoading = false
}) => {
    return (
        <Space>
            <ModelSelector
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                disabled={generateLoading}
            />
            <WebSearchButton
                needWebSearch={needWebSearch}
                setNeedWebSearch={setNeedWebSearch}
                disabled={generateLoading}
            />
        </Space>
    );
};

export default React.memo(HeaderTitle);
