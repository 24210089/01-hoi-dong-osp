// src/services/userService.js

import api from "./api";
import { API_ENDPOINTS } from "./apiEndpoints";

const userService = {
  /**
   * Get user list
   * @param {Object} params
   * @returns {Promise}
   */
  getList: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.USER.LIST, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user detail
   * @param {string} id
   * @returns {Promise}
   */
  getDetail: async (id) => {
    try {
      const response = await api.get(API_ENDPOINTS.USER.DETAIL(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create user
   * @param {Object} data
   * @returns {Promise}
   */
  create: async (data) => {
    try {
      const response = await api.post(API_ENDPOINTS.USER.CREATE, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user
   * @param {string} id
   * @param {Object} data
   * @returns {Promise}
   */
  update: async (id, data) => {
    try {
      const response = await api.put(API_ENDPOINTS.USER.UPDATE(id), data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete user
   * @param {string} id
   * @returns {Promise}
   */
  delete: async (id) => {
    try {
      const response = await api.delete(API_ENDPOINTS.USER.DELETE(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update profile
   * @param {Object} data
   * @returns {Promise}
   */
  updateProfile: async (data) => {
    try {
      const response = await api.put(API_ENDPOINTS.USER.UPDATE_PROFILE, data);

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
      const response = await api.post(API_ENDPOINTS.USER.CHANGE_PASSWORD, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Change avatar
   * @param {File} file
   * @returns {Promise}
   */
  changeAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await api.post(
        API_ENDPOINTS.USER.CHANGE_AVATAR,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update user in localStorage
      if (response.success && response.data) {
        const user = JSON.parse(localStorage.getItem("user"));
        user.avatar = response.data.avatar;
        localStorage.setItem("user", JSON.stringify(user));
      }

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default userService;
