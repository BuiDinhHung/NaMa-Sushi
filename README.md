# NAMA — Asian Fusion & Sushi

Website tĩnh: giao diện mới, logo gốc, 12 ảnh khách gửi, menu 139 món/đồ uống trong 20 nhóm, thư viện ảnh, đặt bàn, Impressum và Datenschutzhinweise.

## Chạy tại máy

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Mở http://127.0.0.1:4173. Kiểm tra: `node check.mjs`.

## Gửi email đặt bàn — cần kích hoạt trước khi nhận khách

- Địa chỉ trong Impressum gốc: `nama2025.sushi@gmail.com`. Cần chủ nhà hàng xác nhận đây là hộp thư nhận đặt bàn.
- `dist/booking-config.json` đang giữ cấu hình demo đã có: `enabled: true`, gửi đến mã FormSubmit ẩn danh và CC nhà hàng. Phiên chỉnh ảnh/format email này không thay đổi người nhận.
- Tích hợp đã viết cho FormSubmit AJAX. Chủ hộp thư phải xác nhận email kích hoạt của FormSubmit cho URL triển khai trước; xem https://formsubmit.co/ và https://formsubmit.co/ajax-documentation.
- Sau khi xác nhận hộp thư, kích hoạt dịch vụ và kiểm tra một yêu cầu có đánh dấu TEST được nhận thực tế, chuyển `enabled` thành `true` và xuất bản lại. Không gửi đơn thử cho nhà hàng nếu chưa được yêu cầu.
- Thông báo thành công chỉ hiện khi API trả về thành công; thông báo nêu rõ đây là yêu cầu, chưa phải bàn đã được nhà hàng xác nhận. Không có email tự động cho khách qua AJAX. Nhà hàng trả lời trực tiếp qua Reply-To của khách.
- Khi lỗi, dữ liệu form được giữ lại; form chặn gửi trùng khi đang xử lý, ngày quá khứ, thứ Hai và giờ ngoài khung phục vụ. Tất cả giờ tính theo Europe/Berlin.
- `check.mjs` kiểm tra các tình huống bằng phản hồi giả lập, không gửi email thật. Chưa kiểm tra hộp thư đầu cuối.

## Nội dung và tài sản

- `dist/menu.json`: toàn bộ dữ liệu món và giá, sao từ website gốc ngày 06/10/2026; `speisekarte.html` là bản đầy đủ đọc được khi tắt JavaScript.
- `dist/assets/nama-01.webp` đến `nama-12.webp`: ảnh mới đã tối ưu; ảnh JPG gốc còn nguyên ở thư mục cha.
- `dist/assets/logo.svg`: logo chữ NAMA đỏ trên nền kem theo mẫu khách gửi (tạo bằng `.source/make_logo.py`, chữ đã chuyển thành path); `original-00.webp` là logo tròn cũ, chỉ còn dùng làm favicon; `original-01.webp` đến `original-32.webp`: ảnh gốc được giữ trong dự án.
- Nội dung Impressum lấy từ ảnh Impressum gốc: Phan Van Tuan, địa chỉ, điện thoại, email, mã VAT DE459268954. Đoạn nền tảng ODR đã cập nhật vì EU đóng dịch vụ ngày 20/07/2025: https://consumer-redress.ec.europa.eu/site-relocation_en.
- Datenschutzhinweise ghi hosting chung chung ("externer Hosting-Dienstleister"); nên bổ sung tên nhà cung cấp hosting thực tế khi triển khai.
- Không tracking, không tải font bên ngoài, không thư viện frontend.

## Kiểm tra còn cần trước khi thay website thật

Xác nhận email nhận bàn và email thực tế tới hộp thư, kiểm tra giao diện trong trình duyệt trên điện thoại/desktop, đối chiếu lại nội dung pháp lý khi đổi hạ tầng. Phiên làm việc hiện tại không có trình duyệt khả dụng để kiểm tra trực quan/WebMCP. Website gốc chưa bị thay đổi.

## Chế độ demo (hiện tại)

`dist/booking-config.json` đang trỏ tới email demo `buidinhhung404@gmail.com` qua mã ẩn danh FormSubmit `b06af2efa12eb320ec8140009ac00e41` (mã lấy từ email kích hoạt, giúp email không lộ trong mã nguồn), `enabled: true`. Impressum/Datenschutz vẫn giữ email nhà hàng. Trước khi bàn giao: đổi `recipient` về `nama2025.sushi@gmail.com` và kích hoạt lại FormSubmit cho hộp thư đó.

- Ảnh bìa danh mục menu (`assets/cover-01..20.webp`, 16:9) được dựng từ ảnh gốc bằng `.source/make_covers.py`; chạy lại script này sau `finish_content.py`.
- Mỗi đơn cũng được gửi bản sao (FormSubmit `_cc`) tới `nama2025.sushi@gmail.com` qua trường `cc` trong `booking-config.json`; địa chỉ CC không cần kích hoạt. Muốn ngừng gửi bản sao thì xoá trường `cc`.

## Bộ ảnh tạo mới theo bố cục — 07/10/2026

- 23 ảnh được tạo thực sự bằng imagegen tích hợp dựa trên ảnh gốc: desktop hero 16:9, mobile hero 2:3, ảnh giới thiệu 3:4 và 20 nhóm menu 16:9. Xem `ANH-BIA-MENU.md` và `image-prompts.json` để biết vị trí, prompt và tham chiếu.
- `dist/assets/generated/` chứa bản WebP dùng trên web; PNG đầu ra được giữ tại `../.source/generated-nama/`. Không chỉnh/cắt ảnh gốc.
- Thư viện có 65 ảnh gồm 23 ảnh minh họa mới và 42 ảnh gốc; đủ 12 ảnh khách gửi. Menu giữ nguyên 139 món và giá trong 20 nhóm.
- Email đặt bàn dùng template `box` của FormSubmit; ngày tháng tiếng Đức, tiêu đề có ngày/giờ/số khách/tên khách, các trường lịch hẹn và liên hệ được sắp xếp rõ ràng. Reply-To, CC và cấu hình nhận mail giữ nguyên.
- `node check.mjs` kiểm tra dữ liệu, tài sản, tỷ lệ ảnh, đường dẫn, email và đặt bàn bằng phản hồi giả lập; không gửi email thử. Phiên hiện tại không có trình duyệt khả dụng để kiểm tra trực quan trong browser/mail client.
