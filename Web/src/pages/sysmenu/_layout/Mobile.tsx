import React, { useState } from 'react';
import { 
  MenuOutlined, 
  CloseOutlined, 
  HomeOutlined, 
  UserOutlined, 
  SettingOutlined, 
  MessageOutlined,
  QuestionCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { Menu, Button, Drawer, Avatar } from 'antd';
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

const MobileSidebar: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const showDrawer = () => {
    setVisible(true);
  };
  
  const closeDrawer = () => {
    setVisible(false);
  };

  const handleMenuClick = (e: { key: string }) => {
    navigate(e.key);
    closeDrawer();
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
    <>
      {/* 移动端顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="text-lg font-bold text-gray-800">系统管理</div>
        <Button 
          type="text" 
          icon={<MenuOutlined style={{ fontSize: '20px' }} />} 
          onClick={showDrawer}
          className="flex items-center justify-center"
        />
      </div>
      
      {/* 侧边抽屉菜单 */}
      <Drawer
        title={
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">系统菜单</span>
            <Button 
              type="text" 
              icon={<CloseOutlined />} 
              onClick={closeDrawer}
              size="small"
            />
          </div>
        }
        placement="left"
        closable={false}
        onClose={closeDrawer}
        open={visible}
        width="80%"
        bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: 'calc(100% - 55px)' }}
        headerStyle={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}
        maskClosable={true}
        destroyOnClose={false}
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <Menu
            mode="inline"
            selectedKeys={getSelectedKeys()}
            onClick={handleMenuClick}
            items={items}
            style={{ borderRight: 'none' }}
          />
        </div>
        
        {/* 底部用户信息 */}
        <div className="border-t border-gray-200 overflow-hidden">
          <SidebarUserInfo />
        </div>
      </Drawer>
      
      {/* 为顶部导航栏预留空间 */}
      <div className="h-14"></div>
    </>
  );
};

export default MobileSidebar;
