import React, { useState, useRef, useEffect } from 'react';
import { Button, Tooltip, Modal } from 'antd';
import { SendOutlined, FileImageOutlined, CodeOutlined } from '@ant-design/icons';
import { fileToBase64 } from '@/utils/utils';

interface MessageInputProps {
    submit: (message: string, attachments?: Array<{ mimeType: string; data: string }>) => void;
    maxRows?: number;
    lineHeight?: number;
}

const MessageInput = (props: MessageInputProps) => {
    const {
        submit,
        maxRows = 4,
        lineHeight = 24
    } = props;

    const [text, setText] = useState('');
    const [submitBtnDisable, setSubmitBtnDisable] = useState(true);
    const [pending, setPending] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<Array<{ mimeType: string; data: string; preview: string }>>([]);
    const [isCodeModalVisible, setIsCodeModalVisible] = useState(false);
    const [codeContent, setCodeContent] = useState('');
    const [codeLanguage, setCodeLanguage] = useState('javascript');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const codeTextareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [textareaHeight, setTextareaHeight] = useState<number>(40);

    // Auto-resize textarea based on content
    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        // Reset height to auto to get the correct scrollHeight
        textarea.style.height = 'auto';

        // Calculate new height based on content
        const newHeight = Math.min(
            textarea.scrollHeight,
            lineHeight * maxRows
        );

        // Set the new height
        textarea.style.height = `${newHeight}px`;
        setTextareaHeight(newHeight);
    };

    // Update textarea height when text changes
    useEffect(() => {
        adjustTextareaHeight();
        setSubmitBtnDisable(text.trim() === '' && uploadedImages.length === 0);
    }, [text, uploadedImages]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            adjustTextareaHeight();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !submitBtnDisable && !pending) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        if (submitBtnDisable || pending) return;

        setPending(true);
        try {
            await submit(text, uploadedImages);
            setText('');
            setUploadedImages([]);
        } finally {
            setPending(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const newImages = [...uploadedImages];
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                try {
                    const base64 = await fileToBase64(file);
                    newImages.push({
                        mimeType: file.type,
                        data: base64,
                        preview: URL.createObjectURL(file)
                    });
                } catch (error) {
                    console.error('Error converting image to base64:', error);
                }
            }
        }

        setUploadedImages(newImages);
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...uploadedImages];
        // Release object URL to prevent memory leaks
        URL.revokeObjectURL(newImages[index].preview);
        newImages.splice(index, index + 1);
        setUploadedImages(newImages);
    };

    // 打开代码输入模态框
    const showCodeModal = () => {
        setIsCodeModalVisible(true);
    };

    // 处理代码输入
    const handleCodeContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCodeContent(e.target.value);
    };

    // 处理代码语言选择
    const handleCodeLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCodeLanguage(e.target.value);
    };

    // 插入代码块
    const insertCodeBlock = () => {
        if (codeContent.trim()) {
            const codeBlock = `\`\`\`${codeLanguage}\n${codeContent}\n\`\`\``;
            setText(prevText => {
                if (prevText.trim()) {
                    return `${prevText}\n\n${codeBlock}`;
                }
                return codeBlock;
            });
        }
        setIsCodeModalVisible(false);
        setCodeContent('');
    };

    return (
        <div className="relative border rounded-lg p-3 pt-2 pb-3 bg-white">
            {/* Image previews */}
            {uploadedImages.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {uploadedImages.map((image, index) => (
                        <div key={index} className="relative">
                            <img 
                                src={image.preview} 
                                alt="Uploaded" 
                                className="w-16 h-16 object-cover rounded"
                            />
                            <button
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                onClick={() => removeImage(index)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Textarea */}
            <div className="flex items-end">
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={handleTextChange}
                    onKeyDown={handleKeyDown}
                    placeholder="输入消息..."
                    className="w-full resize-none outline-none border-none p-2"
                    style={{ height: `${textareaHeight}px` }}
                />
                
                <div className="flex items-center">
                    {/* Code button */}
                    <Tooltip title="插入代码">
                        <Button
                            type="text"
                            icon={<CodeOutlined />}
                            onClick={showCodeModal}
                            className="mr-1"
                        />
                    </Tooltip>
                    
                    {/* Image upload button */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        multiple
                        className="hidden"
                    />
                    <Tooltip title="上传图片">
                        <Button
                            type="text"
                            icon={<FileImageOutlined />}
                            onClick={() => fileInputRef.current?.click()}
                            className="mr-1"
                        />
                    </Tooltip>
                    
                    {/* Send button */}
                    <Tooltip title="发送消息">
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<SendOutlined />}
                            onClick={handleSubmit}
                            disabled={submitBtnDisable}
                            loading={pending}
                        />
                    </Tooltip>
                </div>
            </div>

            {/* Code Modal */}
            <Modal
                title="插入代码块"
                open={isCodeModalVisible}
                onOk={insertCodeBlock}
                onCancel={() => setIsCodeModalVisible(false)}
                okText="插入"
                cancelText="取消"
            >
                <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        编程语言:
                    </label>
                    <select
                        value={codeLanguage}
                        onChange={handleCodeLanguageChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="typescript">TypeScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="csharp">C#</option>
                        <option value="cpp">C++</option>
                        <option value="php">PHP</option>
                        <option value="ruby">Ruby</option>
                        <option value="go">Go</option>
                        <option value="rust">Rust</option>
                        <option value="swift">Swift</option>
                        <option value="kotlin">Kotlin</option>
                        <option value="sql">SQL</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="json">JSON</option>
                        <option value="xml">XML</option>
                        <option value="yaml">YAML</option>
                        <option value="bash">Bash</option>
                        <option value="powershell">PowerShell</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        代码内容:
                    </label>
                    <textarea
                        ref={codeTextareaRef}
                        value={codeContent}
                        onChange={handleCodeContentChange}
                        className="w-full p-2 border border-gray-300 rounded-md font-mono"
                        rows={10}
                        placeholder="在此输入代码..."
                    />
                </div>
            </Modal>
        </div>
    );
};

export default MessageInput; 