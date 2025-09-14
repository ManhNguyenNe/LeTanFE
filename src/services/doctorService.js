import apiClient from './api';

/**
 * Service để quản lý các API liên quan đến doctors (bác sĩ)
 */
const doctorService = {
  /**
   * Lấy danh sách bác sĩ theo khoa (sử dụng department API)
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
   * Lấy thông tin bác sĩ theo ID (chưa có API backend)
   * @param {number} doctorId - ID của bác sĩ
   * @returns {Promise} Response từ API
   */
  getDoctorById: async (doctorId) => {
    try {
      if (!doctorId) {
        throw new Error('Doctor ID không được để trống');
      }

      const response = await apiClient.get(`/api/doctors/${doctorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor by ID:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách bác sĩ theo chuyên khoa (chưa có API backend)
   * @param {string} specialty - Tên chuyên khoa
   * @returns {Promise} Response từ API
   */
  getDoctorsBySpecialty: async (specialty) => {
    try {
      if (!specialty || specialty.trim() === '') {
        throw new Error('Chuyên khoa không được để trống');
      }

      const response = await apiClient.get('/api/doctors/specialty', {
        params: { 
          specialty: specialty.trim() 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors by specialty:', error);
      throw error;
    }
  }
};

export default doctorService;