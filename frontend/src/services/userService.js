// src/services/userService.js

import api from "./api";
import { API_ENDPOINTS } from "./apiEndpoints";

import api from './api';

class UserService {
  /**
   * Get all users
   */
  async getAll() {
    const response = await api.get('/users');
    return response.data;
  }

  /**
   * Get user by ID
   */
  async getById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  }

  /**
   * Create new user
   */
  async create(data) {
    const response = await api.post('/users', data);
    return response.data;
  }

  /**
   * Update user
   */
  async update(id, data) {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  }

  /**
   * Delete user
   */
  async delete(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }

  /**
   * Get user's permissions
   */
  async getPermissions(id) {
    const response = await api.get(`/users/${id}/permissions`);
    return response.data;
  }

  /**
   * Update user's permissions
   */
  async updatePermissions(id, permissionIds) {
    const response = await api.put(`/users/${id}/permissions`, {
      permission_ids: permissionIds,
    });
    return response.data;
  }

  /**
   * Get user's community permissions
   */
  async getCommunityPermissions(id) {
    const response = await api.get(`/users/${id}/community-permissions`);
    return response.data;
  }

  /**
   * Update user's community permissions
   */
  async updateCommunityPermissions(id, communityPermissions) {
    const response = await api.put(`/users/${id}/community-permissions`, {
      community_permissions: communityPermissions,
    });
    return response.data;
  }
}

export default new UserService();

  /**
   * Get user by ID
   * @param {string|number} id
   * @returns {Promise}
   */
  getById: async (id) => {
    try {
      const endpoint = API_ENDPOINTS.USER.DETAIL
        ? API_ENDPOINTS.USER.DETAIL(id)
        : `/users/${id}`;
      const response = await api.get(endpoint);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Lỗi khi tải người dùng",
      };
    }
  },

  /**
   * Create new user
   * @param {object} data
   * @returns {Promise}
   */
  create: async (data) => {
    try {
      const response = await api.post(
        API_ENDPOINTS.USER.CREATE || "/users",
        data
      );
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Lỗi khi tạo người dùng",
      };
    }
  },

  /**
   * Update user
   * @param {string|number} id
   * @param {object} data
   * @returns {Promise}
   */
  update: async (id, data) => {
    try {
      const endpoint = API_ENDPOINTS.USER.UPDATE
        ? API_ENDPOINTS.USER.UPDATE(id)
        : `/users/${id}`;
      const response = await api.put(endpoint, data);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Lỗi khi cập nhật người dùng",
      };
    }
  },

  /**
   * Delete user
   * @param {string|number} id
   * @returns {Promise}
   */
  delete: async (id) => {
    try {
      const endpoint = API_ENDPOINTS.USER.DELETE
        ? API_ENDPOINTS.USER.DELETE(id)
        : `/users/${id}`;
      const response = await api.delete(endpoint);
      return {
        success: response.success !== false,
        data: response,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Lỗi khi xóa người dùng",
      };
    }
  },

  /**
   * Reset user password
   * @param {string|number} id
   * @returns {Promise}
   */
  resetPassword: async (id) => {
    try {
      const response = await api.post(`/users/${id}/reset-password`);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Lỗi khi đặt lại mật khẩu",
      };
    }
  },

  /**
   * Update user status
   * @param {string|number} id
   * @param {string} status
   * @returns {Promise}
   */
  updateStatus: async (id, status) => {
    try {
      const response = await api.post(`/users/${id}/toggle-status`, { status });
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Lỗi khi cập nhật trạng thái",
      };
    }
  },

  /**
   * Get user activities
   * @param {string|number} id
   * @returns {Promise}
   */
  getActivities: async (id) => {
    try {
      const response = await api.get(`/users/${id}/activities`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Lỗi khi tải hoạt động",
      };
    }
  },

  /**
   * Update profile
   * @param {object} data
   * @returns {Promise}
   */
  updateProfile: async (data) => {
    try {
      const response = await api.put(
        API_ENDPOINTS.USER.UPDATE_PROFILE || "/profile",
        data
      );

      // Update user in localStorage
      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Lỗi khi cập nhật hồ sơ",
      };
    }
  },

  /**
   * Change password
   * @param {object} data
   * @returns {Promise}
   */
  changePassword: async (data) => {
    try {
      const response = await api.post(
        API_ENDPOINTS.USER.CHANGE_PASSWORD || "/profile/change-password",
        data
      );
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Lỗi khi đổi mật khẩu",
      };
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
        API_ENDPOINTS.USER.CHANGE_AVATAR || "/profile/avatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update user in localStorage
      if (response.data) {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          user.avatar = response.data.avatar;
          localStorage.setItem("user", JSON.stringify(user));
        }
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || "Lỗi khi cập nhật ảnh đại diện",
      };
    }
  },
};

export default userService;
