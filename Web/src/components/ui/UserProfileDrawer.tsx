import React, { useState } from 'react';
import { 
  Drawer, 
  Button, 
  Avatar, 
  Typography, 
  Space, 
  Divider, 
  Menu, 
  Switch,
  Dropdown,
  theme
} from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  CreditCardOutlined, 
  SettingOutlined, 
  LogoutOutlined,
  DownOutlined,
  CheckOutlined,
  DesktopOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;
const { useToken } = theme;

// 用户类型定义
interface UserType {
  email: string;
  username: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'team';
  team?: string;
}

// 组件属性定义
interface UserProfileDrawerProps {
  isLoggedIn: boolean;
  user?: UserType;
  onLogout?: () => void;
  onSwitchTeam?: () => void;
  onUpgradePlan?: () => void;
}

const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  isLoggedIn,
  user = {
    email: '10335669918@qq.com',
    username: 'zt199510 编号 ZT199510',
    plan: 'free',
    team: '切换团队'
  },
  onLogout,
  onSwitchTeam,
  onUpgradePlan
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const { token } = useToken();

  // 如果用户未登录，不显示组件
  if (!isLoggedIn) {
    return null;
  }

  // 主题选项
  const themeOptions = [
    { label: '自动', value: 'auto', icon: <CheckOutlined /> },
    { label: '亮色', value: 'light', icon: <DesktopOutlined /> },
    { label: '暗色', value: 'dark', icon: <DesktopOutlined /> },
  ];

  // 语言选项
  const languageOptions = [
    { label: 'English', value: 'en' },
    { label: '中文', value: 'zh' },
  ];

  // 显示用户计划类型
  const renderPlanType = () => {
    switch (user.plan) {
      case 'free':
        return <Text type="secondary">Free 自由</Text>;
      case 'pro':
        return <Text type="success">Pro 专业版</Text>;
      case 'team':
        return <Text type="warning">Team 团队版</Text>;
      default:
        return <Text type="secondary">Free 自由</Text>;
    }
  };

  // 打开抽屉
  const showDrawer = () => {
    setDrawerOpen(true);
  };

  // 关闭抽屉
  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  // 处理登出
  const handleLogout = () => {
    closeDrawer();
    if (onLogout) {
      onLogout();
    }
  };

  // 处理切换团队
  const handleSwitchTeam = () => {
    if (onSwitchTeam) {
      onSwitchTeam();
    }
  };

  // 处理升级计划
  const handleUpgradePlan = () => {
    closeDrawer();
    if (onUpgradePlan) {
      onUpgradePlan();
    }
  };

  return (
    <>
      {/* 用户信息栏 - 点击打开抽屉 */}
      <div 
        onClick={showDrawer}
        style={{
          position: 'fixed',
          left: 0,
          bottom: 0,
          width: '240px',
          padding: '12px',
          background: token.colorBgContainer,
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 1000,
        }}
      >
        <Space>
          <Avatar 
            size="small" 
            style={{ 
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#fff'
            }}
          >
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <div style={{ maxWidth: '160px', overflow: 'hidden' }}>
            <Text ellipsis style={{ fontSize: '14px', display: 'block' }}>{user.username}</Text>
            {renderPlanType()}
          </div>
        </Space>
        <DownOutlined style={{ fontSize: '12px', color: token.colorTextSecondary }} />
      </div>

      {/* 用户抽屉菜单 */}
      <Drawer
        title={null}
        placement="left"
        closable={false}
        onClose={closeDrawer}
        open={drawerOpen}
        width={300}
        bodyStyle={{ padding: 0 }}
        style={{ borderRadius: 0 }}
      >
        <div style={{ padding: '16px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>{user.email}</Text>
          
          <Space direction="vertical" style={{ width: '100%', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar 
                size={40} 
                style={{ 
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  color: '#fff'
                }}
              >
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <Text strong style={{ fontSize: '16px', display: 'block' }}>{user.username}</Text>
                {renderPlanType()}
              </div>
            </div>
            
            <Button 
              icon={<TeamOutlined />} 
              block 
              style={{ marginTop: '12px', textAlign: 'left', height: 'auto' }}
              onClick={handleSwitchTeam}
            >
              Switch Team {user.team}
            </Button>
          </Space>
        </div>

        <Divider style={{ margin: '8px 0' }} />

        <Menu
          mode="inline"
          style={{ border: 'none' }}
          items={[
            {
              key: 'billing',
              icon: <CreditCardOutlined />,
              label: 'Billing 计费',
              onClick: () => navigate('/billing')
            },
            {
              key: 'settings',
              icon: <SettingOutlined />,
              label: 'Settings 设置',
              onClick: () => navigate('/settings')
            },
            {
              key: 'signout',
              icon: <LogoutOutlined />,
              label: 'Sign Out 登出',
              onClick: handleLogout
            }
          ]}
        />

        <Divider style={{ margin: '8px 0' }} />

        <div style={{ padding: '0 16px' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>Preferences 偏好</Text>
          
          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Text>Theme 主题</Text>
              <Space>
                {themeOptions.map((option) => (
                  <Button 
                    key={option.value}
                    type={option.value === 'auto' ? 'primary' : 'text'}
                    shape="circle"
                    icon={option.icon}
                    size="small"
                  />
                ))}
              </Space>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text>Language 语言</Text>
              <Dropdown
                menu={{
                  items: languageOptions.map(lang => ({
                    key: lang.value,
                    label: lang.label
                  })),
                  selectable: true,
                  defaultSelectedKeys: ['zh'],
                }}
                trigger={['click']}
              >
                <Button size="small">
                  <Space>
                    <GlobalOutlined />
                    中文
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px' }}>
          <Button 
            type="primary" 
            block 
            onClick={handleUpgradePlan}
          >
            Upgrade Plan 升级计划
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default UserProfileDrawer; 