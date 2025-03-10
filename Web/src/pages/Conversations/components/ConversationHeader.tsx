import React, { useState } from 'react';
import { Button, Popconfirm, PopconfirmProps, Tooltip, Alert, Modal } from "antd";
import { useAppStore } from '@/stores/appStore';
import ToggleSidebar from "@/app/images/hideSidebar.svg?react";
import { DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { useChatStore } from '@/stores/chatStore';

interface ConversationHeaderProps {
    chatId: string;
    showGuideAlert?: boolean;
    onGuideAlertClose?: () => void;
}

const ConversationHeader = ({ chatId, showGuideAlert = false, onGuideAlertClose }: ConversationHeaderProps) => {
    const { isSidebarCollapsed, toggleSidebar } = useAppStore();
    const [isHistorySettingOpen, setIsHistorySettingOpen] = useState(false);
    const { setMessages } = useChatStore();

    const deleteChat = async () => {
        if (chatId) {
            // Implement delete chat logic here
            console.log('Deleting chat:', chatId);
            // Example: await deleteChatInServer(chatId);
            // Redirect to another chat or home page
        }
    };

    const confirmDelete: PopconfirmProps['onConfirm'] = (e) => {
        deleteChat();
    };

    const cancelDelete: PopconfirmProps['onCancel'] = (e) => { };

    const handleHistorySettingOpenChange = (open: boolean) => {
        setIsHistorySettingOpen(open);
    };

    const handleClearHistory = (): void => {
        Modal.confirm({
            title: '清空对话历史',
            content: '确定要清空所有对话历史吗？此操作不可撤销。',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                setMessages([]);
            },
            onCancel() { },
        });
    };

    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    <Button
                        type="text"
                        icon={<ToggleSidebar />}
                        onClick={toggleSidebar}
                        className="mr-4"
                    />
                    <h1 className="text-lg font-medium">对话详情</h1>
                </div>
                <div className="flex items-center">
                    <Tooltip title="设置">
                        <Button
                            icon={<SettingOutlined />}
                            type="text"
                            onClick={() => handleHistorySettingOpenChange(true)}
                            className="mr-1"
                        />
                    </Tooltip>

                    <Tooltip title="删除对话">
                        <Popconfirm
                            title="删除对话"
                            description="确定要删除这个对话吗？此操作不可撤销。"
                            onConfirm={confirmDelete}
                            onCancel={cancelDelete}
                            okText="确定"
                            cancelText="取消"
                        >
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                danger
                            />
                        </Popconfirm>
                    </Tooltip>
                </div>
            </div>
            
            {showGuideAlert && (
                <div className='mx-6 mb-2'>
                    <Alert
                        message="对话指南"
                        type='info'
                        showIcon={true}
                        closable
                        onClose={onGuideAlertClose}
                    />
                </div>
            )}
        </div>
    );
};

export default ConversationHeader; 