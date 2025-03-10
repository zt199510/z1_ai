import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ToggleSidebar from "@/app/images/hideSidebar.svg?react";
import Link from 'antd/lib/typography/Link';
import { useTranslation } from '@/utils/translation';

const InPageCollapsed = () => {
    const { t } = useTranslation();
    
    return (
        <div className='w-full px-4 py-2'>
            <Link href='/chat'>
                <div className="w-full bg-blue-50 rounded-md h-8 text-center p-2 text-xs new-chat-button whitespace-nowrap" style={{ borderRadius: '5px' }}>
                    <PlusOutlined className='mr-2' style={{ color: '#0057ff' }} />{t('newChat')}
                </div>
            </Link>
        </div>
    )
}

export default InPageCollapsed