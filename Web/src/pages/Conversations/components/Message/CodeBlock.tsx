import React from 'react';
import { message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

interface CodeBlockProps {
    code: string;
    language: string;
    codeId: string;
}

// 代码高亮颜色映射 - VS Code 暗色主题风格
const syntaxHighlight = {
    keyword: '#ffffff',     // public, interface, void 等关键字
    type: '#4EC9B0',       // 类型名称
    string: '#CE9178',     // 字符串
    comment: '#6A9955',    // 注释
    function: '#DCDCAA',   // 方法名
    variable: '#9CDCFE',   // 变量名
    interface: '#4EC9B0',  // 接口名
    property: '#9CDCFE',   // 属性名
    punctuation: '#D4D4D4',// 标点符号
    default: '#D4D4D4'     // 默认颜色
};

// 简单的代码高亮函数
const highlightCode = (code: string, language: string) => {
    // 移除语言标识符和多余空行
    code = code.replace(/^```\w*\n/, '').replace(/```$/, '').trim();

    // 根据语言应用不同的高亮规则
    switch (language.toLowerCase()) {
        case 'csharp':
        case 'cs':
            return code
                // 关键字
                .replace(/\b(public|private|protected|internal|class|interface|enum|struct|get|set|void|string|int|bool|var|using|namespace|return|if|else|for|while|do|break|continue|new|this|base|try|catch|finally)\b/g,
                    match => `<span style="color: ${syntaxHighlight.keyword}">${match}</span>`)
                // 接口和类型
                .replace(/\b(I[A-Z]\w*|[A-Z]\w*(?=\s*[{<]))/g,
                    match => `<span style="color: ${syntaxHighlight.type}">${match}</span>`)
                // 方法名
                .replace(/\b\w+(?=\s*\()/g,
                    match => `<span style="color: ${syntaxHighlight.function}">${match}</span>`)
                // 字符串
                .replace(/(".*?")/g,
                    match => `<span style="color: ${syntaxHighlight.string}">${match}</span>`)
                // 属性
                .replace(/\b\w+(?=\s*{)/g,
                    match => `<span style="color: ${syntaxHighlight.property}">${match}</span>`)
                // 变量名
                .replace(/\b([a-z]\w*)\b(?!\()/g,
                    match => `<span style="color: ${syntaxHighlight.variable}">${match}</span>`);
        default:
            return code;
    }
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, codeId }) => {
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            message.success('代码已复制到剪贴板');
        } catch (err) {
            console.error('Failed to copy code:', err);
            message.error('复制失败');
        }
    };

    return (
        <div className="relative group">
            <div className="bg-[#1E1E1E] rounded-md overflow-x-auto">
                <div className="flex justify-between items-center px-4 py-2 border-b border-[#333333]">
                    <span className="text-[#3794FF] text-xs">{language || 'C#'}</span>
                    <button
                        onClick={handleCopy}
                        className="text-[#3794FF] hover:text-white text-xs px-2 py-1 rounded transition-colors cursor-pointer flex items-center gap-1"
                    >
                        <CopyOutlined />
                        <span>复制</span>
                    </button>
                </div>
                <pre className="text-[#D4D4D4] font-mono text-sm px-4 py-3 m-0">
                    <code dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }} />
                </pre>
            </div>
        </div>
    );
}; 