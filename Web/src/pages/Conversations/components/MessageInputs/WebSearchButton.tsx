import React, { useState, useCallback } from 'react';
import { GlobalOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd';

export interface WebSearchButtonProps {
    needWebSearch: boolean;
    setNeedWebSearch: (need: boolean) => void;
    disabled?: boolean;
}

const WebSearchButton: React.FC<WebSearchButtonProps> = ({
    needWebSearch,
    setNeedWebSearch,
    disabled = false
}) => {
    const [tooltipVisible, setTooltipVisible] = useState(false);
    
    const handleToggle = useCallback(() => {
        setNeedWebSearch(!needWebSearch);
    }, [needWebSearch, setNeedWebSearch]);
    
    const handleTooltipToggle = useCallback((visible: boolean) => {
        setTooltipVisible(visible);
    }, []);

    return (
        <div
            onMouseEnter={() => handleTooltipToggle(true)}
            onMouseLeave={() => handleTooltipToggle(false)}
        >
            <Tooltip
                title="联网搜索"
                placement="bottom"
                open={tooltipVisible}
                styles={{ root: { zIndex: 1100 } }}
            >
                <Button
                    type={needWebSearch ? 'primary' : 'default'}
                    icon={<GlobalOutlined />}
                    onClick={handleToggle}
                    disabled={disabled}
                    aria-label="联网搜索"
                />
            </Tooltip>
        </div>
    );
};

export default React.memo(WebSearchButton); 