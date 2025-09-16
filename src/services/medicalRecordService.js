import apiClient from './api';

/**
 * Service để quản lý các API liên quan đến Medical Records (Phiếu khám bệnh)
 */
const medicalRecordService = {
  /**
   * Tạo phiếu khám bệnh mới
   * @param {Object} medicalRequest - Dữ liệu phiếu khám bệnh
   * @returns {Promise} Response từ API
   */
  createMedicalRecord: async (medicalRequest) => {
    try {
      const response = await apiClient.post('/api/medical-record', medicalRequest);
      return response.data;
    } catch (error) {
      console.error('Error creating medical record:', error);
      throw error;
    }
  },

  /**
   * Cập nhật phiếu khám bệnh
   * @param {Object} medicalRequest - Dữ liệu phiếu khám bệnh cần cập nhật
   * @returns {Promise} Response từ API
   */
  updateMedicalRecord: async (medicalRequest) => {
    try {
      const response = await apiClient.put('/api/medical-record', medicalRequest);
      return response.data;
    } catch (error) {
      console.error('Error updating medical record:', error);
      throw error;
    }
  },

  /**
   * Lấy thông tin phiếu khám bệnh theo ID
   * @param {number} id - ID phiếu khám bệnh
   * @returns {Promise} Response từ API
   */
  getMedicalRecordById: async (id) => {
    try {
      const response = await apiClient.get(`/api/medical-record/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching medical record:', error);
      throw error;
    }
  }
};

export default medicalRecordService;