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
        diaChi: '',
        cccd: ''
    });
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searchedPhone, setSearchedPhone] = useState(null);
    const [foundPatients, setFoundPatients] = useState([]);
    const [showPatientModal, setShowPatientModal] = useState(false);
    const [selectedPatientForModal, setSelectedPatientForModal] = useState(null);
    const [modalMode, setModalMode] = useState(''); // 'edit' hoặc 'view'
    
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
            setFoundPatients([]);
            return;
        }

        // Mock data với nhiều bệnh nhân có thể dùng chung số điện thoại
        const mockPatients = {
            '0123456789': [
                {
                    id: 1,
                    hoTen: 'Nguyễn Văn A',
                    soDienThoai: '0123456789',
                    email: 'nguyenvana@email.com',
                    ngaySinh: '1990-01-01',
                    gioiTinh: 'Nam',
                    diaChi: '123 Đường ABC, Quận 1, TP.HCM',
                    cccd: '123456789012'
                },
                {
                    id: 2,
                    hoTen: 'Nguyễn Thị B (Vợ)',
                    soDienThoai: '0123456789',
                    email: 'nguyenthib@email.com',
                    ngaySinh: '1992-05-15',
                    gioiTinh: 'Nữ',
                    diaChi: '123 Đường ABC, Quận 1, TP.HCM',
                    cccd: '123456789013'
                },
                {
                    id: 3,
                    hoTen: 'Nguyễn Văn C (Con)',
                    soDienThoai: '0123456789',
                    email: '',
                    ngaySinh: '2015-08-20',
                    gioiTinh: 'Nam',
                    diaChi: '123 Đường ABC, Quận 1, TP.HCM',
                    cccd: ''
                }
            ],
            '0987654321': [
                {
                    id: 4,
                    hoTen: 'Trần Thị D',
                    soDienThoai: '0987654321',
                    email: 'tranthid@email.com',
                    ngaySinh: '1985-05-15',
                    gioiTinh: 'Nữ',
                    diaChi: '456 Đường XYZ, Quận 2, TP.HCM',
                    cccd: '987654321098'
                }
            ]
        };

        const foundPatientsData = mockPatients[patientInfo.soDienThoai];
        
        if (foundPatientsData && foundPatientsData.length > 0) {
            setFoundPatients(foundPatientsData);
            setIsNewPatient(false);
            setSearchedPhone(patientInfo.soDienThoai);
            setSearchResult({ 
                found: true, 
                message: `Tìm thấy ${foundPatientsData.length} hồ sơ bệnh nhân với số điện thoại ${patientInfo.soDienThoai}` 
            });
        } else {
            setFoundPatients([]);
            setIsNewPatient(true);
            setSearchedPhone(null);
            setSearchResult({ found: false, message: 'Không tìm thấy bệnh nhân. Vui lòng nhập thông tin mới.' });
        }
    };

    const handleFillPatientInfo = (patient) => {
        setPatientInfo({
            hoTen: patient.hoTen,
            soDienThoai: patient.soDienThoai,
            email: patient.email,
            ngaySinh: patient.ngaySinh,
            gioiTinh: patient.gioiTinh,
            diaChi: patient.diaChi,
            cccd: patient.cccd
        });
        alert('Đã điền thông tin bệnh nhân vào phiếu khám!');
    };

    const handleEditPatient = (patient) => {
        setSelectedPatientForModal(patient);
        setModalMode('edit');
        setShowPatientModal(true);
    };

    const handleViewPatient = (patient) => {
        setSelectedPatientForModal(patient);
        setModalMode('view');
        setShowPatientModal(true);
    };

    const handleSavePatientInfo = () => {
        // Logic lưu thông tin bệnh nhân đã chỉnh sửa
        alert('Đã lưu thông tin bệnh nhân!');
        setShowPatientModal(false);
        
        // Nếu là bệnh nhân mới (không tìm thấy trong danh sách), thêm vào danh sách
        const isNewPatient = !foundPatients.find(p => p.id === selectedPatientForModal.id);
        if (isNewPatient) {
            // Kiểm tra xem có phải là tạo mới hoàn toàn không (không có số điện thoại trong search)
            if (!searchedPhone && selectedPatientForModal.soDienThoai) {
                // Cập nhật searchedPhone và foundPatients cho bệnh nhân mới hoàn toàn
                setSearchedPhone(selectedPatientForModal.soDienThoai);
                setFoundPatients([selectedPatientForModal]);
                setSearchResult({ 
                    found: true, 
                    message: `Đã tạo hồ sơ mới cho số điện thoại ${selectedPatientForModal.soDienThoai}` 
                });
            } else {
                // Thêm vào danh sách hiện tại
                setFoundPatients([...foundPatients, selectedPatientForModal]);
            }
        } else {
            // Cập nhật lại danh sách tìm kiếm cho bệnh nhân đã có
            const updatedPatients = foundPatients.map(p => 
                p.id === selectedPatientForModal.id ? selectedPatientForModal : p
            );
            setFoundPatients(updatedPatients);
        }
    };

    const handleCreateNewPatient = () => {
        // Tạo hồ sơ bệnh nhân hoàn toàn mới
        const newPatient = {
            id: Date.now(), // Tạo ID tạm thời
            hoTen: '',
            soDienThoai: '',
            email: '',
            ngaySinh: '',
            gioiTinh: '',
            diaChi: '',
            cccd: ''
        };
        setSelectedPatientForModal(newPatient);
        setModalMode('add');
        setShowPatientModal(true);
    };

    const handleAddNewRecord = () => {
        // Tạo hồ sơ mới với số điện thoại hiện tại
        const newPatient = {
            id: Date.now(), // Tạo ID tạm thời
            hoTen: '',
            soDienThoai: searchedPhone || patientInfo.soDienThoai,
            email: '',
            ngaySinh: '',
            gioiTinh: '',
            diaChi: '',
            cccd: ''
        };
        
        setSelectedPatientForModal(newPatient);
        setModalMode('add'); // Đặt mode là 'add' thay vì 'edit'
        setShowPatientModal(true);
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
            diaChi: '',
            cccd: ''
        });
        setSelectedDoctor('');
        setIsNewPatient(false);
        setSearchedPhone(null);
        setSearchResult(null);
        setFoundPatients([]);
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
                {/* Tìm kiếm bệnh nhân - Full width ở trên */}
                <div className="search-patient-section">
                    <h2>Tìm kiếm bệnh nhân</h2>
                    <div className="search-controls">
                        <div className="search-left">
                            <div className="search-form">
                                <div className="form-group">
                                    <label>Số điện thoại:</label>
                                    <input 
                                        type="text" 
                                        placeholder="Nhập số điện thoại"
                                        value={patientInfo.soDienThoai}
                                        onChange={(e) => setPatientInfo({...patientInfo, soDienThoai: e.target.value})}
                                    />
                                </div>
                                <button className="btn-search" onClick={handleSearchPatient}>
                                    <i className="fas fa-search"></i>
                                    Tìm kiếm
                                </button>
                            </div>
                        </div>
                        <div className="search-right">
                            <button className="btn-create-new-patient" onClick={handleCreateNewPatient}>
                                <i className="fas fa-user-plus"></i>
                                Tạo mới hồ sơ bệnh nhân
                            </button>
                        </div>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="kham-truc-tiep-content">
                    {/* Left Column */}
                    <div className="left-column">
                        {/* Danh sách đặt lịch online */}
                        <div className="appointments-list">
                            <div className="appointments-header">
                                <h2>Danh sách lịch đặt online</h2>
                            </div>
                            
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
                            <h2>Phiếu khám bệnh</h2>
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
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Ngày sinh *</label>
                                        <input 
                                            type="date" 
                                            required
                                            value={patientInfo.ngaySinh}
                                            onChange={(e) => setPatientInfo({...patientInfo, ngaySinh: e.target.value})}
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
                                            value={patientInfo.cccd}
                                            onChange={(e) => setPatientInfo({...patientInfo, cccd: e.target.value})}
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
                    </div>

                    {/* Right Column */}
                    <div className="right-column">
                        {/* Bảng danh sách bệnh nhân - luôn hiển thị */}
                        <div className="found-patients-section">
                            <div className="found-patients-header">
                                <h2>Danh sách hồ sơ bệnh nhân</h2>
                                {foundPatients.length > 0 && (
                                    <button 
                                        className="btn-add-record"
                                        onClick={() => handleAddNewRecord()}
                                        title="Thêm hồ sơ mới với số điện thoại này"
                                    >
                                        <i className="fas fa-plus"></i>
                                        Thêm hồ sơ
                                    </button>
                                )}
                            </div>
                            <div className="found-patients-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Họ tên</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {foundPatients.length > 0 ? (
                                            foundPatients.map(patient => (
                                                <tr key={patient.id}>
                                                    <td>{patient.hoTen}</td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <button 
                                                                className="btn-fill"
                                                                onClick={() => handleFillPatientInfo(patient)}
                                                                title="Điền vào phiếu khám"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                                Điền
                                                            </button>
                                                            <button 
                                                                className="btn-edit"
                                                                onClick={() => handleEditPatient(patient)}
                                                                title="Sửa thông tin"
                                                            >
                                                                <i className="fas fa-pencil-alt"></i>
                                                                Sửa
                                                            </button>
                                                            <button 
                                                                className="btn-view"
                                                                onClick={() => handleViewPatient(patient)}
                                                                title="Xem chi tiết"
                                                            >
                                                                <i className="fas fa-eye"></i>
                                                                Xem
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="2" style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic', padding: '2rem' }}>
                                                    {searchResult?.found === false ? 'Không tìm thấy bệnh nhân' : 'Nhập số điện thoại để tìm kiếm bệnh nhân'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Modal sửa/xem thông tin bệnh nhân */}
                    {showPatientModal && selectedPatientForModal && (
                        <div className="modal-overlay">
                            <div className="modal patient-modal">
                                <div className="modal-header">
                                    <h3>
                                        {modalMode === 'edit' ? 'Sửa thông tin bệnh nhân' : 
                                         modalMode === 'add' ? 'Thêm hồ sơ bệnh nhân mới' : 
                                         'Thông tin chi tiết bệnh nhân'}
                                    </h3>
                                    <button 
                                        className="modal-close"
                                        onClick={() => setShowPatientModal(false)}
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="patient-form">
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Họ và tên *</label>
                                                <input 
                                                    type="text" 
                                                    value={selectedPatientForModal.hoTen}
                                                    onChange={(e) => setSelectedPatientForModal({
                                                        ...selectedPatientForModal, 
                                                        hoTen: e.target.value
                                                    })}
                                                    disabled={modalMode === 'view'}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Số điện thoại *</label>
                                                <input 
                                                    type="tel" 
                                                    value={selectedPatientForModal.soDienThoai}
                                                    onChange={(e) => setSelectedPatientForModal({
                                                        ...selectedPatientForModal, 
                                                        soDienThoai: e.target.value
                                                    })}
                                                    disabled={modalMode === 'view'}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input 
                                                    type="email" 
                                                    value={selectedPatientForModal.email}
                                                    onChange={(e) => setSelectedPatientForModal({
                                                        ...selectedPatientForModal, 
                                                        email: e.target.value
                                                    })}
                                                    disabled={modalMode === 'view'}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Ngày sinh *</label>
                                                <input 
                                                    type="date" 
                                                    value={selectedPatientForModal.ngaySinh}
                                                    onChange={(e) => setSelectedPatientForModal({
                                                        ...selectedPatientForModal, 
                                                        ngaySinh: e.target.value
                                                    })}
                                                    disabled={modalMode === 'view'}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Giới tính *</label>
                                                <select 
                                                    value={selectedPatientForModal.gioiTinh}
                                                    onChange={(e) => setSelectedPatientForModal({
                                                        ...selectedPatientForModal, 
                                                        gioiTinh: e.target.value
                                                    })}
                                                    disabled={modalMode === 'view'}
                                                >
                                                    <option value="">Chọn giới tính</option>
                                                    <option value="Nam">Nam</option>
                                                    <option value="Nữ">Nữ</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>CCCD</label>
                                                <input 
                                                    type="text" 
                                                    value={selectedPatientForModal.cccd}
                                                    onChange={(e) => setSelectedPatientForModal({
                                                        ...selectedPatientForModal, 
                                                        cccd: e.target.value
                                                    })}
                                                    disabled={modalMode === 'view'}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Địa chỉ *</label>
                                                <textarea 
                                                    value={selectedPatientForModal.diaChi}
                                                    onChange={(e) => setSelectedPatientForModal({
                                                        ...selectedPatientForModal, 
                                                        diaChi: e.target.value
                                                    })}
                                                    disabled={modalMode === 'view'}
                                                    rows="3"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button 
                                        className="btn-cancel"
                                        onClick={() => setShowPatientModal(false)}
                                    >
                                        {modalMode === 'edit' || modalMode === 'add' ? 'Hủy' : 'Đóng'}
                                    </button>
                                    {(modalMode === 'edit' || modalMode === 'add') && (
                                        <button 
                                            className="btn-confirm"
                                            onClick={handleSavePatientInfo}
                                        >
                                            {modalMode === 'add' ? 'Thêm hồ sơ' : 'Lưu thông tin'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

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
