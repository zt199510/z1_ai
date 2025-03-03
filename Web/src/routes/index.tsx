import React from 'react';
import HomePage from '../pages/index';
import GlobalLayout from "../layouts/GlobalLayout";
// 布局组件

// 路由配置
export const routes = [
  {
    path: '/',
    element: <GlobalLayout />,
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
      {
        path: 'components',
        // 组件库展示页面
        lazy: async () => {
          const ComponentsPage = await import('../pages/help/components').then(module => module.default);
          return { element: <ComponentsPage /> };
        },
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
];

export default routes;
