// src/services/permissionService.js

import api from "./api";

class PermissionService {
  /**
   * Get all permissions
   */
  async getAll() {
    const response = await api.get('/permissions');
    return response.data;
  }

  /**
   * Get permissions grouped by module
   */
  async getByModule() {
    const response = await api.get('/permissions/by-module');
    return response.data;
  }

  /**
   * Get permission groups
   */
  async getGroups() {
    const response = await api.get('/permissions/groups');
    return response.data;
  }

  /**
   * Get permissions in a group
   */
  async getGroupPermissions(groupId) {
    const response = await api.get(`/permissions/groups/${groupId}/permissions`);
    return response.data;
  }
}

export default new PermissionService();
  /**
   * Get all permissions grouped by module
   * @returns {Promise}
   */
  getAllPermissions: async () => {
    try {
      const response = await api.get("/permissions");
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get permissions by module
   * @param {string} module - Module name
   * @returns {Promise}
   */
  getPermissionsByModule: async (module) => {
    try {
      const response = await api.get(`/permissions/module/${module}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get current user's permissions
   * @returns {Promise}
   */
  getMyPermissions: async () => {
    try {
      const response = await api.get("/permissions/me");
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if current user has a specific permission
   * @param {string} code - Permission code
   * @returns {Promise}
   */
  checkPermission: async (code) => {
    try {
      const response = await api.get(`/permissions/check/${code}`);
      return response;
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if current user has any of the specified permissions
   * @param {string[]} codes - Array of permission codes
   * @returns {Promise}
   */
  checkAnyPermission: async (codes) => {
    try {
      const response = await api.post("/permissions/check-any", { codes });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if current user has all of the specified permissions
   * @param {string[]} codes - Array of permission codes
   * @returns {Promise}
   */
  checkAllPermissions: async (codes) => {
    try {
      const response = await api.post("/permissions/check-all", { codes });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user's permissions
   * @param {number} userId - User ID
   * @returns {Promise}
   */
  getUserPermissions: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/permissions`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user's permissions
   * @param {number} userId - User ID
   * @param {number[]} permissions - Array of permission IDs
   * @returns {Promise}
   */
  updateUserPermissions: async (userId, permissions) => {
    try {
      const response = await api.put(`/users/${userId}/permissions`, {
        permissions,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get user's communities
   * @param {number} userId - User ID
   * @returns {Promise}
   */
  getUserCommunities: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/communities`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update user's communities
   * @param {number} userId - User ID
   * @param {number[]} communities - Array of community IDs
   * @returns {Promise}
   */
  updateUserCommunities: async (userId, communities) => {
    try {
      const response = await api.put(`/users/${userId}/communities`, {
        communities,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default permissionService;

export default permissionService;
