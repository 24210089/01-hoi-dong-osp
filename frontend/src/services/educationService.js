// src/services/educationService.js

import api from "./api";
import { API_ENDPOINTS } from "./apiEndpoints";

const educationService = {
  /**
   * Get education list
   * @param {string} sisterId
   * @returns {Promise}
   */
  getList: async (sisterId) => {
    try {
      const response = await api.get(API_ENDPOINTS.EDUCATION.LIST(sisterId));
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get education detail
   * @param {string} sisterId
   * @param {string} id
   * @returns {Promise}
   */
  getDetail: async (sisterId, id) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.EDUCATION.DETAIL(sisterId, id)
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create education record
   * @param {string} sisterId
   * @param {Object} data
   * @returns {Promise}
   */
  create: async (sisterId, data) => {
    try {
      const response = await api.post(
        API_ENDPOINTS.EDUCATION.CREATE(sisterId),
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update education record
   * @param {string} sisterId
   * @param {string} id
   * @param {Object} data
   * @returns {Promise}
   */
  update: async (sisterId, id, data) => {
    try {
      const response = await api.put(
        API_ENDPOINTS.EDUCATION.UPDATE(sisterId, id),
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete education record
   * @param {string} sisterId
   * @param {string} id
   * @returns {Promise}
   */
  delete: async (sisterId, id) => {
    try {
      const response = await api.delete(
        API_ENDPOINTS.EDUCATION.DELETE(sisterId, id)
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get certificates
   * @param {string} sisterId
   * @returns {Promise}
   */
  getCertificates: async (sisterId) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.EDUCATION.CERTIFICATES(sisterId)
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get statistics
   * @returns {Promise}
   */
  getStatistics: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.EDUCATION.STATISTICS);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default educationService;
