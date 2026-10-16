# Khuyến mãi cá nhân và doanh nghiệp — 19–23/10/2026

Cập nhật tỷ lệ theo hai bảng người dùng cung cấp ngày 16/10/2026. Giữ nguyên layout, font, ảnh, thao tác kéo giãn bảng và cách tính tiền hiện tại.

## Khách hàng cá nhân

| Mức nạp gồm VAT | Thường | Ontop | Tổng |
| --- | ---: | ---: | ---: |
| 500 nghìn – dưới 2 triệu | 0% | 8% | 8% |
| 2 – dưới 5 triệu | 2% | 18% | 20% |
| 5 – dưới 10 triệu | 4% | 21% | 25% |
| 10 – dưới 20 triệu | 6% | 22% | 28% |
| 20 – dưới 50 triệu | 8% | 22% | 30% |
| 50 – dưới 100 triệu | 10% | 22% | 32% |
| Từ 100 triệu | 10% | 25% | 35% |

## Khách hàng doanh nghiệp

| Mức nạp gồm VAT | Thường | Flash Sale | Tổng |
| --- | ---: | ---: | ---: |
| 5 – dưới 10 triệu | 0% | 25% | 25% |
| 10 – dưới 20 triệu | 5% | 23% | 28% |
| 20 – dưới 50 triệu | 7% | 23% | 30% |
| 50 – dưới 100 triệu | 10% | 24% | 34% |
| 100 – dưới 300 triệu | 12% | 26% | 38% |
| Từ 300 triệu | 14% | 26% | 40% |

Các mốc nạp xét theo số tiền gồm VAT. Ưu đãi thường có HSD 180 ngày; phần Ontop / Flash Sale có HSD 90 ngày. Giữ nguyên công thức của website: số tiền nạp ÷ 1,08 × tổng tỷ lệ ưu đãi, làm tròn đến đồng.

## Cập nhật GitHub → Vercel

1. Giải nén Khuyen-mai-thang-10-Vercel.zip.
2. Mở repository GitHub cũ, vào đúng thư mục đang chứa index.html.
3. Add file → Upload files, tải đè các file và thư mục bên trong bộ giải nén, bao gồm assets.
4. Commit changes trên nhánh liên kết với Vercel và chờ triển khai hoàn tất.

Không tải nguyên ZIP hoặc tạo thêm thư mục bao ngoài. Không cần tạo repository hay dự án Vercel mới. Nếu chỉ muốn thay các file đã sửa: index.html, app.js, pricing.js và README.md; các file còn lại giữ nguyên.

Khuyen-mai-thang-10.html là bản xem trước độc lập có thể mở trực tiếp trên máy.
Bộ mã nguồn là website tĩnh, không cần cài gói hoặc chạy build. Chạy thử bằng `python -m http.server 8080` rồi mở http://localhost:8080.

Đã kiểm tra các mốc chuyển tỷ lệ, bật/tắt phần ưu đãi thêm, chuyển nhóm khách hàng, tra cứu, bảng phương án, trả góp và xuất PNG bằng mô phỏng DOM/canvas. Bộ file chưa được cập nhật trực tiếp lên GitHub hoặc Vercel.
