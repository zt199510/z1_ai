import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  MessageOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { Menu, Button, Tooltip } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { SidebarUserInfo } from '../../Users/UserInfo';
import type { MenuProps } from 'antd';
import InPageCollapsed from '@/components/ui/InPageCollapsed';
import ChatListSection from '@/components/ui/ChatListSection';
import { useTranslation } from '@/utils/translation';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const DesktopSidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Add these states and functions for the ChatListSection
  const [chatListStatus, setChatListStatus] = useState<string>('done');
  const [chatList, setChatList] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('');
  const [highlightedChat, setHighlightedChat] = useState<string>('');
  const [newChatName, setNewChatName] = useState<string>('');
  const [renameChatId, setRenameChatId] = useState<string>('');

  const handleOpenChange = (isOpen: boolean, chatId: string) => {
    if (isOpen) {
      setHighlightedChat(chatId);
    } else {
      setHighlightedChat('');
    }
  };

  const deleteChat = (chatId: string) => {
    // Implement delete chat functionality
    console.log('Delete chat:', chatId);
  };

  const showEditModal = () => {
    // Implement show edit modal functionality
    console.log('Show edit modal');
  };

  const toggleStar = (chatId: string, isStar: boolean) => {
    // Implement toggle star functionality
    console.log('Toggle star:', chatId, isStar);
  };

  const getItems = (isStar: boolean) => {
    return [
      {
        key: 'edit',
        label: t('rename'),
      },
      {
        key: 'delete',
        label: t('delete'),
        danger: true,
      },
    ];
  };

  const getBotActionItems = (isStar: boolean) => {
    return [
      {
        key: 'top',
        label: isStar ? t('unpin') : t('pin'),
      },
      {
        key: 'delete',
        label: t('delete'),
        danger: true,
      },
    ];
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };

  // 菜单项配置
  const items: MenuItem[] = [
    getItem('首页', '/', <HomeOutlined />),
    getItem('帮助中心', '/conversations', <QuestionCircleOutlined />),
    getItem('关于我们', '/about', <InfoCircleOutlined />),
  ];

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const pathname = location.pathname;
    // 精确匹配
    if (items.find(item => item && item.key === pathname)) {
      return [pathname];
    }
    // 前缀匹配
    for (const item of items) {
      if (item && 'children' in item && item.children) {
        for (const child of item.children) {
          if (child && child.key === pathname) {
            return [pathname];
          }
        }
      }
      if (item && typeof item.key === 'string' && pathname.startsWith(item.key) && item.key !== '/') {
        return [item.key];
      }
    }
    return ['/'];
  };

  return (
    <div className={`h-full flex flex-col bg-white border-r border-gray-200 transition-all duration-300 overflow-x-hidden ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 flex items-center justify-between">
        {!collapsed && (
          <div className="text-xl font-bold text-gray-800">Z1</div>
        )}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
          className={collapsed ? 'mx-auto' : ''}
        />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          selectedKeys={getSelectedKeys()}
          onClick={handleMenuClick}
          items={items}
          className="border-r-0"
        />
        {!collapsed && (
          <div className="w-full">
            <InPageCollapsed />
            <div className='w-full flex flex-row justify-between items-center border-b border-gray-200 mb-6' />


            {/* Add the ChatListSection component here */}
            <ChatListSection
              t={t}
              chatListStatus={chatListStatus}
              chatList={chatList}
              currentChatId={currentChatId}
              pathname={location.pathname}
              highlightedChat={highlightedChat}
              handleOpenChange={handleOpenChange}
              deleteChat={deleteChat}
              setNewChatName={setNewChatName}
              setRenameChatId={setRenameChatId}
              showEditModal={showEditModal}
              toggleStar={toggleStar}
              getItems={getItems}
              getBotActionItems={getBotActionItems}
            />
          </div>
        )}
      </div>

      {/* 底部用户信息 */}
      <div className={`border-t border-gray-200 overflow-hidden ${collapsed ? 'p-2' : ''}`}>
        {collapsed ? (
          <Tooltip title="查看个人资料" placement="right">
            <div
              className="flex justify-center py-3 cursor-pointer"
              onClick={() => navigate('/users/profile')}
            >
              <UserOutlined style={{ fontSize: '20px' }} />
            </div>
          </Tooltip>
        ) : (
          <SidebarUserInfo />
        )}
      </div>
    </div >
  );
};

export default DesktopSidebar;
