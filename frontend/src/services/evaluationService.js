// src/services/evaluationService.js

import api from "./api";
import { API_ENDPOINTS } from "./apiEndpoints";

const evaluationService = {
  /**
   * Get evaluation list
   * @param {string} sisterId
   * @returns {Promise}
   */
  getList: async (sisterId) => {
    try {
      const response = await api.get(API_ENDPOINTS.EVALUATION.LIST(sisterId));
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get evaluation detail
   * @param {string} sisterId
   * @param {string} id
   * @returns {Promise}
   */
  getDetail: async (sisterId, id) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.EVALUATION.DETAIL(sisterId, id)
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create evaluation
   * @param {string} sisterId
   * @param {Object} data
   * @returns {Promise}
   */
  create: async (sisterId, data) => {
    try {
      const response = await api.post(
        API_ENDPOINTS.EVALUATION.CREATE(sisterId),
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update evaluation
   * @param {string} sisterId
   * @param {string} id
   * @param {Object} data
   * @returns {Promise}
   */
  update: async (sisterId, id, data) => {
    try {
      const response = await api.put(
        API_ENDPOINTS.EVALUATION.UPDATE(sisterId, id),
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete evaluation
   * @param {string} sisterId
   * @param {string} id
   * @returns {Promise}
   */
  delete: async (sisterId, id) => {
    try {
      const response = await api.delete(
        API_ENDPOINTS.EVALUATION.DELETE(sisterId, id)
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get evaluation by period
   * @param {string} sisterId
   * @param {number} year
   * @returns {Promise}
   */
  getByPeriod: async (sisterId, year) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.EVALUATION.BY_PERIOD(sisterId, year)
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
      const response = await api.get(API_ENDPOINTS.EVALUATION.STATISTICS);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default evaluationService;
