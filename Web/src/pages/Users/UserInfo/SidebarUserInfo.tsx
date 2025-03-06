import React, { useEffect, useState } from 'react';
import { Avatar, Button, Tooltip, message } from 'antd';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { UserDto } from '../../../types/User';

const SidebarUserInfo: React.FC = () => {
    const [userData, setUserData] = useState<UserDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);

                // 从 localStorage 获取用户信息
                const userJson = localStorage.getItem('user');

                if (userJson) {
                    const user = JSON.parse(userJson);
                    setUserData(user);
                } else {
                    // 如果没有找到用户信息，可能需要重定向到登录页面
                    message.warning('未找到用户信息，请重新登录');
                    navigate('/auth/login');
                }

                setLoading(false);
            } catch (error) {
                console.error('获取用户数据失败:', error);
                message.error('获取用户信息失败');
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        // 清除本地存储的token和用户信息
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        message.success('已成功退出登录');
        navigate('/auth/login');
    };

    const handleViewProfile = () => {
        navigate('/users/profile');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4 border-t border-gray-200">
                <div className="animate-pulse flex space-x-4 w-full">
                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="p-4 border-t border-gray-200">
                <Button
                    type="primary"
                    block
                    onClick={() => navigate('/auth/login')}
                >
                    登录
                </Button>
            </div>
        );
    }

    return (
        <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
                <Avatar
                    size={40}
                    icon={<UserOutlined />}
                    className="cursor-pointer"
                    onClick={handleViewProfile}
                />

                <div className="min-w-0 text-left">
                    <div
                        className="font-medium text-gray-900 truncate cursor-pointer hover:text-blue-500"
                        onClick={handleViewProfile}
                    >
                        {userData.displayName}
                    </div>
                    <div className="text-sm text-gray-500 truncate">{userData.email || userData.userName}</div>
                </div>
            </div>

            <div className="flex justify-between mt-2">
                <Tooltip title="查看个人资料">
                    <Button
                        icon={<UserOutlined />}
                        size="small"
                        onClick={handleViewProfile}
                    >
                        个人资料
                    </Button>
                </Tooltip>

                <Tooltip title="退出登录">
                    <Button
                        icon={<LogoutOutlined />}
                        size="small"
                        danger
                        onClick={handleLogout}
                    >
                        退出
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
};

export default SidebarUserInfo; 