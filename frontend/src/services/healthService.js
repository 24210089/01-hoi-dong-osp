// src/services/healthService.js

import api from "./api";
import { API_ENDPOINTS } from "./apiEndpoints";

const healthService = {
  /**
   * Get health records list
   * @param {string} sisterId
   * @returns {Promise}
   */
  getList: async (sisterId) => {
    try {
      const response = await api.get(API_ENDPOINTS.HEALTH.LIST(sisterId));
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get health record detail
   * @param {string} sisterId
   * @param {string} id
   * @returns {Promise}
   */
  getDetail: async (sisterId, id) => {
    try {
      const response = await api.get(API_ENDPOINTS.HEALTH.DETAIL(sisterId, id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create health record
   * @param {string} sisterId
   * @param {Object} data
   * @returns {Promise}
   */
  create: async (sisterId, data) => {
    try {
      const response = await api.post(
        API_ENDPOINTS.HEALTH.CREATE(sisterId),
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update health record
   * @param {string} sisterId
   * @param {string} id
   * @param {Object} data
   * @returns {Promise}
   */
  update: async (sisterId, id, data) => {
    try {
      const response = await api.put(
        API_ENDPOINTS.HEALTH.UPDATE(sisterId, id),
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete health record
   * @param {string} sisterId
   * @param {string} id
   * @returns {Promise}
   */
  delete: async (sisterId, id) => {
    try {
      const response = await api.delete(
        API_ENDPOINTS.HEALTH.DELETE(sisterId, id)
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get latest health record
   * @param {string} sisterId
   * @returns {Promise}
   */
  getLatest: async (sisterId) => {
    try {
      const response = await api.get(API_ENDPOINTS.HEALTH.LATEST(sisterId));
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get health history
   * @param {string} sisterId
   * @returns {Promise}
   */
  getHistory: async (sisterId) => {
    try {
      const response = await api.get(API_ENDPOINTS.HEALTH.HISTORY(sisterId));
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default healthService;
