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
  RightOutlined
} from '@ant-design/icons';
import { useState } from "react";
import UserProfileDrawer from "../components/ui/UserProfileDrawer";
import useAuth from "../hooks/useAuth";

const { Sider, Content } = Layout;
const { Text } = Typography;
const { useToken } = theme;

// 最近的聊天记录
const recentChats: any[] = [];

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
      key: 'community',
      icon: <TeamOutlined />,
      label: 'Community 社区',
      onClick: () => navigate('/community'),
    },
    {
      key: 'library',
      icon: <BookOutlined />,
      label: 'Library 图书馆',
      onClick: () => navigate('/library'),
    },
    {
      key: 'projects',
      icon: <ProjectOutlined />,
      label: 'Projects 项目',
      onClick: () => navigate('/projects'),
    },
    {
      key: 'feedback',
      icon: <CommentOutlined />,
      label: 'Feedback 反馈',
      onClick: () => navigate('/feedback'),
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
        onCollapse={(value) => setCollapsed(value)}
        style={{
          background: token.colorBgContainer,
          borderRight: `1px solid ${token.colorBorderSecondary}`,
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 1000,
        }}
      >
        <Flexbox padding={16}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ width: '100%', marginBottom: 16 }}
            onClick={() => navigate('/')}
          >
            {!collapsed && 'New Chat 新聊天'}
          </Button>

          <Menu
            mode="inline"
            selectedKeys={[currentPath.split('/')[1] || 'home']}
            style={{ border: 'none' }}
            items={menuItems}
          />

          {!collapsed && (
            <>
              <Divider style={{ margin: '12px 0' }} />
              <div style={{ padding: '0 8px' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Recent Chats 最近聊天</Text>
                <Space direction="vertical" style={{ width: '100%', marginTop: 8 }}>
                  {recentChats.map(chat => (
                    <Button
                      key={chat.id}
                      type="text"
                      style={{
                        textAlign: 'left',
                        height: 'auto',
                        padding: '4px 8px',
                        whiteSpace: 'normal',
                        lineHeight: '1.5'
                      }}
                    >
                      {chat.title}
                    </Button>
                  ))}
                </Space>
              </div>

              <div style={{ marginTop: 'auto', padding: '8px' }}>

              </div>
            </>
          )}
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

      {/* 用户信息栏和抽屉菜单 */}
      <UserProfileDrawer
        isLoggedIn={isLoggedIn}
        user={user || undefined}
        onLogout={handleLogout}
        onSwitchTeam={handleSwitchTeam}
        onUpgradePlan={handleUpgradePlan}
      />
    </Layout>
  );
} 