// src/features/auth/pages/LoginPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { useAuth } from "@context";
import LoginForm from "../components/LoginForm";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (values) => {
    try {
      setLoading(true);
      setError("");

      const result = await login(values);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError("Tên đăng nhập hoặc mật khẩu không đúng");
      }
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={6} lg={5} xl={4}>
            <LoginForm
              onSubmit={handleLogin}
              loading={loading}
              error={error}
              onClearError={() => setError("")}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;
