import React from 'react';
import HomePage from '../pages/index';
import GlobalLayout from "../layouts/GlobalLayout";
import SidebarLayout from "../layouts/SidebarLayout";
import ChatPage from "../pages/ChatPage";
import Login from "../pages/Login";

// 简单的组件页面
const SimpleComponentsPage = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-4">组件库</h1>
    <p className="mb-4">这是组件库展示页面。</p>
  </div>
);

// 路由配置
export const routes = [
  // 主布局路由
  {
    path: '/',
    element: <SidebarLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        // 懒加载示例
        lazy: async () => {
          const AboutPage = await import('../pages/about').then(module => module.default);
          return { element: <AboutPage /> };
        },
      },
      // 组件库展示页面
      {
        path: 'components',
        element: <SimpleComponentsPage />,
      },
      // 登录页面
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: '*',
        element: <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">404 - 页面未找到</h1>
          <p>您访问的页面不存在。</p>
        </div>,
      },
    ],
  },
  // 聊天界面布局路由
  {
    path: '/chat',
    element: <SidebarLayout />,
    children: [
      {
        index: true,
        element: <ChatPage />,
      },
      // 聊天历史路由
      {
        path: 'history',
        element: <ChatPage />,
      },
      // 聊天设置路由
      {
        path: 'settings',
        element: <div>聊天设置页面</div>,
      },
    ],
  },
  // 社区路由
  {
    path: '/community',
    element: <SidebarLayout />,
    children: [
      {
        index: true,
        element: <div>社区首页</div>,
      },
    ],
  },
  // 图书馆路由
  {
    path: '/library',
    element: <SidebarLayout />,
    children: [
      {
        index: true,
        element: <div>图书馆首页</div>,
      },
    ],
  },
  // 项目路由
  {
    path: '/projects',
    element: <SidebarLayout />,
    children: [
      {
        index: true,
        element: <div>项目首页</div>,
      },
    ],
  },
  // 反馈路由
  {
    path: '/feedback',
    element: <SidebarLayout />,
    children: [
      {
        index: true,
        element: <div>反馈首页</div>,
      },
    ],
  },
];

export default routes;
