// frontend/src/layouts/MainLayout/MainLayout.jsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@components/common/Header';
import Sidebar from '@components/common/Sidebar';
import './MainLayout.css';

const MainLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`main-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
      <div className="main-content">
        <Header onToggleSidebar={toggleSidebar} />
        <div className="content-wrapper">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;

  return (
    <div
      className={`main-layout ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}
    >
      <Header toggleSidebar={toggleSidebar} />

      <div className="layout-container">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <main className="main-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
