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

    const doctors = [
        { id: 1, name: 'BS. Nguyễn Văn A', specialty: 'Nội khoa' },
        { id: 2, name: 'BS. Trần Thị B', specialty: 'Ngoại khoa' },
        { id: 3, name: 'BS. Lê Văn C', specialty: 'Nhi khoa' },
        { id: 4, name: 'BS. Phạm Thị D', specialty: 'Sản phụ khoa' }
    ];

    const handleSearchPatient = () => {
        // Giả lập tìm kiếm bệnh nhân
        const mockResult = {
            found: true,
            patient: {
                id: 1,
                hoTen: 'Nguyễn Văn A',
                soDienThoai: '0123456789',
                email: 'nguyenvana@email.com',
                ngaySinh: '1990-01-01',
                gioiTinh: 'Nam',
                diaChi: '123 Đường ABC, Quận 1, TP.HCM'
            }
        };
        setSearchResult(mockResult);
        setIsNewPatient(!mockResult.found);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý tạo phiếu khám
        alert('Đã tạo phiếu khám thành công!');
    };

    return (
        <div className="letan-container">
            {/* Header */}
            <div className="letan-header">
                <div className="letan-header-content">
                    <h1>Khám trực tiếp</h1>
                    <Link to="/letan" className="back-btn">
                        <i className="fas fa-arrow-left"></i>
                        Quay lại
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
                                <label>Số điện thoại hoặc Email:</label>
                                <input 
                                    type="text" 
                                    placeholder="Nhập số điện thoại hoặc email"
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
                                {searchResult.found ? (
                                    <div className="patient-found">
                                        <h3>Thông tin bệnh nhân</h3>
                                        <div className="patient-details">
                                            <p><strong>Họ tên:</strong> {searchResult.patient.hoTen}</p>
                                            <p><strong>Số điện thoại:</strong> {searchResult.patient.soDienThoai}</p>
                                            <p><strong>Email:</strong> {searchResult.patient.email}</p>
                                            <p><strong>Ngày sinh:</strong> {searchResult.patient.ngaySinh}</p>
                                            <p><strong>Giới tính:</strong> {searchResult.patient.gioiTinh}</p>
                                            <p><strong>Địa chỉ:</strong> {searchResult.patient.diaChi}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="patient-not-found">
                                        <p>Không tìm thấy bệnh nhân. Vui lòng nhập thông tin mới.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Form thông tin bệnh nhân */}
                    <div className="patient-form-section">
                        <h2>{isNewPatient ? 'Thông tin bệnh nhân mới' : 'Cập nhật thông tin bệnh nhân'}</h2>
                        <form onSubmit={handleSubmit} className="patient-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Họ và tên *</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={patientInfo.hoTen}
                                        onChange={(e) => setPatientInfo({...patientInfo, hoTen: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Số điện thoại *</label>
                                    <input 
                                        type="tel" 
                                        required
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
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Địa chỉ</label>
                                    <input 
                                        type="text"
                                        value={patientInfo.diaChi}
                                        onChange={(e) => setPatientInfo({...patientInfo, diaChi: e.target.value})}
                                    />
                                </div>
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

                            <div className="form-actions">
                                <button type="button" className="btn-cancel">
                                    Hủy
                                </button>
                                <button type="submit" className="btn-submit">
                                    <i className="fas fa-plus"></i>
                                    Tạo phiếu khám
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KhamTrucTiep;
