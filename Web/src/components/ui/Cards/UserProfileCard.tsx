import React from 'react';
import { 
  Card, 
  Typography, 
  Avatar, 
  Space, 
  Dropdown, 
  Menu, 
  Button, 
  Divider,
  theme
} from 'antd';
import { 
  TeamOutlined, 
  SettingOutlined, 
  LogoutOutlined, 
  CreditCardOutlined, 
  DownOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

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

export interface UserType {
  email?: string;
  username?: string;
  avatar?: string;
  plan?: 'free' | 'pro' | 'team';
  team?: string;
}

export interface UserProfileCardProps {
  user?: UserType;
  collapsed?: boolean;
  onLogout?: () => void;
  onSwitchTeam?: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  collapsed = false,
  onLogout,
  onSwitchTeam
}) => {
  const navigate = useNavigate();
  const { token } = useToken();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  const handleSwitchTeam = () => {
    if (onSwitchTeam) {
      onSwitchTeam();
    }
  };

  const dropdownContent = (
    <div style={{ 
      backgroundColor: token.colorBgContainer, 
      boxShadow: '0 3px 6px rgba(25, 118, 210, 0.15)', 
      borderRadius: '8px',
      width: '240px',
      overflow: 'hidden',
      border: `1px solid ${medicalColors.border}`
    }}>
      <div style={{ padding: '16px' }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>{user?.email || '用户邮箱'}</Text>
        
        <Space direction="vertical" style={{ width: '100%', marginTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar 
              size={40} 
              style={{ 
                background: `linear-gradient(135deg, ${medicalColors.primary} 0%, ${medicalColors.accent} 100%)`,
                color: '#fff'
              }}
            >
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <div>
              <Text strong style={{ fontSize: '16px', display: 'block', color: medicalColors.primary }}>{user?.username || '用户'}</Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>{user?.plan === 'free' ? '免费版' : user?.plan === 'pro' ? '专业版' : '团队版'}</Text>
            </div>
          </div>
          
          <Button 
            icon={<TeamOutlined />} 
            block 
            style={{ 
              marginTop: '12px', 
              textAlign: 'left', 
              height: 'auto',
              borderRadius: '8px',
              backgroundColor: medicalColors.secondary,
              borderColor: medicalColors.border
            }}
            onClick={handleSwitchTeam}
            className="medical-chat-button"
          >
            切换团队 {user?.team || ''}
          </Button>
        </Space>
      </div>

      <Divider style={{ margin: '8px 0', borderColor: medicalColors.border }} />

      <Menu
        mode="vertical"
        style={{ border: 'none', backgroundColor: 'transparent' }}
        items={[
          {
            key: 'billing',
            icon: <CreditCardOutlined style={{ color: medicalColors.primary }} />,
            label: <span style={{ color: medicalColors.primary }}>Billing 计费</span>,
            onClick: () => navigate('/billing')
          },
          {
            key: 'settings',
            icon: <SettingOutlined style={{ color: medicalColors.primary }} />,
            label: <span style={{ color: medicalColors.primary }}>Settings 设置</span>,
            onClick: () => navigate('/settings')
          },
          {
            key: 'signout',
            icon: <LogoutOutlined style={{ color: '#f5222d' }} />,
            label: <span style={{ color: '#f5222d' }}>Sign Out 登出</span>,
            onClick: handleLogout
          }
        ]}
      />
    </div>
  );

  if (collapsed) {
    return (
      <Dropdown
        trigger={['click']}
        dropdownRender={() => dropdownContent}
      >
        <Button
          type="text"
          icon={
            <Avatar 
              size="small" 
              style={{ 
                background: `linear-gradient(135deg, ${medicalColors.primary} 0%, ${medicalColors.accent} 100%)`,
                color: '#fff'
              }}
            >
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
          }
          style={{ 
            width: '100%', 
            marginBottom: 0, 
            padding: '8px 0',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            border: '1px solid transparent',
          }}
          className="user-profile-card"
        />
      </Dropdown>
    );
  }

  return (
    <Dropdown
      trigger={['click']}
      dropdownRender={() => dropdownContent}
    >
      <Card 
        style={{ 
          width: '100%', 
          cursor: 'pointer',
          borderRadius: '8px',
          border: '1px solid transparent',
          backgroundColor: 'transparent',
          boxShadow: 'none'
        }}
        bodyStyle={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        className="user-profile-card"
      >
        <Space>
          <Avatar 
            size="small" 
            style={{ 
              background: `linear-gradient(135deg, ${medicalColors.primary} 0%, ${medicalColors.accent} 100%)`,
              color: '#fff'
            }}
          >
            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <div style={{ maxWidth: '160px', overflow: 'hidden' }}>
            <Text ellipsis strong style={{ fontSize: '14px', display: 'block', color: medicalColors.primary }}>{user?.username || '用户'}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>点击查看个人资料</Text>
          </div>
        </Space>
        <DownOutlined style={{ fontSize: '12px', marginLeft: '40px', color: medicalColors.primary }} />
      </Card>
    </Dropdown>
  );
};

export default UserProfileCard; 