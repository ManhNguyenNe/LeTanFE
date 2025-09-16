# Cập nhật API Tra cứu Bệnh nhân - Lễ tân

## Tổng quan thay đổi
Backend API `/api/patients?phone={phone}` đã được thay đổi để hỗ trợ mối quan hệ giữa các bệnh nhân với cùng một số điện thoại. Frontend letan đã được cập nhật để khớp với thay đổi này.

## Thay đổi Backend (đã có sẵn)
- API trả về `PatientsDto` thay vì array đơn giản
- Cấu trúc mới:
  ```java
  public class PatientsDto {
      private List<PatientResponse> patients;
      private Integer ownerId;
  }
  ```
- Mỗi `PatientResponse` có thêm trường `relationship` 

## Thay đổi Frontend (đã cập nhật)

### 1. Cập nhật PatientService (`src/services/patientService.js`)
- Xử lý cấu trúc response mới từ `PatientsDto`
- Đảm bảo tương thích ngược với cấu trúc cũ
- Thêm documentation về API mới

#### Trước:
```javascript
// API trả về array trực tiếp
const foundPatientsData = (patientsResponse?.data || []).map(patient => ({
    ...patient,
    searchedPhone: patientInfo.soDienThoai.trim()
}));
```

#### Sau:
```javascript
// Xử lý PatientsDto với patients array và ownerId
if (patientsResponse.data.patients && Array.isArray(patientsResponse.data.patients)) {
    foundPatientsData = patientsResponse.data.patients.map(patient => ({
        ...patient,
        relationship: patient.relationship || 'Chủ tài khoản',
        searchedPhone: patientInfo.soDienThoai.trim()
    }));
    ownerId = patientsResponse.data.ownerId;
}
```

### 2. Cập nhật KhamTrucTiep Component (`src/pages/KhamTrucTiep.jsx`)
- Xử lý cấu trúc response mới trong `handleSearchPatient`
- Hiển thị thông tin mối quan hệ trong bảng danh sách bệnh nhân
- Cải thiện thông báo kết quả tìm kiếm

#### Thay đổi chính:
1. **Xử lý dữ liệu API**: Logic phức tạp hơn để handle cả cấu trúc mới và cũ
2. **Hiển thị mối quan hệ**: Thêm thông tin quan hệ trong bảng bệnh nhân
3. **Thông báo chi tiết**: Cải thiện message hiển thị số lượng và loại quan hệ

### 3. Cập nhật Documentation (`API_INTEGRATION_README.md`)
- Thêm thông tin về cấu trúc API mới
- Ví dụ về PatientsDto response
- Ghi chú về trường relationship

## Tính năng mới
1. **Hiển thị mối quan hệ**: Người dùng có thể thấy mối quan hệ của từng bệnh nhân với chủ tài khoản
2. **Quản lý nhiều bệnh nhân**: Một số điện thoại có thể liên kết với nhiều bệnh nhân
3. **Thông tin chủ tài khoản**: Biết được ai là chủ sở hữu của số điện thoại

## Tương thích
- ✅ Tương thích ngược với API cũ
- ✅ Giữ nguyên tất cả chức năng hiện có
- ✅ Không làm ảnh hưởng đến các component khác
- ✅ Error handling được duy trì

## Testing
Để test các thay đổi:
1. Đảm bảo backend phongkham-be với API mới đang chạy
2. Tìm kiếm một số điện thoại có nhiều bệnh nhân liên kết
3. Xác nhận hiển thị đúng thông tin mối quan hệ
4. Test các chức năng điền form, sửa, xem vẫn hoạt động bình thường

## Files đã thay đổi
- `src/services/patientService.js` - Cập nhật xử lý API response  
- `src/pages/KhamTrucTiep.jsx` - Cập nhật logic và UI
- `API_INTEGRATION_README.md` - Cập nhật documentation
- `PATIENT_API_UPDATE_SUMMARY.md` - File tài liệu này

## Ghi chú
Không cần thay đổi phongkham-be như yêu cầu, chỉ cập nhật frontend letan để khớp với API đã thay đổi.