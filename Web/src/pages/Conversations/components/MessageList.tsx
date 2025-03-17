import React, { useEffect, useRef, useState } from 'react';
import { Spin, Avatar, Tooltip, Typography, Flex, Button, message } from 'antd';
import { UserOutlined, RobotOutlined, CopyOutlined, CheckOutlined } from '@ant-design/icons';
import { useChatStore } from '@/stores/chatStore';
import { Bubble, type BubbleProps } from '@ant-design/x';
import markdownit from 'markdown-it';

interface MessageListProps {
    chatId: string;
}

// 代码高亮颜色映射 - VS Code 暗色主题风格
const syntaxHighlight = {
    keyword: '#569CD6',     // public, interface, void 等关键字
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

export const MessageList = ({ chatId }: MessageListProps) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const [aiAvatar, setAiAvatar] = useState<string | null>(null);
    const [avatarsLoaded, setAvatarsLoaded] = useState<boolean>(false);
    const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
    const { messages, generateLoading } = useChatStore();
    const md = markdownit({ html: true, breaks: true });

    // 添加事件委托处理复制功能
    useEffect(() => {
        const handleCopy = async (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const copyButton = target.closest('[data-copy-button]');
            if (copyButton) {
                const codeId = copyButton.getAttribute('data-code-id');
                const code = copyButton.getAttribute('data-code-content');
                if (codeId && code) {
                    try {
                        await navigator.clipboard.writeText(code);
                        copyButton.textContent = '已复制';
                        message.success('代码已复制到剪贴板');
                        setTimeout(() => {
                            copyButton.textContent = '复制';
                        }, 2000);
                    } catch (err) {
                        console.error('Failed to copy code:', err);
                        message.error('复制失败');
                    }
                }
            }
        };

        document.addEventListener('click', handleCopy);
        return () => document.removeEventListener('click', handleCopy);
    }, []);

    const renderMarkdown: BubbleProps['messageRender'] = (content) => {
        const html = md.render(content || '');
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // 为每个代码块添加复制按钮和高亮
        tempDiv.querySelectorAll('pre code').forEach((codeElement, index) => {
            const codeId = `code-${index}`;
            const code = codeElement.textContent || '';
            const preElement = codeElement.parentElement;
            if (preElement) {
                const wrapper = document.createElement('div');
                wrapper.className = 'relative group';
                
                // 获取语言
                const languageMatch = code.match(/^```(\w+)/);
                const language = languageMatch ? languageMatch[1] : '';
                const cleanCode = code.replace(/^```\w*\n/, '').replace(/```$/, '').trim();
                
                // 创建代码容器
                const codeContainer = document.createElement('div');
                codeContainer.className = 'bg-[#1E1E1E] rounded-md overflow-x-auto';
                
                // 创建代码头部
                const codeHeader = document.createElement('div');
                codeHeader.className = 'flex justify-between items-center px-4 py-2 border-b border-[#333333]';
                
                // 语言标签
                const languageLabel = document.createElement('span');
                languageLabel.className = 'text-[#3794FF] text-xs';
                languageLabel.textContent = language || 'C#';
                
                // 复制按钮 - 使用数据属性存储相关信息
                const copyButton = document.createElement('button');
                copyButton.className = 'text-[#3794FF] hover:text-white text-xs px-2 py-1 rounded transition-colors cursor-pointer';
                copyButton.textContent = '复制';
                copyButton.setAttribute('data-copy-button', '');
                copyButton.setAttribute('data-code-id', codeId);
                copyButton.setAttribute('data-code-content', cleanCode);
                
                // 代码内容
                const codeContent = document.createElement('pre');
                codeContent.className = 'text-[#D4D4D4] font-mono text-sm px-4 py-3 m-0';
                codeContent.style.backgroundColor = '#1E1E1E';
                codeContent.innerHTML = highlightCode(cleanCode, language);
                
                // 组装代码块
                codeHeader.appendChild(languageLabel);
                codeHeader.appendChild(copyButton);
                codeContainer.appendChild(codeHeader);
                codeContainer.appendChild(codeContent);
                wrapper.appendChild(codeContainer);
                
                preElement.parentNode?.replaceChild(wrapper, preElement);
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

    // Load user avatar
    useEffect(() => {
        const loadUserAvatar = async () => {
            try {
                setUserAvatar('https://api.dicebear.com/7.x/avataaars/svg?seed=user123');
            } catch (error) {
                console.error('Failed to load user avatar:', error);
                setUserAvatar(null);
            }
        };

        const loadAiAvatar = async () => {
            try {
                setAiAvatar('https://api.dicebear.com/7.x/bottts/svg?seed=ai456');
            } catch (error) {
                console.error('Failed to load AI avatar:', error);
                setAiAvatar(null);
            }
        };

        Promise.all([loadUserAvatar(), loadAiAvatar()])
            .finally(() => setAvatarsLoaded(true));
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const renderMessage = (message: any) => {
        const isUser = message.role === 'user';
        const bubbleProps: BubbleProps = {
            content: message.texts[0].text,
            placement: isUser ? 'end' : 'start',
            avatar: isUser ? (
                <Avatar
                    icon={<UserOutlined />}
                    style={{
                        backgroundColor: userAvatar ? 'transparent' : '#52c41a',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                    }}
                    size={40}
                    src={userAvatar}
                />
            ) : (
                <Avatar
                    icon={<RobotOutlined />}
                    style={{
                        backgroundColor: aiAvatar ? 'transparent' : '#1890ff',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                    }}
                    size={40}
                    src={aiAvatar}
                />
            ),
            variant: isUser ? 'filled' : 'outlined',
            shape: 'round',
            messageRender: renderMarkdown,
            styles: {
                content: {
                    maxWidth: '70%',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                }
            }
        };

        return (
            <div key={message.id} className="mb-4">
                <Bubble {...bubbleProps} />
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-grow overflow-auto p-4">
                {generateLoading && messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <Spin size="large" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-gray-500">
                        暂无消息记录
                    </div>
                ) : (
                    <>
                        <Flex gap="middle" vertical>
                            {messages.map(renderMessage)}
                            <div ref={messagesEndRef} />
                        </Flex>
                    </>
                )}
            </div>
        </div>
    );
}; 
