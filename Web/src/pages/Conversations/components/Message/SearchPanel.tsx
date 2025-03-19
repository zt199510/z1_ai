import React from 'react';
import { Collapse, Flex, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchResult {
    title: string;
    url: string;
    snippet: string;
    topic?: string;
}

interface SearchPanelProps {
    searchResults: SearchResult[];
}

export const SearchPanel: React.FC<SearchPanelProps> = ({ searchResults }) => {
    // 检查 searchResults 是否有效
    if (!Array.isArray(searchResults) || searchResults.length === 0) return null;

    // 获取第一个搜索结果的主题，如果没有则使用默认文本
    const topic = searchResults[0]?.topic || '相关内容';
    return (
        <Collapse
            expandIconPosition="end"
            className="mt-1"
            defaultActiveKey={['1']}
            bordered={false}
            style={{ background: 'transparent' }}
            items={[
                {
                    key: '1',
                    label: (
                        <Flex align="center" gap={4} className="text-gray-700 hover:text-blue-600 cursor-pointer transition-colors duration-200">
                            <SearchOutlined />
                            <span>关于 <span className="font-medium text-blue-600">{topic}</span> 的搜索结果 ({searchResults.length}条)</span>
                        </Flex>
                    ),
                    children: (
                        <div className="bg-gray-50 rounded-md p-2">
                            <Flex vertical gap={8}>
                                {searchResults.map((result, index) => (
                                    <Card
                                        key={index}
                                        size="small"
                                        className="hover:shadow-md transition-shadow duration-300"

                                    >
                                        <a
                                            href={result.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline font-medium block mb-2"
                                        >
                                            {result.title}
                                        </a>
                                        <div className="text-gray-600 text-sm mb-2 line-clamp-2">
                                            {result.snippet}
                                        </div>
                                        <div className="text-gray-400 text-xs truncate">
                                            {result.url}
                                        </div>
                                    </Card>
                                ))}
                            </Flex>
                        </div>
                    )
                }
            ]}
        />
    );
}; 