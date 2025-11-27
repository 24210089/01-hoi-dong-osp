// src/services/missionService.js

import api from "./api";
import { API_ENDPOINTS } from "./apiEndpoints";

const missionService = {
  // ============================================
  // JOURNEY (HÀNH TRÌNH ƠN GỌI)
  // ============================================
  journey: {
    /**
     * Get journey list
     * @param {string} sisterId
     * @returns {Promise}
     */
    getList: async (sisterId) => {
      try {
        const response = await api.get(
          API_ENDPOINTS.MISSION.JOURNEY.LIST(sisterId)
        );
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Get journey timeline
     * @param {string} sisterId
     * @returns {Promise}
     */
    getTimeline: async (sisterId) => {
      try {
        const response = await api.get(
          API_ENDPOINTS.MISSION.JOURNEY.TIMELINE(sisterId)
        );
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Get journey detail
     * @param {string} sisterId
     * @param {string} id
     * @returns {Promise}
     */
    getDetail: async (sisterId, id) => {
      try {
        const response = await api.get(
          API_ENDPOINTS.MISSION.JOURNEY.DETAIL(sisterId, id)
        );
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Create journey
     * @param {string} sisterId
     * @param {Object} data
     * @returns {Promise}
     */
    create: async (sisterId, data) => {
      try {
        const response = await api.post(
          API_ENDPOINTS.MISSION.JOURNEY.CREATE(sisterId),
          data
        );
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Update journey
     * @param {string} sisterId
     * @param {string} id
     * @param {Object} data
     * @returns {Promise}
     */
    update: async (sisterId, id, data) => {
      try {
        const response = await api.put(
          API_ENDPOINTS.MISSION.JOURNEY.UPDATE(sisterId, id),
          data
        );
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Delete journey
     * @param {string} sisterId
     * @param {string} id
     * @returns {Promise}
     */
    delete: async (sisterId, id) => {
      try {
        const response = await api.delete(
          API_ENDPOINTS.MISSION.JOURNEY.DELETE(sisterId, id)
        );
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Filter by stage
     * @param {string} stage
     * @returns {Promise}
     */
    filterByStage: async (stage) => {
      try {
        const response = await api.get(
          API_ENDPOINTS.MISSION.JOURNEY.FILTER_BY_STAGE,
          {
            params: { stage },
          }
        );
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Get current stage
     * @param {string} sisterId
     * @returns {Promise}
     */
    getCurrentStage: async (sisterId) => {
      try {
        const response = await api.get(
          API_ENDPOINTS.MISSION.JOURNEY.CURRENT_STAGE(sisterId)
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
        const response = await api.get(
          API_ENDPOINTS.MISSION.JOURNEY.STATISTICS
        );
        return response;
      } catch (error) {
        throw error;
      }
    },
  },

  // ============================================
  // ASSIGNMENT (SỨ VỤ)
  // ============================================
  assignment: {
    /**
     * Get assignment list
     * @param {string} sisterId
     * @returns {Promise}
     */
    getList: async (sisterId) => {
      try {
        const response = await api.get(
          API_ENDPOINTS.MISSION.ASSIGNMENT.LIST(sisterId)
        );
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Get assignment detail
     * @param {string} sisterId
     * @param {string} id
     * @returns {Promise}
     */
    getDetail: async (sisterId, id) => {
      try {
        const response = await api.get(
          API_ENDPOINTS.MISSION.ASSIGNMENT.DETAIL(sisterId, id)
        );
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Create assignment
     * @param {string} sisterId
     * @param {Object} data
     * @returns {Promise}
     */
    create: async (sisterId, data) => {
      try {
        const response = await api.post(
          API_ENDPOINTS.MISSION.ASSIGNMENT.CREATE(sisterId),
          data
        );
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Update assignment
     * @param {string} sisterId
     * @param {string} id
     * @param {Object} data
     * @returns {Promise}
     */
    update: async (sisterId, id, data) => {
      try {
        const response = await api.put(
          API_ENDPOINTS.MISSION.ASSIGNMENT.UPDATE(sisterId, id),
          data
        );
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Delete assignment
     * @param {string} sisterId
     * @param {string} id
     * @returns {Promise}
     */
    delete: async (sisterId, id) => {
      try {
        const response = await api.delete(
          API_ENDPOINTS.MISSION.ASSIGNMENT.DELETE(sisterId, id)
        );
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Get current assignment
     * @param {string} sisterId
     * @returns {Promise}
     */
    getCurrent: async (sisterId) => {
      try {
        const response = await api.get(
          API_ENDPOINTS.MISSION.ASSIGNMENT.CURRENT(sisterId)
        );
        return response;
      } catch (error) {
        throw error;
      }
    },

    /**
     * Get assignment history
     * @param {string} sisterId
     * @returns {Promise}
     */
    getHistory: async (sisterId) => {
      try {
        const response = await api.get(
          API_ENDPOINTS.MISSION.ASSIGNMENT.HISTORY(sisterId)
        );
        return response;
      } catch (error) {
        throw error;
      }
    },
  },
};

export default missionService;
