import React, { useState } from 'react';
import { LinkOutlined } from '@ant-design/icons';
import { Sender } from '@ant-design/x';
import { Button, Flex } from 'antd';
import HeaderTitle from './MessageInputs/HeaderTitle';

interface MessageInputProps {
    submit: (message: string, attachments?: Array<{ mimeType: string; data: string }>, needWebSearch?: boolean, model?: string) => void;
    generateLoading?: boolean;
}

const MessageInput = (props: MessageInputProps) => {
    const {
        submit,
        generateLoading = false
    } = props;
    const [open, setOpen] = useState(true);
    const [text, setText] = useState('');
    const [uploadedImages, setUploadedImages] = useState<Array<{ mimeType: string; data: string; preview: string }>>([]);
    const [needWebSearch, setNeedWebSearch] = useState(false);
    const [selectedModel, setSelectedModel] = useState('gpt-4o');

    const removeImage = (index: number) => {
        const newImages = [...uploadedImages];
        // Release object URL to prevent memory leaks
        URL.revokeObjectURL(newImages[index].preview);
        newImages.splice(index, index + 1);
        setUploadedImages(newImages);
    };

    const handleSubmit = async (text: string) => {
        if (generateLoading) return;
        try {
            await submit(text, uploadedImages, needWebSearch, selectedModel);
            setUploadedImages([]);
            setText('');
        } catch (error) {
            console.error('Error submitting message:', error);
        }
    };

    const senderHeader = (
        <Sender.Header closable={false} title={
            <HeaderTitle
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                needWebSearch={needWebSearch}
                setNeedWebSearch={setNeedWebSearch}
                generateLoading={generateLoading}
            />
        } open={open} >

            {
                uploadedImages.length > 0 && (
                    <Flex wrap gap={12} style={{ paddingBottom: 12 }} className="relative">
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
                                        disabled={generateLoading}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Flex>
                )
            }
        </Sender.Header >
    );
    return (
        <Flex wrap gap={12} style={{ paddingBottom: 12 }} className="relative">
            <Sender
                header={senderHeader}
                prefix={
                    <Button
                        type="text"
                        icon={<LinkOutlined />}
                    />
                }
                value={text}
                onChange={setText}
                disabled={generateLoading}
                loading={generateLoading}
                placeholder={generateLoading ? "AI正在思考中..." : "输入消息..."}
                onSubmit={handleSubmit}
                submitType="enter"
                styles={{
                    input: {
                        backgroundColor: 'transparent',
                        minHeight: '22px',
                        maxHeight: '100px'
                    }
                }}
            />
        </Flex>
    );
};

export default MessageInput; 