import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Letan.css';

const LetanDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

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
                    <button 
                        className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <i className="fas fa-tachometer-alt"></i>
                        Tổng quan
                    </button>
                    <Link to="/letan/kham-truc-tiep" className="nav-btn">
                        <i className="fas fa-user-plus"></i>
                        Khám trực tiếp
                    </Link>
                    <Link to="/letan/xac-nhan-dat-lich" className="nav-btn">
                        <i className="fas fa-calendar-check"></i>
                        Xác nhận đặt lịch
                    </Link>
                    <button className="nav-btn">
                        <i className="fas fa-print"></i>
                        In phiếu khám
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="letan-main">
                {activeTab === 'dashboard' && (
                    <div className="dashboard-content">
                        <div className="dashboard-stats">
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-users"></i>
                                </div>
                                <div className="stat-info">
                                    <h3>25</h3>
                                    <p>Bệnh nhân hôm nay</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-calendar-alt"></i>
                                </div>
                                <div className="stat-info">
                                    <h3>12</h3>
                                    <p>Lịch đặt online</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <div className="stat-info">
                                    <h3>8</h3>
                                    <p>Đang chờ khám</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <div className="stat-info">
                                    <h3>17</h3>
                                    <p>Đã hoàn thành</p>
                                </div>
                            </div>
                        </div>

                        <div className="dashboard-sections">
                            <div className="section-card">
                                <h3>Bệnh nhân đang chờ khám</h3>
                                <div className="waiting-list">
                                    <div className="waiting-item">
                                        <div className="patient-info">
                                            <span className="patient-name">Nguyễn Văn A</span>
                                            <span className="patient-time">08:30</span>
                                        </div>
                                        <div className="patient-status">
                                            <span className="status-badge waiting">Đang chờ</span>
                                        </div>
                                    </div>
                                    <div className="waiting-item">
                                        <div className="patient-info">
                                            <span className="patient-name">Trần Thị B</span>
                                            <span className="patient-time">09:15</span>
                                        </div>
                                        <div className="patient-status">
                                            <span className="status-badge waiting">Đang chờ</span>
                                        </div>
                                    </div>
                                    <div className="waiting-item">
                                        <div className="patient-info">
                                            <span className="patient-name">Lê Văn C</span>
                                            <span className="patient-time">10:00</span>
                                        </div>
                                        <div className="patient-status">
                                            <span className="status-badge in-progress">Đang khám</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="section-card">
                                <h3>Lịch đặt online cần xác nhận</h3>
                                <div className="appointment-list">
                                    <div className="appointment-item">
                                        <div className="appointment-info">
                                            <span className="appointment-name">Phạm Thị D</span>
                                            <span className="appointment-phone">0123456789</span>
                                            <span className="appointment-time">14:30 - 15:00</span>
                                        </div>
                                        <div className="appointment-actions">
                                            <button className="btn-confirm">Xác nhận</button>
                                            <button className="btn-cancel">Hủy</button>
                                        </div>
                                    </div>
                                    <div className="appointment-item">
                                        <div className="appointment-info">
                                            <span className="appointment-name">Hoàng Văn E</span>
                                            <span className="appointment-phone">0987654321</span>
                                            <span className="appointment-time">15:30 - 16:00</span>
                                        </div>
                                        <div className="appointment-actions">
                                            <button className="btn-confirm">Xác nhận</button>
                                            <button className="btn-cancel">Hủy</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LetanDashboard;
