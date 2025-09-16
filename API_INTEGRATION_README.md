# Tích hợp API Tra cứu Lịch khám - Lễ tân

## Tổng quan
Tích hợp API `/api/appointments/phone?phone={phone}` từ backend phongkham-be vào ứng dụng lễ tân để tra cứu bệnh nhân và lịch khám theo số điện thoại.

## Các tính năng đã tích hợp

### 1. Tra cứu Bệnh nhân và Lịch khám
- **API sử dụng**: 
  - `GET /api/patients?phone={phone}` - Tìm thông tin bệnh nhân (Cấu trúc mới: PatientsDto với relationship)
  - `GET /api/appointments/phone?phone={phone}` - Tìm lịch khám theo SĐT

#### Cấu trúc API Response mới cho `/api/patients`:
```json
{
  "data": {
    "patients": [
      {
        "id": "string",
        "fullName": "string", 
        "relationship": "string", // Mới: mối quan hệ với chủ SĐT
        "phone": "string",
        ...
      }
    ],
    "ownerId": "number" // Mới: ID chủ sở hữu SĐT
  }
}
```

### 2. Quản lý Lịch khám
- **API sử dụng**: 
  - `POST /api/receptionists/confirm` - Xác nhận/Hủy lịch khám

### 3. Giao diện người dùng
- Loading state khi gọi API
- Hiển thị thông báo lỗi
- Hiển thị kết quả tra cứu từ backend thực tế
- Kết hợp dữ liệu từ API và mock data

## Cấu trúc Files đã tạo

```
letan/src/
├── services/
│   ├── api.js                    # Cấu hình axios chung
│   ├── appointmentService.js     # Service cho appointment APIs
│   └── patientService.js         # Service cho patient APIs
└── pages/
    └── KhamTrucTiep.jsx         # Component chính đã được cập nhật
```

## Cấu hình

### 1. Environment Variables
Tạo file `.env` trong thư mục `letan/`:
```
REACT_APP_API_BASE_URL=http://localhost:8080
```

### 2. Dependencies
Dự án đã có sẵn `axios` trong package.json.

## Cách sử dụng

### 1. Tra cứu bệnh nhân
1. Nhập số điện thoại trong ô tìm kiếm
2. Nhấn nút "Tìm kiếm"
3. Hệ thống sẽ gọi API để tìm:
   - Thông tin bệnh nhân với mối quan hệ (relationship)
   - Lịch khám đã đặt
4. Kết quả hiển thị trong hai phần:
   - Danh sách bệnh nhân tìm được (có hiển thị mối quan hệ)
   - Danh sách lịch khám của số điện thoại

**Tính năng mới**: Hiển thị mối quan hệ giữa các bệnh nhân với chủ sở hữu số điện thoại

### 2. Xác nhận lịch khám
1. Trong danh sách lịch khám, nhấn "Xác nhận" hoặc "Hủy"
2. Hệ thống gọi API backend để cập nhật trạng thái
3. Danh sách được tự động refresh sau khi cập nhật

## API Services

### AppointmentService
```javascript
// Lấy lịch khám theo SĐT
const appointments = await appointmentService.getAppointmentsByPhone('0123456789');

// Xác nhận lịch khám
await appointmentService.confirmAppointment(appointmentId, 'Đã xác nhận');

// Tạo lịch khám mới
await appointmentService.createAppointment(appointmentData);
```

### PatientService
```javascript
// Lấy thông tin bệnh nhân theo SĐT
const patients = await patientService.getPatientsByPhone('0123456789');

// Tạo bệnh nhân mới
await patientService.createPatient(patientData);
```

## Error Handling
- Hiển thị thông báo lỗi khi API call thất bại
- Loading state trong khi chờ API response
- Xử lý timeout (10 giây)
- Fallback về mock data nếu cần

## Lưu ý
1. Đảm bảo backend phongkham-be đang chạy trước khi test
2. Kiểm tra CORS settings trên backend
3. Cập nhật `REACT_APP_API_BASE_URL` theo môi trường deploy
4. Có thể thêm authentication headers nếu backend yêu cầu JWT

## Testing
1. Start backend: `cd phongkham-be && ./mvnw spring-boot:run`
2. Start frontend: `cd letan && npm start`
3. Test tra cứu với các số điện thoại có trong database
4. Test xác nhận/hủy lịch khám