import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Letan.css';
import appointmentService from '../services/appointmentService';
import patientService from '../services/patientService';
// import doctorService from '../services/doctorService'; // Uncomment khi backend có API doctors

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
    const [isFormFilled, setIsFormFilled] = useState(false); // State để theo dõi form đã được điền
    
    // State để quản lý loading và lịch khám từ API
    const [isLoadingPatients, setIsLoadingPatients] = useState(false);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
    const [apiAppointments, setApiAppointments] = useState([]);
    const [error, setError] = useState(null);
    const [doctors, setDoctors] = useState([]); // Sẽ lấy từ API doctors sau
    
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);



    const handleSearchPatient = async () => {
        if (!patientInfo.soDienThoai || patientInfo.soDienThoai.trim() === '') {
            setSearchResult({ found: false, message: 'Vui lòng nhập số điện thoại để tìm kiếm.' });
            setFoundPatients([]);
            setApiAppointments([]);
            return;
        }

        setIsLoadingPatients(true);
        setIsLoadingAppointments(true);
        setError(null);

        try {
            // Gọi API để tìm bệnh nhân theo số điện thoại
            const [patientsResponse, appointmentsResponse] = await Promise.all([
                patientService.getPatientsByPhone(patientInfo.soDienThoai.trim()),
                appointmentService.getAppointmentsByPhone(patientInfo.soDienThoai.trim())
            ]);

            // Debug logs
            console.log('🔍 Patients API Response:', patientsResponse);
            console.log('📅 Appointments API Response:', appointmentsResponse);

            // Xử lý dữ liệu bệnh nhân - giữ nguyên thông tin từ API
            const foundPatientsData = (patientsResponse?.data || []).map(patient => ({
                ...patient,
                // Chỉ thêm số điện thoại search nếu patient không có số riêng
                searchedPhone: patientInfo.soDienThoai.trim()
            }));
            
            if (foundPatientsData.length > 0) {
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

            // Xử lý dữ liệu lịch khám
            const appointmentsData = appointmentsResponse?.data || [];
            console.log('📅 Appointments data:', appointmentsData);
            setApiAppointments(appointmentsData);

        } catch (error) {
            console.error('Error searching patient:', error);
            
            // Log chi tiết lỗi để debug
            if (error.response) {
                console.error('API Error Response:', error.response.data);
                console.error('API Error Status:', error.response.status);
                console.error('API Error Headers:', error.response.headers);
            } else if (error.request) {
                console.error('Network Error - No Response:', error.request);
            } else {
                console.error('Request Setup Error:', error.message);
            }
            
            // Hiển thị lỗi chi tiết hơn
            let errorMessage = 'Có lỗi xảy ra khi tìm kiếm thông tin bệnh nhân.';
            if (error.response) {
                if (error.response.status === 404) {
                    errorMessage = 'Không tìm thấy API endpoint. Kiểm tra kết nối backend.';
                } else if (error.response.status === 500) {
                    errorMessage = 'Lỗi server backend. Vui lòng kiểm tra logs server.';
                } else if (error.response.status === 400) {
                    errorMessage = 'Yêu cầu không hợp lệ. Kiểm tra format số điện thoại.';
                } else {
                    errorMessage = `Lỗi API: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
                }
            } else if (error.request) {
                errorMessage = 'Không thể kết nối đến server. Kiểm tra network và backend server.';
            }
            
            setError(errorMessage);
            setFoundPatients([]);
            setApiAppointments([]);
            setSearchResult({ found: false, message: 'Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.' });
            setIsNewPatient(true);
            setSearchedPhone(null);
        } finally {
            setIsLoadingPatients(false);
            setIsLoadingAppointments(false);
        }
    };

    // Function để refresh lại danh sách lịch khám sau khi có thay đổi
    const refreshAppointments = async () => {
        if (searchedPhone) {
            try {
                const response = await appointmentService.getAppointmentsByPhone(searchedPhone);
                setApiAppointments(response?.data || []);
            } catch (error) {
                console.error('Error refreshing appointments:', error);
            }
        }
    };

    const handleFillPatientInfo = (patient) => {
        setPatientInfo({
            hoTen: patient.fullName || patient.hoTen,
            soDienThoai: patient.searchedPhone || patient.phone || patient.soDienThoai, // Ưu tiên số đã search
            email: patient.email || '',
            ngaySinh: patient.birth || patient.ngaySinh,
            gioiTinh: patient.gender || patient.gioiTinh,
            diaChi: patient.address || patient.diaChi,
            cccd: patient.cccd || ''
        });
        setIsFormFilled(true); // Đánh dấu form đã được điền
        alert(`Đã điền thông tin bệnh nhân "${patient.fullName || patient.hoTen}" vào phiếu khám!`);
    };

    const handleEditPatient = (patient) => {
        // Map dữ liệu từ API response sang modal
        const mappedPatient = {
            ...patient,
            hoTen: patient.fullName || patient.hoTen,
            soDienThoai: patient.phone || patient.soDienThoai,
            email: patient.email || '',
            ngaySinh: patient.birth || patient.ngaySinh,
            gioiTinh: patient.gender || patient.gioiTinh, // Map gender từ API
            diaChi: patient.address || patient.diaChi,
            cccd: patient.cccd || ''
        };
        setSelectedPatientForModal(mappedPatient);
        setModalMode('edit');
        setShowPatientModal(true);
    };

    const handleViewPatient = (patient) => {
        // Map dữ liệu từ API response sang modal
        const mappedPatient = {
            ...patient,
            hoTen: patient.fullName || patient.hoTen,
            soDienThoai: patient.phone || patient.soDienThoai,
            email: patient.email || '',
            ngaySinh: patient.birth || patient.ngaySinh,
            gioiTinh: patient.gender || patient.gioiTinh, // Map gender từ API
            diaChi: patient.address || patient.diaChi,
            cccd: patient.cccd || ''
        };
        setSelectedPatientForModal(mappedPatient);
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

    const confirmAppointment = async () => {
        try {
            // Gọi API để xác nhận lịch khám - sử dụng enum status
            await appointmentService.confirmAppointment(selectedAppointment.id, 'DA_XAC_NHAN');
            
            // Cập nhật danh sách API appointments
            setApiAppointments(apiAppointments.map(apt => 
                apt.id === selectedAppointment.id 
                    ? { ...apt, status: 'DA_XAC_NHAN' }
                    : apt
            ));

            setShowConfirmModal(false);
            alert('Đã xác nhận lịch hẹn thành công!');
            
            // Refresh danh sách lịch khám
            await refreshAppointments();
        } catch (error) {
            console.error('Error confirming appointment:', error);
            alert('Có lỗi xảy ra khi xác nhận lịch hẹn. Vui lòng thử lại.');
        }
    };

    const cancelAppointment = async () => {
        try {
            // Gọi API để hủy lịch khám - sử dụng enum status  
            await appointmentService.confirmAppointment(selectedAppointment.id, 'KHONG_DEN');
            
            // Cập nhật danh sách API appointments
            setApiAppointments(apiAppointments.map(apt => 
                apt.id === selectedAppointment.id 
                    ? { ...apt, status: 'KHONG_DEN' }
                    : apt
            ));

            setShowCancelModal(false);
            alert('Đã hủy lịch hẹn!');
            
            // Refresh danh sách lịch khám
            await refreshAppointments();
        } catch (error) {
            console.error('Error canceling appointment:', error);
            alert('Có lỗi xảy ra khi hủy lịch hẹn. Vui lòng thử lại.');
        }
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
        setIsFormFilled(false); // Reset trạng thái form
    };

    // Chỉ sử dụng dữ liệu từ API
    const filteredAppointments = apiAppointments.filter(apt => {
        if (searchedPhone) {
            return apt.soDienThoai === searchedPhone || apt.phone === searchedPhone;
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
                                <button 
                                    className="btn-search" 
                                    onClick={handleSearchPatient}
                                    disabled={isLoadingPatients || isLoadingAppointments}
                                >
                                    {isLoadingPatients || isLoadingAppointments ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin"></i>
                                            Đang tìm kiếm...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-search"></i>
                                            Tìm kiếm
                                        </>
                                    )}
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

                {/* Error Message */}
                {error && (
                    <div className="error-message" style={{
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '0.75rem 1.25rem',
                        marginBottom: '1rem',
                        border: '1px solid #f5c6cb',
                        borderRadius: '0.375rem',
                        fontSize: '0.875rem'
                    }}>
                        <i className="fas fa-exclamation-triangle" style={{marginRight: '0.5rem'}}></i>
                        {error}
                    </div>
                )}

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
                                            <th>Ngày khám</th>
                                            <th>Trạng thái</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {isLoadingAppointments ? (
                                            <tr>
                                                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                                                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                                                    Đang tải danh sách lịch khám...
                                                </td>
                                            </tr>
                                        ) : filteredAppointments.length > 0 ? (
                                            filteredAppointments.map(appointment => {
                                                // Chuyển đổi status từ backend sang tiếng Việt
                                                const getVietnameseStatus = (status) => {
                                                    switch(status) {
                                                        case 'CHO_XAC_NHAN':
                                                            return 'Chờ xác nhận';
                                                        case 'DA_XAC_NHAN':
                                                            return 'Đã xác nhận';
                                                        case 'KHONG_DEN':
                                                            return 'Đã hủy';
                                                        default:
                                                            return status || 'Chờ xác nhận';
                                                    }
                                                };

                                                // Format thời gian hiển thị
                                                const formatTime = (time) => {
                                                    if (!time) return 'N/A';
                                                    // Nếu time là string dạng "HH:mm:ss" hoặc "HH:mm"
                                                    if (typeof time === 'string') {
                                                        return time.substring(0, 5); // Lấy HH:mm
                                                    }
                                                    return time.toString();
                                                };

                                                // Format ngày hiển thị
                                                const formatDate = (date) => {
                                                    if (!date) return 'N/A';
                                                    // Nếu date là string dạng "YYYY-MM-DD"
                                                    if (typeof date === 'string') {
                                                        const parts = date.split('-');
                                                        if (parts.length === 3) {
                                                            return `${parts[2]}/${parts[1]}/${parts[0]}`;
                                                        }
                                                    }
                                                    return date.toString();
                                                };

                                                const vietnameseStatus = getVietnameseStatus(appointment.status);

                                                return (
                                                    <tr key={appointment.id}>
                                                        <td>{appointment.fullName || 'N/A'}</td>
                                                        <td>{appointment.phone || 'N/A'}</td>
                                                        <td>{appointment.doctorResponse?.fullName || 'Chưa phân công'}</td>
                                                        <td>{formatTime(appointment.time)}</td>
                                                        <td>{formatDate(appointment.date)}</td>
                                                        <td>
                                                            <span className={`status-badge ${
                                                                vietnameseStatus === 'Đã xác nhận' ? 'confirmed' : 
                                                                vietnameseStatus === 'Đã hủy' ? 'cancelled' : 'pending'
                                                            }`}>
                                                                {vietnameseStatus}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div className="action-buttons">
                                                                {vietnameseStatus === 'Chờ xác nhận' && (
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
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="7" style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic', padding: '2rem' }}>
                                                    {searchedPhone ? 'Không tìm thấy lịch khám nào cho số điện thoại này' : 'Nhập số điện thoại để tìm kiếm lịch khám'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
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
                                                    <td>
                                                        <div>
                                                            <strong>{patient.fullName || patient.hoTen}</strong>
                                                            {patient.relationship && (
                                                                <div className="text-muted small">
                                                                    Quan hệ: {patient.relationship}
                                                                </div>
                                                            )}
                                                            <div className="text-muted small">
                                                                {/* SĐT tài khoản: {patient.searchedPhone} */}
                                                            </div>
                                                        </div>
                                                    </td>
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
                </div>

                {/* Phiếu khám bệnh - Section cuối cùng */}
                <div className="search-patient-section" style={{marginTop: '2rem'}}>
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
                                    disabled={isFormFilled}
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
                                    disabled={isFormFilled}
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
                                    disabled={isFormFilled}
                                />
                            </div>
                            <div className="form-group">
                                <label>Ngày sinh *</label>
                                <input 
                                    type="date" 
                                    required
                                    value={patientInfo.ngaySinh}
                                    onChange={(e) => setPatientInfo({...patientInfo, ngaySinh: e.target.value})}
                                    disabled={isFormFilled}
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
                                    disabled={isFormFilled}
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="NAM">Nam</option>
                                    <option value="NU">Nữ</option>
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
                                    disabled={isFormFilled}
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
                                    disabled={isFormFilled}
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
                                                    <option value="NAM">Nam</option>
                                                    <option value="NU">Nữ</option>
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
                                        <p><strong>Họ tên:</strong> {selectedAppointment.fullName || 'N/A'}</p>
                                        <p><strong>Số điện thoại:</strong> {selectedAppointment.phone || 'N/A'}</p>
                                        <p><strong>Email:</strong> {selectedAppointment.email || 'N/A'}</p>
                                        <p><strong>Ngày sinh:</strong> {selectedAppointment.birth || 'N/A'}</p>
                                        <p><strong>Địa chỉ:</strong> {selectedAppointment.address || 'N/A'}</p>
                                        <p><strong>Bác sĩ:</strong> {selectedAppointment.doctorResponse?.fullName || 'Chưa phân công'}</p>
                                        <p><strong>Ngày khám:</strong> {selectedAppointment.date || 'N/A'}</p>
                                        <p><strong>Giờ khám:</strong> {selectedAppointment.time ? selectedAppointment.time.substring(0, 5) : 'N/A'}</p>
                                        <p><strong>Triệu chứng:</strong> {selectedAppointment.symptoms || 'Không có'}</p>
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
                                    <p>Bạn có chắc chắn muốn hủy lịch hẹn của <strong>{selectedAppointment.fullName}</strong>?</p>
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
    );
};

export default KhamTrucTiep;
