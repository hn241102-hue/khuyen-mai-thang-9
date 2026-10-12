# Khuyến mãi khách hàng cá nhân — 12–16/10/2026

Cập nhật theo bảng người dùng cung cấp ngày 12/10/2026.

| Mức nạp gồm VAT | Ưu đãi thường | Ưu đãi nạp tiền T10 | Tổng |
| --- | ---: | ---: | ---: |
| 500 nghìn – dưới 1 triệu | 0% | 0% | 0% |
| 1 – dưới 2 triệu | 0% | 18% | 18% |
| 2 – dưới 3 triệu | 2% | 18% | 20% |
| 3 – dưới 5 triệu | 2% | 22% | 24% |
| 5 – dưới 10 triệu | 4% | 24% | 28% |
| 10 – dưới 20 triệu | 6% | 24% | 30% |
| 20 – dưới 50 triệu | 8% | 26% | 34% |
| Từ 50 triệu | 10% | 26% | 36% |

Các mốc nạp xét theo số tiền gồm VAT, đúng tiêu đề bảng nguồn.
Giữ nguyên cách tính hiện tại: số tiền nạp ÷ 1,08 × tổng tỷ lệ ưu đãi.
Chỉ cập nhật các mức tỷ lệ khách hàng cá nhân và ngày 12–16/10 đã xác nhận; giữ nguyên giao diện.
Doanh nghiệp giữ bảng tỷ lệ, ngày áp dụng cũ và cách tính VAT riêng của bản trước.

## Cập nhật GitHub và Vercel

1. Giải nén Khuyen-mai-thang-10-Vercel.zip.
2. Mở repository GitHub cũ, vào thư mục đang chứa index.html.
3. Chọn Add file → Upload files. Tải đè tất cả file và thư mục bên trong bộ đã giải nén, bao gồm assets.
4. Commit thay đổi trên nhánh Vercel đang triển khai và chờ deployment hoàn tất.

Cần cập nhật đồng bộ index.html, app.js, pricing.js và styles.css. Đường dẫn có mã phiên bản 20261012 để tải bản mới.
Bộ mã nguồn có đầy đủ file giao diện, font cục bộ và ảnh. Không tải nguyên file ZIP hay thư mục bao ngoài lên GitHub.
Không cần tạo repository hay dự án Vercel mới.

## Xem trước và kiểm tra

Khuyen-mai-thang-10.html được gửi riêng có thể mở trực tiếp trên máy.
Mã nguồn chạy bằng `python -m http.server 8080`, rồi mở http://localhost:8080.
Cấu hình vercel.json dành cho website tĩnh, không cần cài gói hoặc chạy build.

Đã kiểm tra 8 mức và các mốc chuyển mức, ví dụ 4,4 triệu → 977.778đ, tra cứu, bảng phương án, trả góp, đổi nhóm khách hàng và xuất PNG bằng mô phỏng DOM/canvas.
Bộ file chưa được cập nhật trực tiếp lên GitHub hoặc Vercel.
