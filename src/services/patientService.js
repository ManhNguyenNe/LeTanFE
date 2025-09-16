import apiClient from './api';

/**
 * Service để quản lý các API liên quan đến patients
 */
const patientService = {
  /**
   * Lấy thông tin bệnh nhân theo số điện thoại
   * @param {string} phone - Số điện thoại cần tìm kiếm
   * @returns {Promise} Response từ API với cấu trúc mới: {patients: Array, ownerId: Number}
   */
  getPatientsByPhone: async (phone) => {
    try {
      if (!phone || phone.trim() === '') {
        throw new Error('Số điện thoại không được để trống');
      }

      const response = await apiClient.get('/api/patients', {
        params: {
          phone: phone.trim()
        }
      });

      // API mới trả về cấu trúc PatientsDto: {patients: Array, ownerId: Number}
      // Cần xử lý để tương thích với code cũ
      const responseData = response.data;
      
      if (responseData && responseData.data) {
        const { patients = [], ownerId = null } = responseData.data;
        return {
          ...responseData,
          data: patients, // Để tương thích với code cũ expect data là array
          ownerId: ownerId // Thêm ownerId cho các use case mới
        };
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching patients by phone:', error);
      throw error;
    }
  },

  /**
   * Tạo bệnh nhân mới
   * @param {Object} patientData - Dữ liệu bệnh nhân
   * @returns {Promise} Response từ API
   */
  createPatient: async (patientData) => {
    try {
      const response = await apiClient.post('/api/patients', patientData);
      return response.data;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  }
};

export default patientService;