import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Letan.css';

const KhamTrucTiep = () => {
    const [isNewPatient, setIsNewPatient] = useState(false);
    const [patientInfo, setPatientInfo] = useState({
        hoTen: '',
        soDienThoai: '',
        email: '',
        ngaySinh: '',
        gioiTinh: '',
        diaChi: ''
    });
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searchedPhone, setSearchedPhone] = useState(null);
    
    // Thêm state cho danh sách đặt lịch online
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

    const doctors = [
        { id: 1, name: 'BS. Nguyễn Văn A', specialty: 'Nội khoa' },
        { id: 2, name: 'BS. Trần Thị B', specialty: 'Ngoại khoa' },
        { id: 3, name: 'BS. Lê Văn C', specialty: 'Nhi khoa' },
        { id: 4, name: 'BS. Phạm Thị D', specialty: 'Sản phụ khoa' }
    ];

    const handleSearchPatient = () => {
        if (!patientInfo.soDienThoai || patientInfo.soDienThoai.trim() === '') {
            setSearchResult({ found: false, message: 'Vui lòng nhập số điện thoại để tìm kiếm.' });
            return;
        }

        const mockPatients = {
            '0123456789': {
                id: 1,
                hoTen: 'Nguyễn Văn A',
                soDienThoai: '0123456789',
                email: 'nguyenvana@email.com',
                ngaySinh: '1990-01-01',
                gioiTinh: 'Nam',
                diaChi: '123 Đường ABC, Quận 1, TP.HCM'
            },
            '0987654321': {
                id: 2,
                hoTen: 'Trần Thị B',
                soDienThoai: '0987654321',
                email: 'tranthib@email.com',
                ngaySinh: '1985-05-15',
                gioiTinh: 'Nữ',
                diaChi: '456 Đường XYZ, Quận 2, TP.HCM'
            }
        };

        const foundPatient = mockPatients[patientInfo.soDienThoai];
        
        if (foundPatient) {
            setPatientInfo({
                hoTen: foundPatient.hoTen,
                soDienThoai: foundPatient.soDienThoai,
                email: foundPatient.email,
                ngaySinh: foundPatient.ngaySinh,
                gioiTinh: foundPatient.gioiTinh,
                diaChi: foundPatient.diaChi
            });
            setIsNewPatient(false);
            setSearchedPhone(foundPatient.soDienThoai);
            setSearchResult({ found: true, message: `Đã tìm thấy thông tin bệnh nhân ${foundPatient.soDienThoai}` });
        } else {
            setIsNewPatient(true);
            setSearchedPhone(null);
            setSearchResult({ found: false, message: 'Không tìm thấy bệnh nhân. Vui lòng nhập thông tin mới.' });
        }
    };

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

    const handleCancelForm = () => {
        setPatientInfo({
            hoTen: '',
            soDienThoai: '',
            email: '',
            ngaySinh: '',
            gioiTinh: '',
            diaChi: ''
        });
        setSelectedDoctor('');
        setIsNewPatient(false);
        setSearchedPhone(null);
        setSearchResult(null);
    };

    const filteredAppointments = appointments.filter(apt => {
        if (searchedPhone) {
            return apt.soDienThoai === searchedPhone;
        }
        return true;
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Đã in phiếu khám thành công!');
    };

    return (
        <div className="letan-container">
            {/* Header */}
            <div className="letan-header">
                <div className="letan-header-content">
                    <h1>Hệ thống quản lý lễ tân</h1>
                    <div className="letan-user-info">
                        <span>Xin chào, Lễ tân</span>
                        <button className="logout-btn">Đăng xuất</button>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="letan-nav">
                <div className="letan-nav-content">
                    <button className="nav-btn active">
                        <i className="fas fa-user-plus"></i>
                        Tạo phiếu khám
                    </button>
                    <Link to="/letan/xac-nhan-dat-lich" className="nav-btn">
                        <i className="fas fa-calendar-check"></i>
                        Xác nhận đặt lịch
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="letan-main">
                <div className="kham-truc-tiep-content">
                    {/* Tìm kiếm bệnh nhân */}
                    <div className="search-patient-section">
                        <h2>Tìm kiếm bệnh nhân</h2>
                        <div className="search-form">
                            <div className="form-group">
                                <label>Số điện thoại:</label>
                                <input 
                                    type="text" 
                                    placeholder="Nhập vào số điện thoại"
                                    value={patientInfo.soDienThoai}
                                    onChange={(e) => setPatientInfo({...patientInfo, soDienThoai: e.target.value})}
                                />
                            </div>
                            <button className="btn-search" onClick={handleSearchPatient}>
                                <i className="fas fa-search"></i>
                                Tìm kiếm
                            </button>
                        </div>

                        {searchResult && (
                            <div className="search-result">
                                <div className={`search-message ${searchResult.found ? 'success' : 'error'}`}>
                                    <i className={`fas ${searchResult.found ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                                    <p>{searchResult.message}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Danh sách đặt lịch online */}
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
                                                <span className={`status-badge ${
                                                    appointment.trangThai === 'Đã xác nhận' ? 'confirmed' : 
                                                    appointment.trangThai === 'Đã hủy' ? 'cancelled' : 'pending'
                                                }`}>
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
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Form thông tin bệnh nhân */}
                    <div className="patient-form-section">
                        <h2>Phiếm khám bệnh</h2>
                        <form onSubmit={handleSubmit} className="patient-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Họ và tên *</label>
                                    <input 
                                        type="text" 
                                        maxLength="100" 
                                        placeholder="Nhập vào họ và tên" 
                                        required
                                        pattern="[A-Za-zÀ-ỹ\s'-]+"
                                        title="Tên chỉ chứa chữ cái và khoảng trắng"
                                        value={patientInfo.hoTen}
                                        onChange={(e) => setPatientInfo({...patientInfo, hoTen: e.target.value})}
                                        disabled={searchedPhone !== null}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Số điện thoại *</label>
                                    <input 
                                        type="tel" 
                                        maxLength="10" 
                                        placeholder="Nhập vào số điện thoại" 
                                        required
                                        pattern="0\d{9}"
                                        title="Số điện thoại Việt Nam bắt đầu bằng 0, 10 chữ số"
                                        value={patientInfo.soDienThoai}
                                        onChange={(e) => setPatientInfo({...patientInfo, soDienThoai: e.target.value})}
                                        disabled={searchedPhone !== null}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input 
                                        type="email" 
                                        maxLength="100" 
                                        placeholder="Nhập vào email" 
                                        value={patientInfo.email}
                                        onChange={(e) => setPatientInfo({...patientInfo, email: e.target.value})}
                                        disabled={searchedPhone !== null}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Ngày sinh *</label>
                                    <input 
                                        type="date" 
                                        required
                                        value={patientInfo.ngaySinh}
                                        onChange={(e) => setPatientInfo({...patientInfo, ngaySinh: e.target.value})}
                                        disabled={searchedPhone !== null}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Giới tính *</label>
                                    <select 
                                        required
                                        value={patientInfo.gioiTinh}
                                        onChange={(e) => setPatientInfo({...patientInfo, gioiTinh: e.target.value})}
                                        disabled={searchedPhone !== null}
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Địa chỉ *</label>
                                    <input 
                                        type="text" 
                                        maxLength="200" 
                                        placeholder="Nhập vào địa chỉ" 
                                        required
                                        pattern="[A-Za-z0-9À-ỹ\s.,'-/]+"
                                        title="Địa chỉ chỉ chứa chữ, số, khoảng trắng và các ký tự ., - ' /"
                                        value={patientInfo.diaChi}
                                        onChange={(e) => setPatientInfo({...patientInfo, diaChi: e.target.value})}
                                        disabled={searchedPhone !== null}
                                    />
                                </div>
                            </div>
                            
                            <div className='form-row'>
                                <div className="form-group">
                                    <label>Căn cước công dân *</label>
                                    <input 
                                        type="text" 
                                        maxLength="12" 
                                        pattern="\d{12}" 
                                        placeholder="Nhập vào 12 số CCCD" 
                                        required
                                        disabled={searchedPhone !== null}
                                    />
                                </div>
                            </div>

                            <div className='form-row'>
                                <div className="form-group">
                                    <label>Khoa *</label>
                                    <select 
                                        required
                                    >
                                        <option value="">Chọn khoa</option>
                                    </select>
                                </div>
                        
                                <div className="form-group">
                                    <label>Bác sĩ phụ trách *</label>
                                    <select 
                                        required
                                        value={selectedDoctor}
                                        onChange={(e) => setSelectedDoctor(e.target.value)}
                                    >
                                        <option value="">Chọn bác sĩ</option>
                                        {doctors.map(doctor => (
                                            <option key={doctor.id} value={doctor.id}>
                                                {doctor.name} - {doctor.specialty}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={handleCancelForm}>
                                    Làm mới
                                </button>
                                <button type="submit" className="btn-submit">
                                    <i className="fas fa-plus"></i>
                                    In phiếu khám
                                </button>
                            </div>
                        </form>
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

export default KhamTrucTiep;
