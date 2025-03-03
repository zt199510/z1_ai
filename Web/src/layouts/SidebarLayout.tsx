import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Flexbox } from 'react-layout-kit';
import { 
  Layout, 
  Menu, 
  Typography, 
  Button, 
  Divider, 
  Space,
  theme
} from "antd";
import { 
  TeamOutlined, 
  BookOutlined, 
  ProjectOutlined, 
  CommentOutlined,
  PlusOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  HeartOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import "../styles/main.css"; // 导入样式文件
import UserProfileCard from "../components/ui/Cards/UserProfileCard";

const { Sider, Content } = Layout;
const { Text } = Typography;
const { useToken } = theme;

// 医疗主题颜色
const medicalColors = {
  primary: '#1976D2', // 医疗蓝
  secondary: '#E3F2FD', // 浅蓝色背景
  accent: '#03A9F4', // 强调色
  success: '#4CAF50', // 成功绿色
  border: '#BBDEFB', // 边框颜色
};

// 最近的聊天记录
const recentChats = [
  { id: '1', title: '极简主义时事通讯' },
  { id: '2', title: 'AI User Interface AI 用户界面' }
];

export default function SidebarLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { token } = useToken();
  const { isLoggedIn, user, logout } = useAuth();

  // 获取当前路径
  const currentPath = location.pathname;

  // 侧边栏菜单项
  const menuItems = [
    {
      key: 'medical-chat',
      icon: <MessageOutlined />,
      label: '医疗咨询 Medical',
      onClick: () => navigate('/medical-chat'),
    },
  ];

  // 处理登出
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // 处理切换团队
  const handleSwitchTeam = () => {
    // 实现切换团队逻辑
    console.log('切换团队');
  };

  // 处理升级计划
  const handleUpgradePlan = () => {
    navigate('/upgrade');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 侧边栏 */}
      <Sider
        width={240}
        collapsible
        collapsed={collapsed}
        trigger={null}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          background: token.colorBgContainer,
          borderRight: `1px solid ${medicalColors.border}`,
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
        }}
        className="medical-theme"
      >
        <Flexbox padding={8} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* 添加顶部的缩放按钮 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            {!collapsed && <Text strong style={{ color: medicalColors.primary }}>Z1 AI <HeartOutlined style={{ color: '#F06292' }} /></Text>}
            <Button 
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ 
                fontSize: '16px', 
                width: '40px', 
                height: '40px', 
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: medicalColors.primary,
                borderRadius: '8px',
              }}
            />
          </div>
          
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            style={{ 
              width: '100%', 
              marginBottom: 16, 
              backgroundColor: medicalColors.primary,
              borderColor: medicalColors.primary,
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)',
              height: '40px'
            }}
            onClick={() => navigate('/')}
            className="medical-chat-button"
          >
            {!collapsed && (
              <>
                <HeartOutlined style={{ marginRight: 4 }} /> New Chat 新聊天
              </>
            )}
          </Button>
          
          <Menu
            mode="inline"
            selectedKeys={[currentPath.split('/')[1] || 'home']}
            style={{ 
              border: 'none',
              backgroundColor: 'transparent'
            }}
            items={menuItems}
          />
          
          {!collapsed && (
            <>
              <Divider style={{ margin: '12px 0', borderColor: medicalColors.border }} />
              <div style={{ padding: '0 0px' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Recent Chats 最近聊天</Text>
                <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
                  {recentChats.map(chat => (
                    <Button 
                      key={chat.id}
                      type="text" 
                      style={{ 
                        textAlign: 'left', 
                        height: '40px',
                        padding: '0px 12px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: '32px',
                        borderRadius: '8px',
                        width: '100%',
                        display: 'block',
                        color: '#333',
                        backgroundColor: medicalColors.secondary,
                        border: `1px solid ${medicalColors.border}`,
                        marginBottom: '0px',
                        transition: 'all 0.3s ease'
                      }}
                      className="medical-chat-button"
                      title={chat.title}
                    >
                      {chat.title}
                    </Button>
                  ))}
                </Space>
              </div>
            </>
          )}
          
          {/* 在底部添加用户卡片 */}
          <div style={{ marginTop: 'auto', paddingTop: 18 }}>
            <UserProfileCard 
              user={user ? {
                email: user.email,
                username: user.username,
                avatar: user.avatar,
                plan: user.plan as 'free' | 'pro' | 'team',
                team: user.team
              } : undefined}
              collapsed={collapsed}
              onLogout={handleLogout}
              onSwitchTeam={handleSwitchTeam}
            />
          </div>
        </Flexbox>
      </Sider>
      
      {/* 主内容区 */}
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: 'all 0.2s' }}>
        <Content style={{ 
          padding: '24px', 
          background: token.colorBgContainer,
          minHeight: '100vh'
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
} 