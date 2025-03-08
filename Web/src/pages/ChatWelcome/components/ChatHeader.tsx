import { useAppStore } from '@/stores/appStore';
import { Button, Popconfirm, PopconfirmProps, Tooltip } from "antd";
import ToggleSidebar from "@/app/images/hideSidebar.svg?react";
import ModelSelect from '../components/ModelSelect';
import { useEffect } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
const ChatHeader = (props: { isActionsHidden?: boolean }) => {
    const { isSidebarCollapsed, toggleSidebar, setIsSidebarCollapsed } = useAppStore();
    useEffect(() => {
        console.log('isSidebarCollapsed', isSidebarCollapsed);
        // setIsSidebarCollapsed(true);
    }, [isSidebarCollapsed]);


    const deleteChat = async () => {
        // if (chat && chat.id) {
        //     await deleteChatInServer(chat.id)
        //     const updatedChatList = chatList.filter(i => i.id !== chat.id);
        //     setChatList(updatedChatList);

        //     // 跳转到更新后的第一个聊天（如果存在）
        //     // if (updatedChatList.length > 0) {
        //     //     router.push(`/chat/${updatedChatList[0].id}`);
        //     // } else {
        //     //     router.push('/'); // 如果没有聊天记录，跳回根路径
        //     // }
        // }
    };


    const confirmDelete: PopconfirmProps['onConfirm'] = (e) => {
        deleteChat()
    };

    const cancelDelete: PopconfirmProps['onCancel'] = (e) => { };

    return (
        <div className="h-10 flex w-full bg-gray-50 shadow-sm grow-0  items-center p-2 justify-between">
            <div className='flex items-center'>
                {isSidebarCollapsed &&
                    <Button
                        icon={<ToggleSidebar style={{ 'fontSize': '20px', 'verticalAlign': 'middle' }} />}
                        type='text'
                        onClick={toggleSidebar}
                    />
                }
                <ModelSelect />
            </div>
            {!props.isActionsHidden && <div className='mr-2'>


                <Popconfirm
                    title={('删除当前对话')}
                    description={('当前对话的所有记录将被删除')}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                    okText={('确定')}
                    cancelText={('取消')}
                >
                    <Button type='text'
                        icon={<DeleteOutlined style={{ color: 'gray' }} />} />
                </Popconfirm>
            </div>
            }

        </div>
    )
}

export default ChatHeader;
