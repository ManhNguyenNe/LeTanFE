import apiClient from './api';

/**
 * Service để quản lý các API liên quan đến health plans (dịch vụ khám)
 */
const healthPlanService = {
  /**
   * Lấy danh sách tất cả các dịch vụ khám
   * @returns {Promise} Response từ API
   */
  getAllHealthPlans: async () => {
    try {
      const response = await apiClient.get('/api/services');
      return response.data;
    } catch (error) {
      console.error('Error fetching health plans:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách dịch vụ theo loại (client-side filtering)
   * @param {string} type - Loại dịch vụ (DICH_VU, XET_NGHIEM, etc.)
   * @returns {Promise} Response từ API
   */
  getHealthPlansByType: async (type) => {
    try {
      if (!type || type.trim() === '') {
        throw new Error('Loại dịch vụ không được để trống');
      }

      // Lấy tất cả và filter phía client vì backend chưa có API filter
      const allPlans = await healthPlanService.getAllHealthPlans();
      return allPlans.filter(plan => 
        plan.type && plan.type.toUpperCase() === type.toUpperCase()
      );
    } catch (error) {
      console.error('Error fetching health plans by type:', error);
      throw error;
    }
  },

  /**
   * Lấy thông tin dịch vụ theo ID
   * @param {number} id - ID của dịch vụ
   * @returns {Promise} Response từ API
   */
  getHealthPlanById: async (id) => {
    try {
      if (!id) {
        throw new Error('ID dịch vụ không được để trống');
      }

      const response = await apiClient.get(`/api/services/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching health plan by ID:', error);
      throw error;
    }
  }
};

export default healthPlanService;