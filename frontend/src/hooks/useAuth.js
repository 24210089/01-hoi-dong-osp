// src/hooks/useAuth.js

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@services";
import { toast } from "react-toastify";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = authService.getToken();
        const userData = authService.getUser();

        if (token && userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login
   */
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);

      if (response.success) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        toast.success("Đăng nhập thành công!");
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Đăng nhập thất bại!");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
      toast.success("Đăng xuất thành công!");
    } catch (error) {
      console.error("Logout error:", error);
      // Clear state even if API call fails
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  /**
   * Update user data
   */
  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  /**
   * Refresh user data
   */
  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success) {
        setUser(response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Refresh user error:", error);
      throw error;
    }
  }, []);

  /**
   * Change password
   */
  const changePassword = useCallback(async (data) => {
    try {
      const response = await authService.changePassword(data);
      if (response.success) {
        toast.success("Đổi mật khẩu thành công!");
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại!");
      return { success: false, error };
    }
  }, []);

  /**
   * Check permission
   */
  const hasPermission = useCallback(
    (roles) => {
      if (!roles || roles.length === 0) return true;
      if (!user) return false;
      return roles.includes(user.role);
    },
    [user]
  );

  /**
   * Check if user is admin
   */
  const isAdmin = useCallback(() => {
    return user?.role === "admin";
  }, [user]);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    refreshUser,
    changePassword,
    hasPermission,
    isAdmin,
  };
};

export default useAuth;
