// src/features/users/components/UserCard/UserCard.jsx

import React from "react";
import { Card, Badge, Dropdown } from "react-bootstrap";
import { formatDate } from "@utils";
import "./UserCard.css";

const UserCard = ({ user, onView, onEdit, onDelete, onResetPassword }) => {
  const getRoleBadge = (role) => {
    const roles = {
      admin: { bg: "danger", label: "Quản trị viên" },
      manager: { bg: "primary", label: "Quản lý" },
      staff: { bg: "info", label: "Nhân viên" },
      viewer: { bg: "secondary", label: "Xem" },
    };
    return roles[role] || { bg: "secondary", label: role };
  };

  const getStatusBadge = (status) => {
    return status === "active"
      ? { bg: "success", label: "Đang hoạt động" }
      : { bg: "secondary", label: "Đã khóa" };
  };

  const roleBadge = getRoleBadge(user.role);
  const statusBadge = getStatusBadge(user.status);

  return (
    <Card className="user-card h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="user-avatar">
            {user.avatar ? (
              <img src={user.avatar} alt={user.full_name} />
            ) : (
              <div className="avatar-placeholder">
                <i className="fas fa-user"></i>
              </div>
            )}
          </div>
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" size="sm" className="user-actions">
              <i className="fas fa-ellipsis-v"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => onView(user)}>
                <i className="fas fa-eye me-2"></i>
                Xem chi tiết
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onEdit(user)}>
                <i className="fas fa-edit me-2"></i>
                Chỉnh sửa
              </Dropdown.Item>
              <Dropdown.Item onClick={() => onResetPassword(user)}>
                <i className="fas fa-key me-2"></i>
                Đặt lại mật khẩu
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item
                onClick={() => onDelete(user)}
                className="text-danger"
              >
                <i className="fas fa-trash me-2"></i>
                Xóa
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="text-center mb-3">
          <h6 className="user-name mb-1">{user.full_name}</h6>
          <p className="user-username text-muted mb-2">@{user.username}</p>
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <Badge bg={roleBadge.bg}>{roleBadge.label}</Badge>
            <Badge bg={statusBadge.bg}>{statusBadge.label}</Badge>
          </div>
        </div>

        <div className="user-details">
          {user.email && (
            <div className="detail-item">
              <i className="fas fa-envelope text-primary me-2"></i>
              <span className="text-truncate">{user.email}</span>
            </div>
          )}

          {user.phone && (
            <div className="detail-item">
              <i className="fas fa-phone text-success me-2"></i>
              <span>{user.phone}</span>
            </div>
          )}

          {user.last_login && (
            <div className="detail-item">
              <i className="fas fa-clock text-info me-2"></i>
              <span className="text-muted">
                Đăng nhập: {formatDate(user.last_login)}
              </span>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserCard;
