import React from 'react';
import { Typography } from 'antd';
import markdownit from 'markdown-it';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
    content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    const md = markdownit({ html: true, breaks: true });

    const renderMarkdown = (content: string) => {
        const html = md.render(content || '');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // 为每个代码块添加复制按钮和高亮
        tempDiv.querySelectorAll('pre code').forEach((codeElement, index) => {
            const codeId = `code-${index}`;
            const code = codeElement.textContent || '';
            const preElement = codeElement.parentElement;
            if (preElement) {
                // 获取语言
                const languageMatch = code.match(/^```(\w+)/);
                const language = languageMatch ? languageMatch[1] : '';
                const cleanCode = code.replace(/^```\w*\n/, '').replace(/```$/, '').trim();

                // 创建代码块组件
                const codeBlockWrapper = document.createElement('div');
                codeBlockWrapper.innerHTML = `<div id="${codeId}"></div>`;
                preElement.parentNode?.replaceChild(codeBlockWrapper, preElement);

                // 渲染代码块
                const codeBlockElement = document.getElementById(codeId);
                if (codeBlockElement) {
                    const codeBlock = document.createElement('div');
                    codeBlock.innerHTML = `<div class="code-block" data-code="${encodeURIComponent(cleanCode)}" data-language="${language}"></div>`;
                    codeBlockElement.appendChild(codeBlock);
                }
            }
        });

        return (
            <Typography>
                <div
                    className="markdown-content"
                    dangerouslySetInnerHTML={{ __html: tempDiv.innerHTML }}
                />
            </Typography>
        );
    };

    return renderMarkdown(content);
}; 