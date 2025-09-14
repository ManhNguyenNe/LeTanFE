import apiClient from './api';

/**
 * Service để quản lý các API liên quan đến departments (khoa bác sĩ)
 */
const departmentService = {
  /**
   * Lấy danh sách tất cả các khoa bác sĩ
   * @returns {Promise} Response từ API
   */
  getAllDepartments: async () => {
    try {
      const response = await apiClient.get('/api/departments');
      return response.data;
    } catch (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
  },

  /**
   * Lấy thông tin khoa bác sĩ theo ID
   * @param {number} departmentId - ID của khoa
   * @returns {Promise} Response từ API
   */
  getDepartmentById: async (departmentId) => {
    try {
      if (!departmentId) {
        throw new Error('Department ID không được để trống');
      }

      const response = await apiClient.get(`/api/departments/${departmentId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching department by ID:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách bác sĩ theo khoa
   * @param {number} departmentId - ID của khoa
   * @returns {Promise} Response từ API
   */
  getDoctorsByDepartment: async (departmentId) => {
    try {
      if (!departmentId) {
        throw new Error('Department ID không được để trống');
      }

      const response = await apiClient.get(`/api/departments/${departmentId}/doctors`);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors by department:', error);
      throw error;
    }
  },

  /**
   * Tìm kiếm khoa bác sĩ theo tên (client-side filtering)
   * @param {string} searchTerm - Từ khóa tìm kiếm
   * @returns {Promise} Response từ API
   */
  searchDepartments: async (searchTerm) => {
    try {
      if (!searchTerm || searchTerm.trim() === '') {
        throw new Error('Từ khóa tìm kiếm không được để trống');
      }

      // Sử dụng getAllDepartments và filter phía client
      const departments = await departmentService.getAllDepartments();
      return departments.filter(dept => 
        dept.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching departments:', error);
      throw error;
    }
  }
};

export default departmentService;