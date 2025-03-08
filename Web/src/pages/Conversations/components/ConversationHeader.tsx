import React from 'react';
import { Button, Popconfirm, PopconfirmProps, Tooltip } from "antd";
import { useAppStore } from '@/stores/appStore';
import ToggleSidebar from "@/app/images/hideSidebar.svg?react";
import { DeleteOutlined } from '@ant-design/icons';

interface ConversationHeaderProps {
    chatId: string;
}

const ConversationHeader = ({ chatId }: ConversationHeaderProps) => {
    const { isSidebarCollapsed, toggleSidebar } = useAppStore();

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

    return (
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
    );
};

export default ConversationHeader; 