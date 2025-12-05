// src/services/uploadService.js

import api from "./api";
import { API_ENDPOINTS } from "./apiEndpoints";

const uploadService = {
  /**
   * Upload multiple documents
   * @param {File[]} files - Array of files to upload
   * @returns {Promise<Object>} - Upload result with file URLs
   */
  uploadDocuments: async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("documents", file);
      });

      // Note: api interceptor already returns response.data
      const response = await api.post(API_ENDPOINTS.UPLOAD.MULTIPLE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        files: response.files || response.data?.files || [],
      };
    } catch (error) {
      console.error("Upload documents error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || error.message || "Upload failed",
      };
    }
  },

  /**
   * Upload single file
   * @param {File} file - File to upload
   * @returns {Promise<Object>} - Upload result with file URL
   */
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append("documents", file);

      // Note: api interceptor already returns response.data
      const response = await api.post(API_ENDPOINTS.UPLOAD.MULTIPLE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const uploadedFiles = response.files || response.data?.files || [];
      return {
        success: true,
        file: uploadedFiles[0],
      };
    } catch (error) {
      console.error("Upload file error:", error);
      return {
        success: false,
        error:
          error.response?.data?.message || error.message || "Upload failed",
      };
    }
  },
};

export default uploadService;
