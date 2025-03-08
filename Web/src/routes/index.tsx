import { lazy, Suspense } from "react";
import SidebarLayout from "../layouts/SidebarLayout";
import LoadingSpinner from "@/components/LoadingSpinner";
// 懒加载所有页面组件
const HomePage = lazy(() => import("../pages/index"));
const RegisterPage = lazy(() => import("../pages/Account/Registers"));
const LoginPage = lazy(() => import("../pages/Account/Login"));
const AboutPage = lazy(() => import("../pages/about"));
const UserProfilePage = lazy(() => import("../pages/Users/UserInfo/UserProfile"));
const ChatPage = lazy(() => import("../pages/ChatWelcome"));
const ConversationsPage = lazy(() => import("../pages/Conversations"));
// 路由配置
export const routes = [
  // 主布局路由
  {
    path: '/',
    element: <SidebarLayout />,
    children: [
      {
        index: true,
        element: <Suspense fallback={<LoadingSpinner />}><ChatPage /></Suspense>,
      },
      {
        path: 'conversations',
        element: <Suspense fallback={<LoadingSpinner />}><ConversationsPage /></Suspense>,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'users/profile',
        element: <Suspense fallback={<LoadingSpinner />}><UserProfilePage /></Suspense>,
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
    element: <LoginPage />,
  },
];

export default routes;
