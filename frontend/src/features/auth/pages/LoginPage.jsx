// src/features/auth/pages/LoginPage.jsx

// frontend/src/features/auth/pages/LoginPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "@context/AuthContext";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login(formData.username, formData.password);

      if (response.success) {
        navigate("/dashboard");
      } else {
        setError(response.error || "Đăng nhập thất bại");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="login-card shadow-lg">
      <Card.Body className="p-5">
        {/* Logo & Title */}
        <div className="text-center mb-4">
          <div className="login-logo mb-3">
            <i className="fas fa-church fa-3x text-primary"></i>
          </div>
          <h3 className="fw-bold mb-2">Hệ Thống Quản Lý</h3>
          <p className="text-muted">Đăng nhập để tiếp tục</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError("")}>
            <i className="fas fa-exclamation-circle me-2"></i>
            {error}
          </Alert>
        )}

        {/* Login Form */}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="fas fa-user me-2"></i>
              Tên đăng nhập
            </Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập"
              required
              autoFocus
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
              <i className="fas fa-lock me-2"></i>
              Mật khẩu
            </Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              required
              disabled={loading}
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100 py-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Đang đăng nhập...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt me-2"></i>
                Đăng nhập
              </>
            )}
          </Button>
        </Form>

        {/* Footer */}
        <div className="text-center mt-4">
          <small className="text-muted">© 2024 Nun Management System</small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LoginPage;
