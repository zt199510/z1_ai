import { useAppStore } from '@/stores/appStore';
import { Button, Popconfirm, PopconfirmProps, Tooltip } from "antd";
import ToggleSidebar from "@/app/images/hideSidebar.svg?react";
import ModelSelect from '../components/ModelSelect';
import { useEffect } from 'react';
const ChatHeader = (props: { isActionsHidden?: boolean }) => {
    const { isSidebarCollapsed, toggleSidebar, setIsSidebarCollapsed } = useAppStore();
    useEffect(() => {
        console.log('isSidebarCollapsed', isSidebarCollapsed);
        // setIsSidebarCollapsed(true);
    }, [isSidebarCollapsed]);


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

                {/* 
                <Popconfirm
                    title={t('deleteCurrentChat')}
                    description={t('clearHistoryMessageNotice')}
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                    okText={t('confirm')}
                    cancelText={t('cancel')}
                >
                    <Button type='text'
                        icon={<DeleteOutlined style={{ color: 'gray' }} />} />
                </Popconfirm> */}
            </div>
            }

        </div>
    )
}

export default ChatHeader;
