# TroMapDana

Bản đồ nhà trọ Đà Nẵng - Hỗ trợ sinh viên tìm trọ nhanh chóng.

## Cấu trúc Project

```
D:\TroMap\
├── tromap-dana/          # App chính (public users)
├── tromap-admin/         # App admin (quản lý)
├── supabase/             # Database migrations
└── README.md
```

## Setup

### 1. Cài đặt Dependencies

```bash
cd tromap-dana
npm install

cd ../tromap-admin
npm install
```

### 2. Cấu hình Supabase

1. Tạo project mới tại [supabase.com](https://supabase.com)
2. Copy file `.env.example` thành `.env.local`
3. Điền thông tin Supabase của bạn

### 3. Setup Database

1. Vào Supabase Dashboard > SQL Editor
2. Copy nội dung file `supabase/migrations/001_initial_schema.sql`
3. Paste và chạy

### 4. Tạo Admin User

Chạy SQL trong Supabase:

```sql
INSERT INTO admin_users (email, password_hash, ten)
VALUES ('your-email@example.com', 'hashed-password', 'Admin');
```

**Lưu ý**: Password cần hash trước. Có thể dùng:
- [Bcrypt generator online](https://bcrypt-generator.com)
- Hoặc tạo qua code

### 5. Chạy Development Server

```bash
# App chính
cd tromap-dana
npm run dev

# Admin (terminal khác)
cd tromap-admin
npm run dev
```

## URLs

- **App chính**: http://localhost:3000
- **Admin**: http://localhost:3001 (hoặc localhost:3000/tromap-admin)

## Tính năng

### App Chính (tromap-dana)
- Map Leaflet với markers animation
- Filter theo giá, diện tích, khoảng cách
- Geolocation + kiểm tra bounds Đà Nẵng
- Loading screen với cartoon background
- Mobile-first responsive

### Admin (tromap-admin)
- Dashboard với thống kê
- CRUD nhà trọ
- CRUD chủ trọ (SĐT/Zalo ẩn mặc định)
- Tạo báo giá tự động
- Export báo cáo

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Map**: Leaflet + React-Leaflet
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Icons**: Lucide React

## Quy tắc quan trọng

### Bảo mật
- SĐT/Zalo chủ trọ CHỈ admin thấy (RLS enabled)
- Không lưu ảnh phòng
- Không hiển thị thông tin liên hệ công khai

### Pháp lý
- Chỉ hiển thị link Facebook
- Cần consent từ chủ trọ trước khi đăng
- Auto ẩn khi gói hết hạn

## Chi phí

- Supabase: Miễn phí (đủ cho MVP)
- Vercel: Miễn phí
- Domain: ~200k/năm

## License

Copyright © 2026 TroMapDana
