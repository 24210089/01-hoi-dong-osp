// src/features/auth/pages/LoginPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        setError(result.error || "Tên đăng nhập hoặc mật khẩu không đúng");
      }
    } catch (err) {
      console.error("Login error:", err);
      // Lấy message lỗi từ backend
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Có lỗi xảy ra. Vui lòng thử lại.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <LoginForm
        onSubmit={handleLogin}
        loading={loading}
        error={error}
        onClearError={() => setError("")}
      />
    </div>
  );
};

export default LoginPage;
