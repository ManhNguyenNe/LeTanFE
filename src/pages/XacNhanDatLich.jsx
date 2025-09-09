import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Letan.css';

const XacNhanDatLich = () => {
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            hoTen: 'Nguyễn Văn A',
            soDienThoai: '0123456789',
            email: 'nguyenvana@email.com',
            ngaySinh: '1990-01-01',
            gioiTinh: 'Nam',
            bacSiMongMuon: 'BS. Nguyễn Văn A',
            khungGio: '08:00 - 08:30',
            ngayDat: '2024-01-15',
            trangThai: 'Chờ xác nhận',
            ghiChu: 'Khám tổng quát'
        },
        {
            id: 2,
            hoTen: 'Trần Thị B',
            soDienThoai: '0987654321',
            email: 'tranthib@email.com',
            ngaySinh: '1985-05-15',
            gioiTinh: 'Nữ',
            bacSiMongMuon: 'BS. Trần Thị B',
            khungGio: '09:00 - 09:30',
            ngayDat: '2024-01-15',
            trangThai: 'Chờ xác nhận',
            ghiChu: 'Khám phụ khoa'
        },
        {
            id: 3,
            hoTen: 'Lê Văn C',
            soDienThoai: '0369852147',
            email: 'levanc@email.com',
            ngaySinh: '1992-12-20',
            gioiTinh: 'Nam',
            bacSiMongMuon: 'BS. Lê Văn C',
            khungGio: '10:30 - 11:00',
            ngayDat: '2024-01-15',
            trangThai: 'Đã xác nhận',
            ghiChu: 'Khám ngoại khoa'
        }
    ]);

    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const handleConfirm = (appointment) => {
        setSelectedAppointment(appointment);
        setShowConfirmModal(true);
    };

    const handleCancel = (appointment) => {
        setSelectedAppointment(appointment);
        setShowCancelModal(true);
    };

    const confirmAppointment = () => {
        setAppointments(appointments.map(apt => 
            apt.id === selectedAppointment.id 
                ? { ...apt, trangThai: 'Đã xác nhận' }
                : apt
        ));
        setShowConfirmModal(false);
        alert('Đã xác nhận lịch hẹn thành công!');
    };

    const cancelAppointment = () => {
        setAppointments(appointments.map(apt => 
            apt.id === selectedAppointment.id 
                ? { ...apt, trangThai: 'Đã hủy' }
                : apt
        ));
        setShowCancelModal(false);
        alert('Đã hủy lịch hẹn!');
    };

    const filteredAppointments = appointments.filter(apt => apt.trangThai !== 'Đã hủy');

    return (
        <div className="letan-container">
            {/* Header */}
            <div className="letan-header">
                <div className="letan-header-content">
                    <h1>Xác nhận đặt lịch online</h1>
                    <Link to="/letan" className="back-btn">
                        <i className="fas fa-arrow-left"></i>
                        Quay lại
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="letan-main">
                <div className="xac-nhan-dat-lich-content">
                    <div className="appointments-list">
                        <h2>Danh sách lịch đặt online</h2>
                        
                        <div className="appointments-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Họ tên</th>
                                        <th>Số điện thoại</th>
                                        <th>Bác sĩ</th>
                                        <th>Khung giờ</th>
                                        <th>Ngày đặt</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredAppointments.map(appointment => (
                                        <tr key={appointment.id}>
                                            <td>{appointment.hoTen}</td>
                                            <td>{appointment.soDienThoai}</td>
                                            <td>{appointment.bacSiMongMuon}</td>
                                            <td>{appointment.khungGio}</td>
                                            <td>{appointment.ngayDat}</td>
                                            <td>
                                                <span className={`status-badge ${appointment.trangThai === 'Đã xác nhận' ? 'confirmed' : 'pending'}`}>
                                                    {appointment.trangThai}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    {appointment.trangThai === 'Chờ xác nhận' && (
                                                        <>
                                                            <button 
                                                                className="btn-confirm"
                                                                onClick={() => handleConfirm(appointment)}
                                                            >
                                                                Xác nhận
                                                            </button>
                                                            <button 
                                                                className="btn-cancel"
                                                                onClick={() => handleCancel(appointment)}
                                                            >
                                                                Hủy
                                                            </button>
                                                        </>
                                                    )}
                                                    <button 
                                                        className="btn-detail"
                                                        onClick={() => setSelectedAppointment(appointment)}
                                                    >
                                                        Chi tiết
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Modal xác nhận */}
                    {showConfirmModal && selectedAppointment && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <div className="modal-header">
                                    <h3>Xác nhận lịch hẹn</h3>
                                    <button 
                                        className="modal-close"
                                        onClick={() => setShowConfirmModal(false)}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="appointment-details">
                                        <p><strong>Họ tên:</strong> {selectedAppointment.hoTen}</p>
                                        <p><strong>Số điện thoại:</strong> {selectedAppointment.soDienThoai}</p>
                                        <p><strong>Email:</strong> {selectedAppointment.email}</p>
                                        <p><strong>Ngày sinh:</strong> {selectedAppointment.ngaySinh}</p>
                                        <p><strong>Giới tính:</strong> {selectedAppointment.gioiTinh}</p>
                                        <p><strong>Bác sĩ:</strong> {selectedAppointment.bacSiMongMuon}</p>
                                        <p><strong>Khung giờ:</strong> {selectedAppointment.khungGio}</p>
                                        <p><strong>Ghi chú:</strong> {selectedAppointment.ghiChu}</p>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        className="btn-cancel"
                                        onClick={() => setShowConfirmModal(false)}
                                    >
                                        Hủy
                                    </button>
                                    <button 
                                        className="btn-confirm"
                                        onClick={confirmAppointment}
                                    >
                                        Xác nhận lịch hẹn
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Modal hủy lịch */}
                    {showCancelModal && selectedAppointment && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <div className="modal-header">
                                    <h3>Hủy lịch hẹn</h3>
                                    <button 
                                        className="modal-close"
                                        onClick={() => setShowCancelModal(false)}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p>Bạn có chắc chắn muốn hủy lịch hẹn của <strong>{selectedAppointment.hoTen}</strong>?</p>
                                    <div className="form-group">
                                        <label>Lý do hủy:</label>
                                        <textarea placeholder="Nhập lý do hủy lịch hẹn..."></textarea>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        className="btn-cancel"
                                        onClick={() => setShowCancelModal(false)}
                                    >
                                        Không
                                    </button>
                                    <button 
                                        className="btn-danger"
                                        onClick={cancelAppointment}
                                    >
                                        Hủy lịch hẹn
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default XacNhanDatLich;
