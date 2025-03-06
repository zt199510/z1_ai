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
  
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
  };

  // 菜单项配置
  const items: MenuItem[] = [
    getItem('首页', '/', <HomeOutlined />),
    getItem('帮助中心', '/help', <QuestionCircleOutlined />),
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
          <div className="text-xl font-bold text-gray-800">系统管理</div>
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
    </div>
  );
};

export default DesktopSidebar;
