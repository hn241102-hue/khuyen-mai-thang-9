# Công cụ khuyến mãi 23–29/9/2026

Website tĩnh, responsive, sẵn sàng đưa lên Vercel. Giao diện được tái thiết kế theo tinh thần của trang tham khảo, không sao chép mã nguồn.

## Tính năng

- Chuyển đổi khách hàng cá nhân/doanh nghiệp.
- Áp dụng đúng ưu đãi thường, Flash Sale và tổng tỷ lệ theo từng mốc tiền.
- Công thức tiền khuyến mãi: `(Số tiền nạp ÷ 1,08) × Tổng tỷ lệ`.
- Tối đa 10 phương án độc lập; không cộng dồn giữa các dòng.
- Xuất bảng phương án thành ảnh PNG.
- Công cụ trả góp theo ngân hàng và kỳ hạn 3/6/9/12 tháng.
- Responsive cho máy tính, máy tính bảng và điện thoại.

## Kiểm tra nhanh

```bash
npm test
```

## Chạy tại máy

Có thể dùng bất kỳ máy chủ tĩnh nào. Ví dụ:

```bash
npx serve .
```

## Đưa lên Vercel

### Cách 1: Vercel CLI

```bash
npx vercel
```

Chọn `Other` nếu Vercel hỏi framework. Không cần lệnh build và thư mục output.

### Cách 2: Vercel Dashboard

1. Đưa thư mục này lên GitHub/GitLab/Bitbucket.
2. Trong Vercel chọn **Add New → Project** rồi import repository.
3. Framework Preset chọn **Other**.
4. Build Command và Output Directory để trống.
5. Bấm **Deploy**.

## Chỉnh dữ liệu

- Mốc và tỷ lệ khuyến mãi: `pricing.js` → `TIERS`.
- Phí trả góp ngân hàng: `pricing.js` → `BANKS`.
- Nội dung giao diện: `index.html`.
- Màu sắc và bố cục: `styles.css`.

Lưu ý: phí trả góp là dữ liệu cấu hình. Cần đối chiếu chính sách ngân hàng trước khi tư vấn chính thức.
