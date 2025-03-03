import { useState, useEffect } from 'react';

// 用户类型定义
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  plan: 'free' | 'pro' | 'team';
  team?: string;
}

// 模拟用户数据
const mockUser: User = {
  id: '1',
  email: '10335669918@qq.com',
  username: 'zt199510 编号 ZT199510',
  plan: 'free',
  team: '切换团队'
};

export const useAuth = () => {
  // 从本地存储中获取初始登录状态
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const storedAuth = localStorage.getItem('isLoggedIn');
    return storedAuth ? JSON.parse(storedAuth) : false;
  });
  
  // 从本地存储中获取用户信息
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // 当登录状态改变时，更新本地存储
  useEffect(() => {
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
    if (isLoggedIn && !user) {
      // 如果登录但没有用户信息，设置模拟用户
      setUser(mockUser);
    }
  }, [isLoggedIn, user]);

  // 当用户信息改变时，更新本地存储
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // 登录函数
  const login = (email: string, password: string) => {
    // 这里应该是实际的登录逻辑，现在只是模拟
    if (email && password) {
      setIsLoggedIn(true);
      setUser(mockUser);
      return true;
    }
    return false;
  };

  // 登出函数
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
  };

  // 检查是否登录
  const checkAuth = () => {
    return isLoggedIn && user !== null;
  };

  return {
    isLoggedIn,
    user,
    login,
    logout,
    checkAuth
  };
};

export default useAuth; 