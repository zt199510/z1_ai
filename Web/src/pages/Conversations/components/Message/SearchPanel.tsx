import React from 'react';
import { Collapse, Flex } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchPanelProps {
    searchResults: any[];
}

export const SearchPanel: React.FC<SearchPanelProps> = ({ searchResults }) => {
    // 检查 searchResults 是否有效
    if (!Array.isArray(searchResults) || searchResults.length === 0) return null;

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
                            <SearchOutlined />
                            <span>查看搜索结果</span>
                        </Flex>
                    ),
                    children: (
                        <div className="bg-gray-50 rounded-md p-2">
                            <div className="text-gray-500 text-sm leading-relaxed">
                                {searchResults.map((result, index) => (
                                    <div key={index} className="mb-2 last:mb-0">
                                        {result}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                }
            ]}
        />
    );
}; 