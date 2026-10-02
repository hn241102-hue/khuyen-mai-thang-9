# Khuyến mãi khách hàng cá nhân — 03/10–11/10/2026

**Tên chương trình:** Nạp tiền hôm nay – Nhận thêm tới 35% ưu đãi.
**Đối tượng cập nhật:** Khách hàng cá nhân.
**Thời gian:** 03/10/2026 đến 11/10/2026.

## Mức ưu đãi theo ảnh cung cấp

| Mức phí dịch vụ gồm VAT | Ưu đãi thường | Ontop | Tổng ưu đãi |
| --- | ---: | ---: | ---: |
| 500.000 – dưới 1 triệu | 0% | 10% | 10% |
| 1 – dưới 2 triệu | 0% | 15% | 15% |
| 2 – dưới 5 triệu | 2% | 18% | 20% |
| 5 – dưới 10 triệu | 4% | 21% | 25% |
| 10 – dưới 20 triệu | 6% | 24% | 30% |
| 20 – dưới 50 triệu | 8% | 24% | 32% |
| Từ 50 triệu | 10% | 25% | 35% |

Ưu đãi thường có hạn sử dụng 180 ngày; Ontop có hạn sử dụng 90 ngày.
Tiền khuyến mãi vẫn tính trên số tiền chưa VAT: số tiền gồm VAT ÷ 1,08 × tổng tỷ lệ ưu đãi.

Bảng doanh nghiệp được giữ riêng theo chính sách cũ 23–29/9/2026 và được ghi rõ là bảng cũ. Chương trình tháng 10 trong ảnh không được áp dụng sang doanh nghiệp.

## Cập nhật lên GitHub và Vercel

1. Giải nén **Khuyen-mai-thang-10-Vercel.zip**.
2. Mở đúng repository GitHub đang kết nối với website Vercel hiện tại.
3. Tải đè toàn bộ file và thư mục trong bộ đã giải nén vào đúng thư mục mã nguồn cũ. Không tải nguyên file ZIP lên GitHub.
4. Commit thay đổi trên nhánh Vercel đang triển khai và chờ deployment hoàn tất.

Lần cập nhật này cần có đủ **index.html**, **app.js** và **pricing.js** để tên chương trình, ngày và tỷ lệ được cập nhật đồng bộ. Nếu chỉ thay styles.css thì sẽ không cập nhật mức khuyến mãi.
Không cần tạo repository hoặc dự án Vercel mới. Giữ nguyên thư mục assets khi tải lên.

## Xem trước

Mở **Khuyen-mai-thang-10.html** được gửi riêng để xem trước trực tiếp trên máy.
Để chạy mã nguồn: trong thư mục này chạy `python -m http.server 8080`, rồi mở http://localhost:8080.
File vercel.json cấu hình website tĩnh; không cần npm install hoặc lệnh build.

Layout, font Manrope, ảnh minh họa, kéo giãn bảng và cấu hình ngân hàng được giữ lại. Dòng tên chương trình mới được điều chỉnh cỡ chữ cho vừa vùng tiêu đề cũ.
Phần tra cứu, bảng phương án, trả góp và PNG lấy đúng tỷ lệ theo nhóm khách hàng được chọn.

Đã kiểm tra 7 mức khuyến mãi, các mốc chuyển mức, bật/tắt Ontop, tách chính sách doanh nghiệp, tương tác bằng mô phỏng DOM và ảnh PNG. Bộ file này chưa cập nhật trực tiếp website Vercel.
