import React from 'react';
import { Flexbox } from 'react-layout-kit';
import { theme } from 'antd';

interface ModelUsageProps {
    modelUsages?: {
        promptTokens: number;
        completeTokens: number;
        responseTime: number;
    };
}

const formatResponseTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;
    return `${(ms / 60000).toFixed(2)}分钟`;
};

const calculateTokensPerSecond = (completeTokens: number, responseTimeMs: number): number => {
    const responseTimeSeconds = responseTimeMs / 1000;
    if (responseTimeSeconds <= 0) return 0;
    const tokensPerSecond = completeTokens / responseTimeSeconds;
    return Math.round(tokensPerSecond * 100) / 100;
};

export const ModelUsage: React.FC<ModelUsageProps> = ({ modelUsages }) => {
    const { token } = theme.useToken();

    if (!modelUsages) return null;

    const tokensPerSecond = calculateTokensPerSecond(
        modelUsages.completeTokens,
        modelUsages.responseTime
    );

    return (
        <Flexbox horizontal gap={8} style={{ fontSize: '12px', color: token.colorTextSecondary }}>
            <span>提示词: {modelUsages.promptTokens}</span>
            <span>完成词: {modelUsages.completeTokens}</span>
            <span>响应时间: {formatResponseTime(modelUsages.responseTime)}</span>
            <span>速率: {tokensPerSecond} tokens/s</span>
        </Flexbox>
    );
}; 