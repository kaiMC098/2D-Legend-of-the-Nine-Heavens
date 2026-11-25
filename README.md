# Cửu Thiên Truyện Kỳ (Android Project + GitHub Actions Auto-Build APK)

Dự án game tu tiên **Cửu Thiên Truyện Kỳ** (`com.cuuthien.truyenky`), tích hợp sẵn:
- **Avatar & Biểu tượng ứng dụng (App Icon)** chuẩn Android (mdpi -> xxxhdpi + Adaptive Icon) từ ảnh bạn cung cấp.
- **Nâng cấp cơ chế gameplay:** Ngũ Hành Linh Mạch, Tâm Ma, Trận Pháp Hộ Thân, Độ Kiếp Cửu Trọng Thiên Lôi (dùng đan/hộ thuẫn trực tiếp), Luân Hồi Công Đức + Cộng Hưởng 3 Thiên Phú + Di Sản Kiếp Trước, Đấu Giá Hội AI, Linh Thú Tiến Hóa Huyết Mạch, Đại Hội Tông Môn 3 vòng + Đặt Cược, Tương tác NPC Nhân Quả (Tặng quà / Thâu Đạo / Học Bí Kíp / Tỷ Thí) và **Đổi Màu NPC theo 4 Tông Phái** (Ngọc Thanh, Huyết Ma, Kim Tiên, U Minh).
- **Workflow GitHub Actions (`.github/workflows/build-apk.yml`)** tự động xuất file `.apk` cài đặt trực tiếp trên Android không cần cài Android Studio hay bản quyền Unity.

## Cách xuất file APK trên GitHub (3 bước)

1. **Tạo Repository mới trên GitHub** (ví dụ: `CuuThienTruyenKy`).
2. **Giải nén file ZIP này và tải toàn bộ thư mục bên trong lên nhánh `main` của GitHub** (đảm bảo thư mục `.github/workflows/build-apk.yml`, `app/`, `build.gradle`, `settings.gradle` nằm ngay thư mục gốc của repo).
3. Vào tab **Actions** trên GitHub:
   - Chọn workflow **Build APK - Cửu Thiên Truyện Kỳ** (sẽ tự động chạy khi bạn push lên `main`, hoặc bấm **Run workflow**).
   - Chờ khoảng 1–2 phút đến khi có dấu tick xanh ✅.
   - Bấm vào phiên build vừa xong -> kéo xuống mục **Artifacts** -> tải về **`CuuThienTruyenKy-APK`** để lấy file `.apk` cài thẳng lên điện thoại Android!

## Giftcode tích hợp sẵn trong game
- `CUUTHIENTRUYENKY`
- `TIENHIEP999`
- `LINHTHACH888`
