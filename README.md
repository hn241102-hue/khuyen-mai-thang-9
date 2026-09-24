# Website khuyến mãi tháng 9 — bản chỉnh sửa

## Đã bổ sung

- Font Manrope hỗ trợ tiếng Việt, kèm sẵn font trong bộ website.
- Bố cục thoáng, chữ lớn và rõ hơn; giao diện thích ứng với màn hình điện thoại.
- Bảng phương án theo hình tham khảo: logo, Flash Sale, lịch ưu đãi, đồng xu, mũi tên, ô phần trăm và chi tiết thời hạn ưu đãi.
- Cột “Tổng % khuyến mãi” = ưu đãi thường + Flash Sale; tự cập nhật theo nhóm khách hàng, số tiền và công tắc Flash Sale.
- Kéo vạch giữa các cột để thay đổi độ rộng. Có thể dùng phím trái/phải khi vạch đang được chọn.
- Kéo góc dưới bên phải để thay đổi chiều rộng bảng và giãn dòng; hoặc dùng hai thanh trượt. Nút Đặt lại đưa bảng về kích thước ban đầu.
- PNG độ phân giải 2× có đầy đủ các cột, hình trang trí, thông tin tư vấn và kích thước đã chọn.
- Giữ dữ liệu khuyến mãi và ngân hàng từ trang hiện tại. Không đổi tỷ lệ chỉ để khớp con số trong hình mẫu.

Bảng phương án là khổ poster tối thiểu 980 px. Trên điện thoại, vuốt ngang trong vùng bảng để xem đủ các cột.

## Đưa lên GitHub rồi kết nối Vercel — làm bằng trình duyệt

### Bước 1: Giải nén

Giải nén Khuyen-mai-thang-9-Vercel.zip. Mở thư mục vừa giải nén: bạn sẽ thấy index.html, styles.css, app.js, pricing.js, fonts.css, vercel.json, README.md và thư mục assets.

Hãy tải các file và thư mục bên trong lên GitHub; GitHub không tự giải nén file ZIP để chạy website. Giữ nguyên thư mục assets và các thư mục con.

### Bước 2: Tải lên GitHub

Nếu đã có repository của website, mở repository đó. Nếu chưa có, vào https://github.com/new và tạo một repository, ví dụ khuyen-mai-thang-9. Bạn có thể chọn Private.

- Repository mới trống: chọn liên kết “uploading an existing file”.
- Repository đã có file: chọn “Add file” → “Upload files”.
- Kéo toàn bộ file và thư mục assets từ thư mục đã giải nén vào vùng tải lên.
- Ghi nội dung commit, ví dụ “Cập nhật giao diện khuyến mãi tháng 9”, rồi chọn “Commit changes”.
- Sau khi tải xong, index.html và vercel.json phải xuất hiện ngay ở trang chính của repository, cùng cấp với thư mục assets.

Nếu cập nhật bản cũ, tải đầy đủ bộ mới để ghi đè các file tương ứng. Không cần tải file HTML xem thử gửi riêng lên repository.

### Bước 3: Kết nối Vercel

Nếu repository đã nối với dự án Vercel hiện tại, commit vào nhánh production sẽ kích hoạt triển khai theo cấu hình kết nối. Vào dự án đó để theo dõi deployment mới.

Nếu chưa kết nối:

1. Đăng nhập Vercel và chọn “Add New…” → “Project”.
2. Trong “Import Git Repository”, kết nối tài khoản GitHub nếu được hỏi, chọn repository vừa tải lên rồi chọn “Import”.
3. Kiểm tra cấu hình sau:

| Mục | Giá trị |
| --- | --- |
| Framework Preset | Other |
| Root Directory | Gốc repository, nơi có index.html |
| Build Command | Bật Override và để trống |
| Output Directory | . |
| Install Command | Để trống |
| Environment Variables | Không cần |

4. Chọn “Deploy”. Khi deployment báo “Ready”, mở địa chỉ website Vercel cung cấp.

File vercel.json đã cấu hình website tĩnh. Không cần npm install hoặc npm run build.

### Giữ địa chỉ website cũ

Để giữ khuyen-mai-thang-9.vercel.app, hãy cập nhật đúng repository đang nối với dự án Vercel hiện tại. Tạo dự án Vercel mới có thể nhận một địa chỉ khác.

Sau này, bạn cập nhật mã nguồn trên repository đã kết nối và commit vào nhánh production để Vercel triển khai bản mới.

## Đưa lên bằng Vercel CLI (nếu đã dùng CLI)

Trong thư mục chứa index.html:

```sh
npx vercel
```

Chọn tài khoản và liên kết với đúng dự án hiện có nếu cần giữ địa chỉ cũ. Kiểm tra bản preview, sau đó chạy:

```sh
npx vercel --prod
```

## Xem trước và chỉnh sửa

File Khuyen-mai-thang-9.html được gửi riêng có thể mở trực tiếp trên máy, không cần cài đặt. Nó là bản đóng gói độc lập để xem trước; để chỉnh mã nguồn và triển khai, dùng bộ file trong thư mục này.

Để chạy bộ mã nguồn trên máy có Python:

```sh
python -m http.server 8080
```

Mở http://localhost:8080. Không mở trực tiếp index.html bằng file:// vì app.js sử dụng JavaScript module.

- index.html: cấu trúc trang và nội dung.
- styles.css: bố cục và giao diện.
- app.js: tương tác, kéo giãn, xuất PNG.
- pricing.js: tỷ lệ khuyến mãi, VAT và cấu hình phí ngân hàng.
- fonts.css và assets/fonts: font Manrope dùng cục bộ.
- assets/campaign-reference.png: hình người dùng cung cấp; phần logo và minh họa được lấy từ hình này.

Thông tin nhập chỉ dùng trong trang hiện tại, không được gửi lên máy chủ. Tải lại trang sẽ đặt lại các phương án. Các con số chính sách được giữ từ website nguồn, không phải xác nhận độc lập về chính sách đang có hiệu lực.

Nguồn hướng dẫn triển khai:
https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
https://vercel.com/docs/builds/configure-a-build
https://vercel.com/docs/git
https://vercel.com/docs/cli/deploy

Bản đóng gói này chưa tự động cập nhật website đang chạy trên Vercel.
