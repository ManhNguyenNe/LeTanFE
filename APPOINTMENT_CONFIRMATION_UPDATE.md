# Cập nhật chức năng Xác nhận đặt lịch - Tự động tạo Phiếu khám bệnh

## Mô tả chức năng

Sau khi xác nhận đặt lịch online, hệ thống sẽ tự động:
1. Cập nhật trạng thái lịch khám thành "Đã xác nhận" 
2. Tạo hoặc tìm thông tin bệnh nhân trong hệ thống
3. Tạo Phiếu khám bệnh (Medical Record) tương ứng
4. Điền thông tin vào form "Phiếu khám bệnh" ở phía dưới

## Luồng xử lý

### 1. Xác nhận lịch khám
```javascript
// Trong hàm confirmAppointment()
await appointmentService.confirmAppointment(selectedAppointment.id, 'DA_XAC_NHAN');
```

### 2. Tạo Medical Record
```javascript
// Tìm hoặc tạo bệnh nhân
const patientsResponse = await patientService.getPatientsByPhone(appointment.phone);
if (patients.length > 0) {
    // Sử dụng bệnh nhân có sẵn
    patientId = patients[0].id;
} else {
    // Tạo bệnh nhân mới
    const newPatient = await patientService.createPatient(patientData);
    patientId = newPatient.data.id;
}

// Tạo phiếu khám bệnh
const medicalRecordData = {
    patientId: patientId,
    healthPlanId: appointment.healthPlanResponse?.id || null,
    doctorId: appointment.doctorResponse?.id || null,
    symptoms: appointment.symptoms || 'Đặt lịch online - chưa có triệu chứng cụ thể'
};
await medicalRecordService.createMedicalRecord(medicalRecordData);
```

### 3. Điền thông tin vào form
```javascript
// Điền thông tin bệnh nhân
setPatientInfo({
    hoTen: appointment.fullName,
    soDienThoai: appointment.phone,
    email: appointment.email,
    // ...
});

// Điền thông tin dịch vụ khám
if (appointment.healthPlanResponse) {
    setSelectedOptionType('package');
    setSelectedOption(appointment.healthPlanResponse.id.toString());
} else if (appointment.doctorResponse) {
    setSelectedOptionType('doctor');
    // ...
}
```

## API sử dụng

### Backend APIs
- `POST /api/receptionists/confirm` - Xác nhận lịch khám
- `GET /api/patients?phone={phone}` - Tìm bệnh nhân theo SĐT
- `POST /api/patients` - Tạo bệnh nhân mới
- `POST /api/medical-record` - Tạo phiếu khám bệnh

### Services đã tạo/cập nhật
- `medicalRecordService.js` - Service mới cho Medical Record
- `patientService.js` - Đã có sẵn
- `appointmentService.js` - Đã có sẵn

## Cấu trúc dữ liệu

### AppointmentResponse
```javascript
{
    id: Integer,
    fullName: String,
    phone: String,
    email: String,
    birth: LocalDate,
    gender: String,
    address: String,
    healthPlanResponse: {
        id: Integer,
        name: String
    },
    doctorResponse: {
        id: Integer,
        position: String
    },
    departmentId: Integer,
    symptoms: String
}
```

### MedicalRequest
```javascript
{
    patientId: Integer,
    healthPlanId: Integer, // nullable
    doctorId: Integer,     // nullable
    symptoms: String
}
```

### PatientRequest
```javascript
{
    fullName: String,
    phone: String,
    email: String,
    birth: LocalDate,
    gender: String,
    address: String,
    cccd: String
}
```

## Xử lý lỗi

- Nếu không tìm thấy bệnh nhân và không tạo được: Hiển thị lỗi "Không thể tạo hoặc tìm thông tin bệnh nhân"
- Nếu tạo Medical Record thất bại: Hiển thị lỗi từ API
- Nếu xác nhận lịch khám thất bại: Hiển thị "Có lỗi xảy ra khi xác nhận lịch hẹn"

## Lợi ích

1. **Tự động hóa**: Giảm thời gian thao tác thủ công của lễ tân
2. **Đồng bộ dữ liệu**: Đảm bảo thông tin nhất quán giữa lịch khám và phiếu khám bệnh
3. **Trải nghiệm tốt hơn**: Lễ tân chỉ cần xác nhận một lần là có đầy đủ thông tin
4. **Giảm sai sót**: Tự động điền thông tin từ lịch đặt, tránh nhập nhầm

## Hướng dẫn sử dụng

1. Trong danh sách "Lịch đặt online", nhấn nút **"Xác nhận"** cho lịch hẹn cần xử lý
2. Hệ thống hiển thị popup xác nhận với đầy đủ thông tin
3. Nhấn **"Xác nhận lịch hẹn"**
4. Hệ thống sẽ:
   - Cập nhật trạng thái lịch khám
   - Tạo phiếu khám bệnh tự động
   - Điền thông tin xuống form "Phiếu khám bệnh"
   - Cuộn trang xuống form để lễ tân kiểm tra
5. Lễ tân có thể chỉnh sửa thông tin nếu cần và nhấn **"In phiếu khám"**