import apiClient from './api';

/**
 * Service để quản lý các API liên quan đến doctors (bác sĩ)
 */
const doctorService = {
  /**
   * Lấy danh sách tất cả bác sĩ
   * @returns {Promise} Response từ API
   */
  getAllDoctors: async () => {
    try {
      const response = await apiClient.get('/api/doctors');
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  },

  /**
   * Lấy thông tin bác sĩ theo ID
   * @param {number} doctorId - ID của bác sĩ
   * @returns {Promise} Response từ API
   */
  getDoctorById: async (doctorId) => {
    try {
      const response = await apiClient.get(`/api/doctors/${doctorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor by ID:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách bác sĩ theo chuyên khoa
   * @param {string} specialty - Tên chuyên khoa
   * @returns {Promise} Response từ API
   */
  getDoctorsBySpecialty: async (specialty) => {
    try {
      const response = await apiClient.get('/api/doctors/specialty', {
        params: { specialty }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors by specialty:', error);
      throw error;
    }
  }
};

export default doctorService;