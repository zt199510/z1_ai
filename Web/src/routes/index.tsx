import { lazy, Suspense } from "react";
import SidebarLayout from "../layouts/SidebarLayout";
import Login from "../pages/Account/Login";
import Chat from "../pages/Chats/chat";
import LoadingSpinner from "@/components/LoadingSpinner";
// 懒加载所有页面组件
const HomePage = lazy(() => import("../pages/index"));
const RegisterPage = lazy(() => import("../pages/Account/Registers"));
// 路由配置
export const routes = [
  // 主布局路由
  {
    path: '/',
    element: <SidebarLayout />,
    children: [
      {
        index: true,
        element: <Suspense fallback={<LoadingSpinner />}><HomePage /></Suspense>,
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
        path: '*',
        element: <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">404 - 页面未找到</h1>
          <p>您访问的页面不存在。</p>
        </div>,
      },
    ],
  },
  {
    path: '/auth/register',
    element: <RegisterPage />,
  },
  {
    path: '/auth/login',
    element: <Login />,
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
  // 聊天路由
  {
    path: '/medical-chat',
    element: <SidebarLayout />,
    children: [
      {
        index: true,
        element: <Chat />,
      },
    ],
  },
];

export default routes;
