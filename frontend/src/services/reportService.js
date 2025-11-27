// src/services/reportService.js

import api from "./api";
import { API_ENDPOINTS } from "./apiEndpoints";

const reportService = {
  /**
   * Get overview report
   * @returns {Promise}
   */
  getOverview: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.REPORT.OVERVIEW);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get report by age
   * @param {Object} params
   * @returns {Promise}
   */
  getByAge: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.REPORT.BY_AGE, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get report by stage
   * @param {Object} params
   * @returns {Promise}
   */
  getByStage: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.REPORT.BY_STAGE, { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get report by community
   * @param {Object} params
   * @returns {Promise}
   */
  getByCommunity: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.REPORT.BY_COMMUNITY, {
        params,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get report by mission
   * @param {Object} params
   * @returns {Promise}
   */
  getByMission: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.REPORT.BY_MISSION, {
        params,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get report by education
   * @param {Object} params
   * @returns {Promise}
   */
  getByEducation: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.REPORT.BY_EDUCATION, {
        params,
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Export report to Excel
   * @param {string} reportType
   * @param {Object} params
   * @returns {Promise}
   */
  exportExcel: async (reportType, params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.REPORT.EXPORT_EXCEL, {
        params: { type: reportType, ...params },
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report-${reportType}-${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Export report to PDF
   * @param {string} reportType
   * @param {Object} params
   * @returns {Promise}
   */
  exportPDF: async (reportType, params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.REPORT.EXPORT_PDF, {
        params: { type: reportType, ...params },
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report-${reportType}-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return { success: true };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get custom report
   * @param {Object} params
   * @returns {Promise}
   */
  getCustomReport: async (params) => {
    try {
      const response = await api.post(API_ENDPOINTS.REPORT.CUSTOM, params);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default reportService;
