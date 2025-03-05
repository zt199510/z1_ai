import React from 'react';
import { Prompts } from '@ant-design/x';
import { PromptItem } from '../types';
import '../styles/index.css';

interface PromptSuggestionsProps {
    items: PromptItem[];
    onItemClick: (info: { data: any }) => void;
}

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ items, onItemClick }) => {
    return (
        <Prompts
            items={items}
            onItemClick={onItemClick}
            title="你可能想问："
            wrap
        />
    );
};

export default PromptSuggestions; 