# Khuyến mãi doanh nghiệp tháng 10

Bộ mã nguồn HTML, CSS và JavaScript để đưa lên GitHub và triển khai trên Vercel. Không cần API key, cơ sở dữ liệu hay thư viện bên ngoài.

## Đưa lên GitHub và Vercel

1. Giải nén `khuyen-mai-doanh-nghiep-github.zip`.
2. Tạo repository trên GitHub. Chọn **Add file → Upload files**, tải toàn bộ **nội dung bên trong** thư mục `khuyen-mai-doanh-nghiep` lên rồi commit. `package.json`, `index.html` và `vercel.json` phải nằm ở thư mục gốc repository.
3. Trên Vercel, tạo Project và import repository vừa tạo.
4. Dùng cấu hình sau rồi chọn **Deploy**. Các thông số build đã có trong `vercel.json`:

| Thiết lập | Giá trị |
| --- | --- |
| Framework Preset | Other |
| Root Directory | Thư mục gốc chứa `package.json` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Environment Variables | Không cần |

Nếu cập nhật repository cũ, thay thế các file trùng tên và giữ nguyên cấu trúc thư mục. Nếu Vercel đã kết nối repository đó, commit mới sẽ kích hoạt triển khai theo thiết lập của project.

Tài liệu cấu hình Vercel: https://vercel.com/docs/project-configuration/vercel-json

## Nội dung đã cập nhật

- Mặc định chọn **Doanh nghiệp**, vẫn giữ chế độ Cá nhân của trang mẫu.
- Thay bảng doanh nghiệp tháng 9 bằng 9 mức tháng 10 từ ảnh cung cấp.
- Tính cùng một tỷ lệ cho tra cứu, bảng phương án, trả góp và PNG.
- Có thể bật/tắt ưu đãi tháng 10, thêm/xóa tối đa 10 phương án, sửa tên gói và thông tin tư vấn viên.
- Điều chỉnh độ rộng cột, chiều rộng bảng và giãn dòng trước khi tải PNG.
- Khi tắt ưu đãi tháng 10, tỷ lệ tối đa và tiêu đề PNG chuyển về ưu đãi thường (doanh nghiệp: 14%).
- Thay ảnh/phông chữ bị 404 trên trang mẫu bằng đồ họa SVG cục bộ và phông hệ thống. Không phụ thuộc website mẫu để hoạt động.

## Tỷ lệ doanh nghiệp theo ảnh

| Mức nạp / giao dịch (đã gồm VAT) | Thường, HSD 180 ngày | Ưu đãi T10, HSD 90 ngày | Tổng |
| --- | ---: | ---: | ---: |
| 500.000 đến dưới 1 triệu | 0% | 0% | 0% |
| 1 đến dưới 3 triệu | 0% | 18% | 18% |
| 3 đến dưới 5 triệu | 0% | 22% | 22% |
| 5 đến dưới 10 triệu | 0% | 24% | 24% |
| 10 đến dưới 20 triệu | 5% | 24% | 29% |
| 20 đến dưới 50 triệu | 7% | 26% | 33% |
| 50 đến dưới 100 triệu | 10% | 26% | 36% |
| 100 đến dưới 300 triệu | 12% | 26% | 38% |
| Từ 300 triệu | 14% | 26% | 40% |

Mốc nạp xét trên giá đã gồm VAT. Giữ công thức của trang mẫu:

`Tiền khuyến mãi = làm tròn((Số tiền nạp / 1,08) × Tổng tỷ lệ / 100)`

Ví dụ nạp 20 triệu: tổng tỷ lệ doanh nghiệp 33%, tiền khuyến mãi 6.111.111đ.

Tiền từng phần và tổng tiền được làm tròn độc lập như bản gốc, nên tổng các phần có thể lệch 1đ so với tổng khuyến mãi.

## Nguồn và thời gian chương trình

- Trang tham chiếu: https://khuyen-mai-thang-10.vercel.app/ (đọc ngày 12/10/2026).
- Ảnh tỷ lệ doanh nghiệp: `assets/business-policy-october.png`.
- Ảnh chỉ ghi tháng 10, không có ngày bắt đầu/kết thúc. Bản này **tạm giữ 12/10/2026 đến 16/10/2026 theo chương trình tháng 10 trên trang mẫu**. Nếu doanh nghiệp có lịch riêng, sửa `CAMPAIGNS.business` trong `pricing.js` trước khi dùng thực tế.
- VAT 8%, bảng cá nhân và mức phí ngân hàng được giữ từ trang mẫu; không được đối chiếu lại với thông báo chính sách bên ngoài.
- Công cụ không tự bật/tắt theo ngày. Người dùng chọn có áp dụng ưu đãi tháng 10 hay không bằng ô chương trình.
- Tên và số điện thoại chỉ dùng trong phiên trình duyệt và ảnh xuất; ứng dụng không gửi dữ liệu này lên máy chủ hay lưu vào localStorage.

## Sửa nội dung

| File | Mục đích |
| --- | --- |
| `pricing.js` | Tỷ lệ, mốc nạp, ngày chương trình, VAT, phí ngân hàng |
| `app.js` | Tương tác, dựng bảng, vẽ và tải PNG |
| `index.html` | Cấu trúc trang |
| `styles.css` | Giao diện và màn hình nhỏ |
| `assets/campaign-art.svg` | Trang trí bảng phương án |
| `scripts/build.mjs` | Tạo thư mục triển khai `dist` |

## Kiểm tra và chạy trên máy

Với Node.js 20 trở lên:

```bash
npm test
npm run build
```

Không cần `npm install` để chạy các lệnh trên vì không có dependencies. Để xem trang, dùng máy chủ tĩnh, ví dụ Python 3:

```bash
python -m http.server 8000 --directory dist
```

Sau đó mở http://localhost:8000. Không mở `index.html` bằng cách nhấp đúp vì trình duyệt có thể chặn ES modules trên địa chỉ `file://`.

Kiểm thử tự động kiểm tra các mốc tỷ lệ, trước ranh giới 1đ, bật/tắt ưu đãi, VAT và liên kết phép tính trả góp. Giao diện trình duyệt và triển khai Vercel thực tế cần được kiểm tra sau khi import project.
