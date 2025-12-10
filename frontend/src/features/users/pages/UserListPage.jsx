import React, { useState, useEffect } from 'react';
import {
    </Container>
  Dropdown,
  Form,
  InputGroup,
  Alert,
} from 'react-bootstrap';
import userService from '@services/userService';
import UserForm from '../components/UserForm';
import ProtectedComponent from '@components/common/ProtectedComponent';
import './UserListPage.css';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    loadUsers();
  }, []);
  const loadUsers = async () => {
    try {
      setLoading(true);
  setError('');
  const response = await userService.getAll();
      
      if (response.success) {
        setUsers(response.data);
      } else {
        setError('Không thể tải danh sách người dùng');
      }
    } catch (err) {
      console.error('Load users error:', err);
      setError('Đã có lỗi xảy ra khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };
  const handleCreate = () => {
    setSelectedUser(null);
    setShowForm(true);
  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  const handleDelete = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn xóa người dùng "${user.username}"?`)) {
      return;
    try {
      const response = await userService.delete(user.id);
      
      if (response.success) {
        loadUsers();
      } else {
        alert(response.error || 'Không thể xóa người dùng');
      }
    } catch (err) {
      console.error('Delete user error:', err);
      alert('Đã có lỗi xảy ra khi xóa người dùng');
    }
  const filteredUsers = users.filter(user => {
    const search = searchTerm.toLowerCase();
    return (
  user.username.toLowerCase().includes(search) ||
  (user.full_name && user.full_name.toLowerCase().includes(search)) ||
  user.email.toLowerCase().includes(search)
    );
  });

  return (
    <Container fluid className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="fas fa-users me-2"></i>
            Quản lý Người dùng
          </h2>
          <p className="text-muted mb-0">
            Quản lý tài khoản và phân quyền người dùng
          </p>
        </div>
        <ProtectedComponent permission="users.create">
          <Button variant="primary" onClick={handleCreate}>
            <i className="fas fa-plus me-2"></i>
            Tạo người dùng mới
          </Button>
        </ProtectedComponent>
  </div>

  {/* Error Alert */}
  {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      )}

      {/* Search & Filters */}
      <Card className="mb-4">
        <Card.Body>
          <InputGroup>
            <InputGroup.Text>
              <i className="fas fa-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm theo tên đăng nhập, họ tên, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <Button
                variant="outline-secondary"
                onClick={() => setSearchTerm('')}
              >
                <i className="fas fa-times"></i>
              </Button>
            )}
          </InputGroup>
        </Card.Body>
  </Card>

  {/* Users Table */}
  <Card>
        <Card.Header className="bg-white">
          <h5 className="mb-0">
            <i className="fas fa-list me-2"></i>
            Danh sách Người dùng
            <Badge bg="secondary" className="ms-2">
              {filteredUsers.length}
            </Badge>
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-5">
              <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
              <p className="text-muted">
                {searchTerm ? 'Không tìm thấy người dùng nào' : 'Chưa có người dùng nào'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: '50px' }}>#</th>
                    <th>Tên đăng nhập</th>
                    <th>Họ và tên</th>
                    <th>Email</th>
                    <th className="text-center">Số quyền</th>
                    <th className="text-center">Cộng đoàn</th>
                    <th className="text-center">Trạng thái</th>
                    <th className="text-center">Ngày tạo</th>
                    <th className="text-center" style={{ width: '100px' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="user-avatar me-2">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.username} />
                            ) : (
                              <i className="fas fa-user"></i>
                            )}
                          </div>
                          <strong>{user.username}</strong>
                        </div>
                      </td>
                      <td>{user.full_name || '-'}</td>
                      <td>
                        <i className="fas fa-envelope me-1 text-muted"></i>
                        {user.email}
                      </td>
                      <td className="text-center">
                        <Badge bg="info">
                          <i className="fas fa-shield-alt me-1"></i>
                          {user.permission_count || 0}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Badge bg="success">
                          <i className="fas fa-home me-1"></i>
                          {user.community_count || 0}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Badge bg={user.is_active ? 'success' : 'secondary'}>
                          {user.is_active ? 'Hoạt động' : 'Tạm khóa'}
                        </Badge>
                      </td>
                      <td className="text-center">
                        {new Date(user.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="text-center">
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="light"
                            size="sm"
                            className="btn-action"
                          >
                            <i className="fas fa-ellipsis-v"></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu align="end">
                            <ProtectedComponent permission="users.view">
                              <Dropdown.Item onClick={() => handleEdit(user)}>
                                <i className="fas fa-eye me-2"></i>
                                Xem chi tiết
                              </Dropdown.Item>
                            </ProtectedComponent>
                            <ProtectedComponent permission="users.edit">
                              <Dropdown.Item onClick={() => handleEdit(user)}>
                                <i className="fas fa-edit me-2"></i>
                                Chỉnh sửa
                              </Dropdown.Item>
                            </ProtectedComponent>
                            <ProtectedComponent permission="users.delete">
                              <Dropdown.Divider />
                              <Dropdown.Item
                                className="text-danger"
                                onClick={() => handleDelete(user)}
                              >
                                <i className="fas fa-trash me-2"></i>
                                Xóa
                              </Dropdown.Item>
                            </ProtectedComponent>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* User Form Modal */}
      <UserForm
        show={showForm}
        onHide={() => setShowForm(false)}
        user={selectedUser}
        onSuccess={loadUsers}
      />

    </Container>
  );
}

export default UserListPage;
// src/features/users/pages/UserListPage.jsx

import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Table,
  Badge,
  Pagination,
  Modal,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { userService } from "@services";
import { useTable, useDebounce } from "@hooks";
import { UserForm, UserFilter } from "../components";
import SearchBox from "@components/common/SearchBox";
import LoadingSpinner from "@components/common/Loading/LoadingSpinner";
import Breadcrumb from "@components/common/Breadcrumb";
import StatsCards from "@components/common/StatsCards";
import SearchFilterBar from "@components/common/SearchFilterBar";
import { formatDate } from "@utils";
import "./UserListPage.css";

const UserListPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetPasswordUser, setResetPasswordUser] = useState(null);

  const table = useTable({
    initialPageSize: 12,
  });

  const debouncedSearch = useDebounce(table.searchTerm, 500);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table.sortBy, table.sortOrder]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = table.getTableParams();
      console.log("Fetching users with params:", params);
      const response = await userService.getList(params);
      console.log("User service response:", response);

      if (response.success) {
        setUsers(response.data.items || []);
        table.setTotalItems(response.data.total || 0);
      } else {
        console.error("Failed to fetch users:", response.error);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setShowForm(true);
  };

  const handleView = (user) => {
    navigate(`/users/${user.id}`);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleDelete = async (user) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${user.full_name}?`)
    ) {
      try {
        const response = await userService.delete(user.id);
        if (response.success) {
          alert(response.message || "Đã xóa người dùng thành công");
          fetchUsers();
        } else {
          alert(response.error || "Không thể xóa người dùng");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Có lỗi xảy ra khi xóa người dùng");
      }
    }
  };

  const handleResetPassword = (user) => {
    setResetPasswordUser(user);
    setShowResetPassword(true);
  };

  const handleConfirmResetPassword = async () => {
    try {
      await userService.resetPassword(resetPasswordUser.id);
      setShowResetPassword(false);
      setResetPasswordUser(null);
      alert("Mật khẩu mới đã được gửi qua email");
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      if (selectedUser) {
        await userService.update(selectedUser.id, values);
      } else {
        await userService.create(values);
      }
      setShowForm(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const usersByRole = {
    admin: (users || []).filter((u) => u.role === "admin"),
    superior_general: (users || []).filter(
      (u) => u.role === "superior_general"
    ),
    superior_provincial: (users || []).filter(
      (u) => u.role === "superior_provincial"
    ),
    superior_community: (users || []).filter(
      (u) => u.role === "superior_community"
    ),
    secretary: (users || []).filter((u) => u.role === "secretary"),
    viewer: (users || []).filter((u) => u.role === "viewer"),
  };

  const activeUsers = (users || []).filter((u) => u.status === "active");
  const inactiveUsers = (users || []).filter((u) => u.status === "inactive");

  const handleSort = (key) => {
    table.handleSort(key);
  };

  const renderSortIcon = (key) => {
    if (table.sortBy !== key)
      return <i className="fas fa-sort text-muted ms-1"></i>;
    return table.sortOrder === "asc" ? (
      <i className="fas fa-sort-up ms-1"></i>
    ) : (
      <i className="fas fa-sort-down ms-1"></i>
    );
  };

  const roleLabel = (role) => {
    const map = {
      admin: "Quản trị viên",
      superior_general: "Tổng quyền",
      superior_provincial: "Bề trên Tỉnh",
      superior_community: "Bề trên Cộng đoàn",
      secretary: "Thư ký",
      viewer: "Người xem",
    };
    return map[role] || role || "-";
  };

  const sortedUsers = useMemo(() => {
    const items = [...(users || [])];

    const getValue = (item) => {
      switch (table.sortBy) {
        case "full_name":
          return item.full_name || "";
        case "username":
          return item.username || "";
        case "email":
          return item.email || "";
        case "role":
          return item.role || "";
        case "status":
          return item.status || "";
        case "created_at":
          return item.created_at ? new Date(item.created_at).getTime() : 0;
        default:
          return item.full_name || "";
      }
    };

    items.sort((a, b) => {
      const aVal = getValue(a);
      const bVal = getValue(b);

      if (typeof aVal === "number" && typeof bVal === "number") {
        return table.sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      return table.sortOrder === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    return items;
  }, [users, table.sortBy, table.sortOrder]);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* Breadcrumb */}
      <Breadcrumb
        title="Quản lý Người dùng"
        items={[{ label: "Quản lý Người dùng" }]}
      />

      {/* Statistics */}
      <Row className="g-3 mb-4">
        <Col xs={6} md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Tổng số</small>
                  <h4 className="mb-0">{(users || []).length}</h4>
                </div>
                <div className="stat-icon bg-primary">
                  <i className="fas fa-users"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Đang hoạt động</small>
                  <h4 className="mb-0">{activeUsers.length}</h4>
                </div>
                <div className="stat-icon bg-success">
                  <i className="fas fa-user-check"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Quản trị viên</small>
                  <h4 className="mb-0">{usersByRole.admin.length}</h4>
                </div>
                <div className="stat-icon bg-danger">
                  <i className="fas fa-user-shield"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <small className="text-muted">Đã khóa</small>
                  <h4 className="mb-0">{inactiveUsers.length}</h4>
                </div>
                <div className="stat-icon bg-secondary">
                  <i className="fas fa-user-lock"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search & Filter */}
      <Card className="mb-4 shadow-sm border-0 rounded-3">
        <Card.Body>
          <Row className="align-items-end">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tìm kiếm</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Tên, email, tên đăng nhập..."
                  value={table.searchTerm}
                  onChange={(e) => table.handleSearch(e.target.value)}
                  size="lg"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Vai trò</Form.Label>
                <Form.Select
                  value={table.filters?.role || ""}
                  onChange={(e) =>
                    table.updateFilters({
                      ...table.filters,
                      role: e.target.value,
                    })
                  }
                  size="lg"
                >
                  <option value="">Tất cả</option>
                  <option value="admin">Quản trị viên</option>
                  <option value="superior_general">Tổng quyền</option>
                  <option value="superior_provincial">Bề trên Tỉnh</option>
                  <option value="superior_community">Bề trên Cộng đoàn</option>
                  <option value="secretary">Thư ký</option>
                  <option value="viewer">Người xem</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                  value={table.filters?.status || ""}
                  onChange={(e) =>
                    table.updateFilters({
                      ...table.filters,
                      status: e.target.value,
                    })
                  }
                  size="lg"
                >
                  <option value="">Tất cả</option>
                  <option value="active">Đang hoạt động</option>
                  <option value="inactive">Đã khóa</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Button
                variant="outline-secondary"
                className="w-100"
                size="lg"
                onClick={() => {
                  table.handleSearch("");
                  table.clearFilters();
                }}
              >
                Xóa bộ lọc
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Content */}
      <Card
        className="shadow-sm border-0 rounded-3"
        style={{ borderRadius: "12px", overflow: "hidden" }}
      >
        <Card.Body className="p-0">
          {(users || []).length === 0 ? (
            <div className="text-center py-5">
              <i
                className="fas fa-users text-muted mb-3"
                style={{ fontSize: "3rem" }}
              ></i>
              <h5>Chưa có người dùng</h5>
              <p className="text-muted">Thêm người dùng đầu tiên để bắt đầu</p>
              <Button variant="primary" onClick={handleAdd}>
                <i className="fas fa-plus me-2"></i>
                Thêm Người dùng
              </Button>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover className="mb-0 align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th className="text-nowrap">#</th>
                      <th
                        role="button"
                        onClick={() => handleSort("full_name")}
                        className="text-nowrap"
                      >
                        Họ và tên {renderSortIcon("full_name")}
                      </th>
                      <th
                        role="button"
                        onClick={() => handleSort("username")}
                        className="text-nowrap"
                      >
                        Tên đăng nhập {renderSortIcon("username")}
                      </th>
                      <th
                        role="button"
                        onClick={() => handleSort("email")}
                        className="text-nowrap"
                      >
                        Email {renderSortIcon("email")}
                      </th>
                      <th
                        role="button"
                        onClick={() => handleSort("role")}
                        className="text-nowrap"
                      >
                        Vai trò {renderSortIcon("role")}
                      </th>
                      <th
                        role="button"
                        onClick={() => handleSort("status")}
                        className="text-nowrap"
                      >
                        Trạng thái {renderSortIcon("status")}
                      </th>
                      <th
                        role="button"
                        onClick={() => handleSort("created_at")}
                        className="text-nowrap"
                      >
                        Ngày tạo {renderSortIcon("created_at")}
                      </th>
                      <th className="text-end text-nowrap">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedUsers.map((user, index) => {
                      const isActive = user.status === "active";
                      return (
                        <tr key={user.id}>
                          <td>
                            {(table.currentPage - 1) * table.pageSize +
                              index +
                              1}
                          </td>
                          <td className="fw-semibold text-primary">
                            {user.full_name || "-"}
                          </td>
                          <td>{user.username || "-"}</td>
                          <td>{user.email || "-"}</td>
                          <td>{roleLabel(user.role)}</td>
                          <td>
                            <Badge bg={isActive ? "success" : "secondary"}>
                              {isActive ? "Đang hoạt động" : "Đã khóa"}
                            </Badge>
                          </td>
                          <td className="text-nowrap">
                            {user.created_at
                              ? formatDate(user.created_at)
                              : "-"}
                          </td>
                          <td className="text-end">
                            <Button
                              variant="outline-info"
                              size="sm"
                              className="me-1"
                              onClick={() => handleView(user)}
                              title="Xem chi tiết"
                            >
                              <i className="fas fa-eye"></i>
                            </Button>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-1"
                              onClick={() => handleEdit(user)}
                              title="Chỉnh sửa"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant="outline-warning"
                              size="sm"
                              className="me-1"
                              onClick={() => handleResetPassword(user)}
                              title="Đặt lại mật khẩu"
                            >
                              <i className="fas fa-key"></i>
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(user)}
                              title="Xóa"
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </>
          )}
        </Card.Body>
        {table.totalPages > 1 && (
          <Card.Footer className="bg-white d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Trang {table.currentPage} / {table.totalPages}
            </small>
            <Pagination className="mb-0">
              <Pagination.First
                onClick={() => table.firstPage()}
                disabled={table.currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => table.previousPage()}
                disabled={table.currentPage === 1}
              />
              <Pagination.Item active>{table.currentPage}</Pagination.Item>
              <Pagination.Next
                onClick={() => table.nextPage()}
                disabled={table.currentPage === table.totalPages}
              />
              <Pagination.Last
                onClick={() => table.lastPage()}
                disabled={table.currentPage === table.totalPages}
              />
            </Pagination>
          </Card.Footer>
        )}
      </Card>

      {/* User Form Modal */}
      <UserForm
        show={showForm}
        onHide={() => setShowForm(false)}
        user={selectedUser}
        onSubmit={handleSubmit}
      />

      {/* Reset Password Modal */}
      <Modal
        show={showResetPassword}
        onHide={() => setShowResetPassword(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-key me-2"></i>
            Đặt lại mật khẩu
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Bạn có chắc chắn muốn đặt lại mật khẩu cho người dùng{" "}
            <strong>{resetPasswordUser?.full_name}</strong>?
          </p>
          <p className="text-muted mb-0">
            Mật khẩu mới sẽ được tạo tự động và gửi qua email:{" "}
            <strong>{resetPasswordUser?.email}</strong>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowResetPassword(false)}
          >
            Hủy
          </Button>
          <Button variant="primary" onClick={handleConfirmResetPassword}>
            <i className="fas fa-check me-2"></i>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserListPage;
