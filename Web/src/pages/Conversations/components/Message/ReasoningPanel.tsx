import React from 'react';
import { Collapse, Flex } from 'antd';
import { BulbOutlined } from '@ant-design/icons';

interface ReasoningPanelProps {
    reasoningUpdate: string;
}

export const ReasoningPanel: React.FC<ReasoningPanelProps> = ({ reasoningUpdate }) => {
    if (!reasoningUpdate) return null;

    return (
        <Collapse
            expandIconPosition="end"
            className="mt-1"
            defaultActiveKey={['1']}
            items={[
                {
                    key: '1',
                    label: (
                        <Flex align="center" gap={4} className="text-gray-700">
                            <BulbOutlined />
                            <span>查看推理过程</span>
                        </Flex>
                    ),
                    children: (
                        <div className="bg-gray-50 rounded-md p-2">
                            <div className="text-gray-500 text-sm leading-relaxed whitespace-pre-wrap">
                                {reasoningUpdate}
                            </div>
                        </div>
                    )
                }
            ]}
        />
    );
}; 