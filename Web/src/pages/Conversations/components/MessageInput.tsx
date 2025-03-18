import React, { useState } from 'react';
import { LinkOutlined, GlobalOutlined } from '@ant-design/icons';
import { Sender } from '@ant-design/x';
import { Button, Flex, Space } from 'antd';
interface MessageInputProps {
    submit: (message: string, attachments?: Array<{ mimeType: string; data: string }>, needWebSearch?: boolean) => void;
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
            await submit(text, uploadedImages, needWebSearch);
            setUploadedImages([]);
            setText('');
        } catch (error) {
            console.error('Error submitting message:', error);
        }
    };



    const senderHeader = (
        <Sender.Header closable={false} title={
            <Space.Compact>
                <Button
                    type={needWebSearch ? 'primary' : 'default'}
                    icon={<GlobalOutlined />}
                    onClick={() => setNeedWebSearch(!needWebSearch)}
                    disabled={generateLoading}
                >
                    联网搜索
                </Button>
            </Space.Compact>
        } open={open} >

            {uploadedImages.length > 0 && (
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
            )}
        </Sender.Header>
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