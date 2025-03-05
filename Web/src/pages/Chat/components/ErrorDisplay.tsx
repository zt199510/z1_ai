import React from 'react';
import { Alert, Button } from 'antd';
import '../styles/index.css';

interface ErrorDisplayProps {
    error: Error | null;
    handleRetry: () => void;
    lastUserMessage: string | null;
    loading: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
    error, 
    handleRetry, 
    lastUserMessage, 
    loading 
}) => {
    if (!error) return null;
    
    return (
        <Alert
            message="发生错误"
            description={error.message}
            type="error"
            showIcon
            closable
            action={
                <Button 
                    size="small" 
                    type="primary" 
                    onClick={handleRetry}
                    disabled={!lastUserMessage || loading}
                >
                    重试
                </Button>
            }
            style={{ margin: '0 20px 10px 20px', flexShrink: 0 }}
        />
    );
};

export default ErrorDisplay; 