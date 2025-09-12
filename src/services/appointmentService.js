import apiClient from './api';

/**
 * Service để quản lý các API liên quan đến appointments
 */
const appointmentService = {
  /**
   * Lấy danh sách lịch khám theo số điện thoại
   * @param {string} phone - Số điện thoại cần tìm kiếm
   * @returns {Promise} Response từ API
   */
  getAppointmentsByPhone: async (phone) => {
    try {
      if (!phone || phone.trim() === '') {
        throw new Error('Số điện thoại không được để trống');
      }

      const response = await apiClient.get(`/api/appointments/phone`, {
        params: {
          phone: phone.trim()
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching appointments by phone:', error);
      throw error;
    }
  },

  /**
   * Tạo lịch khám mới
   * @param {Object} appointmentData - Dữ liệu lịch khám
   * @returns {Promise} Response từ API
   */
  createAppointment: async (appointmentData) => {
    try {
      const response = await apiClient.post('/api/appointments', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  /**
   * Xác nhận lịch khám (cho receptionist)
   * @param {number} appointmentId - ID lịch khám
   * @param {string} status - Trạng thái mới
   * @returns {Promise} Response từ API
   */
  confirmAppointment: async (appointmentId, status) => {
    try {
      const response = await apiClient.post('/api/receptionists/confirm', {
        id: appointmentId,
        status: status
      });
      return response.data;
    } catch (error) {
      console.error('Error confirming appointment:', error);
      throw error;
    }
  }
};

export default appointmentService;