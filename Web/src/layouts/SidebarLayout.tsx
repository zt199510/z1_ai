import { Outlet, useNavigate } from "react-router-dom";
import { Flexbox } from 'react-layout-kit';
import { useEffect } from "react";
import "../styles/main.css"; // 导入样式文件
import SideMenu from "../pages/sysmenu/";

export default function SidebarLayout() {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/auth/login')
    }

  }, [])

  return (
    <Flexbox style={{
      height: '100vh',
      width: '100vw',
    }}
      horizontal
    >
      <SideMenu />
      <div style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
        <Outlet />
      </div>
    </Flexbox>
  )
} 