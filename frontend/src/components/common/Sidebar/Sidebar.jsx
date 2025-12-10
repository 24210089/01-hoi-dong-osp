// src/components/common/Sidebar/Sidebar.jsx - AKKHOR STYLE
// frontend/src/components/common/Sidebar/Sidebar.jsx

import React from "react";
import { NavLink } from "react-router-dom";
import { usePermission } from "@hooks/usePermission";
import "./Sidebar.css";

const Sidebar = ({ collapsed, onToggle }) => {
  const { hasPermission } = usePermission();

  const menuItems = [
    {
      title: "Dashboard",
      icon: "fas fa-home",
      path: "/dashboard",
      permission: null,
    },
    {
      title: "Quản lý Nữ Tu",
      icon: "fas fa-users",
      path: "/sisters",
      permission: "sisters.view",
    },
    {
      title: "Cộng Đoàn",
      icon: "fas fa-building",
      path: "/communities",
      permission: "community.view",
    },
    {
      title: "Người Dùng",
      icon: "fas fa-user-cog",
      path: "/users",
      permission: "users.view",
    },
    {
      title: "Báo Cáo",
      icon: "fas fa-chart-bar",
      path: "/reports",
      permission: "report.view",
    },
    {
      title: "Cài Đặt",
      icon: "fas fa-cog",
      path: "/settings",
      permission: "settings.view",
    },
  ];

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <i className="fas fa-church"></i>
          {!collapsed && <span>Nun Management</span>}
        </div>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          // Check permission
          if (item.permission && !hasPermission(item.permission)) {
            return null;
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-menu-item ${isActive ? "active" : ""}`
              }
            >
              <i className={item.icon}></i>
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
