import api from "./api";

class SisterService {
  /**
   * Lấy danh sách nữ tu (có phân trang, lọc, search)
   */
  async getAll(params = {}) {
    try {
      const response = await api.get("/sisters", { params });
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error?.response?.data?.error || "Không thể lấy danh sách nữ tu",
        data: { items: [], total: 0, page: 1, limit: 20, totalPages: 0 },
      };
    }
  }

  /**
   * Lấy chi tiết nữ tu theo ID
   */
  async getById(id) {
    try {
      const response = await api.get(`/sisters/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error?.response?.data?.error || "Không thể lấy thông tin nữ tu",
        data: null,
      };
    }
  }

  /**
   * Tạo mới hồ sơ nữ tu
   */
  async create(data) {
    try {
      const response = await api.post("/sisters", data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error?.response?.data?.error || "Không thể tạo hồ sơ nữ tu",
      };
    }
  }

  /**
   * Cập nhật hồ sơ nữ tu
   */
  async update(id, data) {
    try {
      const response = await api.put(`/sisters/${id}`, data);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error:
          error?.response?.data?.error || "Không thể cập nhật thông tin nữ tu",
      };
    }
  }

  /**
   * Xóa nữ tu (set is_active = false)
   */
  async delete(id) {
    try {
      const response = await api.delete(`/sisters/${id}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error?.response?.data?.error || "Không thể xóa nữ tu",
      };
    }
  }
}

export default new SisterService();
