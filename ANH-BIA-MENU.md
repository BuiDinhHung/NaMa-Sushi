# Bộ ảnh mới cho NAMA

Đã tạo 23 ảnh bằng công cụ imagegen tích hợp, dựa trên ảnh gốc trong dự án. Mỗi ảnh có bố cục riêng theo vị trí hiển thị, cùng ánh sáng ấm và nền đá tối.

| Vị trí | Tài sản | Tỷ lệ |
|---|---|---|
| Đầu trang desktop | `dist/assets/generated/hero-landscape.webp` | 16:9 |
| Đầu trang điện thoại | `dist/assets/generated/hero-mobile.webp` | 2:3 |
| Phần giới thiệu | `dist/assets/generated/story-portrait.webp` | 3:4 |
| 20 nhóm menu | `dist/assets/generated/menu-01.webp` đến `menu-20.webp` | 16:9 |

Các PNG gốc của bộ ảnh mới nằm tại `../.source/generated-nama/`. WebP chỉ là bản nén dùng trên web, không cắt hoặc chỉnh màu thêm. Prompt đầy đủ, ảnh tham chiếu và kích thước thực tế được lưu trong `image-prompts.json`.

Ảnh gốc của nhà hàng vẫn được giữ nguyên. Thư viện có 65 ảnh: 23 ảnh minh họa mới và 42 ảnh gốc, bao gồm đủ 12 ảnh khách gửi. Logo, thông tin món, giá và nội dung pháp lý được giữ.

Không chạy lại các script bố trí ảnh cũ (`arrange_photos.py`, `make_covers.py`) sau khi tích hợp bộ này, vì chúng sẽ thay các liên kết đang dùng. Script tích hợp bộ mới là `../.source/integrate_generated_photos.py`.
