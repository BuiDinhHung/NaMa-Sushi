# Kích hoạt Resend cho NAMA

## Hiện trạng

Đã chuẩn bị mẫu HTML, mã API `resend-worker.mjs` và lựa chọn Resend trong form. API chưa triển khai và chưa có API key. Website vẫn dùng cấu hình FormSubmit hiện tại, không tự đổi người nhận hoặc gửi mail thử. Chạy `node check.mjs` và `node check-resend.mjs` để kiểm tra giả lập.

## Xác thực tên miền

1. Trong Resend → Domains → Add Domain, thêm `mail.nama-asianfusion.com` và chọn vùng gần người nhận (nhà hàng ở Đức).
2. Gửi danh sách DNS Resend hiển thị cho người đang quản lý tên miền. Họ thêm đúng tên, loại và giá trị bản ghi. Không tự đoán các giá trị DKIM/SPF và không xóa bản ghi mail hiện có.
3. Khi tên miền có trạng thái Verified, tạo API key có quyền Sending access, giới hạn đúng tên miền đó.
4. API key chỉ được nhập vào secret của máy chủ, không đưa vào `dist/booking-config.json`, mã trình duyệt hoặc chat.

Chưa có quyền DNS vẫn có thể nhờ chủ tên miền thêm bản ghi; không cần lấy toàn bộ tài khoản của họ. Một tên miền khác do anh quản lý cũng có thể dùng làm tên miền gửi, nhưng địa chỉ From sẽ mang tên miền đó. `onboarding@resend.dev` chỉ gửi thử đến email đăng ký tài khoản Resend, không thay thế tên miền gửi thật cho nhà hàng.

## Triển khai API gửi mail

Web đang là website tĩnh trên Sites. Mã API riêng sẵn cho Cloudflare Worker; việc triển khai cần tài khoản Cloudflare của đơn vị vận hành. `wrangler.resend.jsonc` chỉ triển khai API, không chuyển website ra khỏi Sites.

- Kiểm tra `PUBLIC_SITE_ORIGIN` đúng URL website, `MAIL_FROM` thuộc tên miền đã xác thực, `MAIL_TO` là email nhận bàn đã thống nhất và `MAIL_CC` nếu cần bản sao. Tất cả người nhận lấy từ cấu hình máy chủ, không lấy từ form.
- Mỗi khách hàng dùng tên Worker, API key, tên miền và namespace giới hạn gửi riêng. `namespace_id` trong mẫu là số do đơn vị vận hành tự chọn, cần đổi nếu trùng namespace đã dùng.
- Dùng Wrangler 4.36.0 trở lên. Cấu hình có giới hạn 5 yêu cầu/phút/IP tại mỗi vị trí Cloudflare; đây là giới hạn chống gửi dồn, không phải hạn mức chi phí toàn tài khoản.
- Đăng nhập Cloudflare, đặt `RESEND_API_KEY` bằng lệnh nhập secret tương tác, rồi triển khai:

```powershell
npx wrangler login
npx wrangler secret put RESEND_API_KEY --config wrangler.resend.jsonc
npx wrangler deploy --config wrangler.resend.jsonc
```

Lệnh hỏi secret trong terminal; không đưa key vào đối số. Kiểm tra bằng thư thử có đánh dấu TEST chỉ khi đã được người vận hành yêu cầu.

## Chuyển form khi đã sẵn sàng

Sau khi có URL API đã triển khai, cấu hình `dist/booking-config.json` thành `provider: "resend"`, `endpoint` là URL HTTPS của API với đường dẫn `/api/reservations`, và `enabled: true`. Endpoint chưa có trong dự án vì API chưa triển khai; không tự điền URL giả. Trường `recipient`/`cc` cũ chỉ dành cho FormSubmit, không điều khiển người nhận bên Resend.

Form giữ nguyên dữ liệu khi lỗi, chỉ thông báo thành công khi API gửi thành công. Gửi lại cùng dữ liệu sau lỗi dùng cùng mã yêu cầu để Resend chống thư trùng trong 24 giờ. Không tự chuyển sang FormSubmit sau lỗi Resend vì có thể gây gửi trùng.

Trước khi chuyển, cập nhật mục dịch vụ gửi form trong `datenschutz.html` theo dịch vụ thực sự sử dụng và thiết lập xử lý dữ liệu của đơn vị vận hành. Hiện nội dung pháp lý vẫn mô tả FormSubmit, phù hợp với dịch vụ đang hoạt động.

Tài liệu: [Resend domain](https://resend.com/docs/add-a-domain), [Resend test restriction](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain), [Cloudflare rate limit](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/).
