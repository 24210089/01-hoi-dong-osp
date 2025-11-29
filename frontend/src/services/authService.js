// src/services/authService.js

import api from "./api";
import { API_ENDPOINTS } from "./apiEndpoints";

const authService = {
  /**
   * Login
   * @param {Object} credentials - { username, password }
   * @returns {Promise}
   */
  login: async (credentials) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credentials);

      // Save token and user to localStorage
      if (response.success && response.data?.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout
   * @returns {Promise}
   */
  logout: async () => {
    try {
      await api.post(API_ENDPOINTS.AUTH.LOGOUT);

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      return { success: true };
    } catch (error) {
      // Clear localStorage even if API call fails
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw error;
    }
  },

  /**
   * Get current user
   * @returns {Promise}
   */
  getCurrentUser: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.AUTH.ME);

      // Update user in localStorage
      if (response.success && response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Change password
   * @param {Object} data - { oldPassword, newPassword }
   * @returns {Promise}
   */
  changePassword: async (data) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Forgot password
   * @param {string} email
   * @returns {Promise}
   */
  forgotPassword: async (email) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        email,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reset password
   * @param {Object} data - { token, password }
   * @returns {Promise}
   */
  resetPassword: async (data) => {
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },

  /**
   * Get stored token
   * @returns {string|null}
   */
  getToken: () => {
    return localStorage.getItem("token");
  },

  /**
   * Get stored user
   * @returns {Object|null}
   */
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
