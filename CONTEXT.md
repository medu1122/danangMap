# TroMapDana - Development Context

> **File**: `CONTEXT.md`  
> **Purpose**: Complete context for vibe coding sessions  
> **Last Updated**: 2026-08-04

---

## 🎯 MỤC TIÊU DỰ ÁN

**TroMapDana** là ứng dụng web giúp sinh viên tìm nhà trọ tại Đà Nẵng.

### Key Features
- Bản đồ tương tác với markers
- Filter theo giá, diện tích, khoảng cách
- Liên hệ chủ trọ qua Facebook (không tiết lộ SĐT)
- Admin dashboard để quản lý

### Mô hình kinh doanh
- Kiếm tiền từ quảng cáo
- Gói đăng tin VIP cho chủ trọ

---

## 📁 CẤU TRÚC PROJECT

```
D:\TroMap\
├── tromap-dana/           # App chính (public)
│   ├── src/
│   │   ├── app/          # Routes (Next.js App Router)
│   │   │   ├── page.tsx  # Trang chính (map)
│   │   │   ├── layout.tsx # Root layout
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ads/AdBanner.tsx
│   │   │   ├── loading/LoadingScreen.tsx
│   │   │   ├── map/MapView.tsx
│   │   │   ├── map/CustomMarker.tsx
│   │   │   └── ui/FilterPanel.tsx
│   │   ├── lib/
│   │   │   ├── supabase.ts    # Supabase client
│   │   │   ├── geolocation.ts # Geolocation hook
│   │   │   └── utils.ts       # Utilities (maskPhone, formatCurrency)
│   │   └── types/
│   │       └── index.ts       # All TypeScript types
│   └── public/
│
├── tromap-admin/          # Admin Dashboard
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/page.tsx
│   │   │   └── dashboard/
│   │   │       ├── layout.tsx
│   │   │       ├── page.tsx        # Dashboard home
│   │   │       ├── tro/page.tsx    # Nhà trọ CRUD
│   │   │       ├── chutro/page.tsx # Chủ trọ CRUD
│   │   │       └── baocao/page.tsx # Báo cáo & báo giá
│   │   └── lib/
│   │       ├── supabase.ts   # Auth + rate limit
│   │       ├── types.ts      # Admin types
│   │       └── utils.ts      # Bao giá generator
│   └── public/
│
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql  # Full database schema
```

---

## 🗄️ DATABASE (Supabase/PostgreSQL)

### Tables

#### `chu_tro` - Chủ trọ
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| ten | TEXT | Tên chủ trọ |
| sdt | TEXT | **SENSITIVE** - Số điện thoại |
| zalo | TEXT | **SENSITIVE** - Zalo ID |
| email | TEXT | Email |
| facebook_url | TEXT | Link Facebook |
| ngay_tao | TIMESTAMPTZ | Auto timestamp |
| ngay_cap_nhat | TIMESTAMPTZ | Auto update |

#### `nha_tro` - Nhà trọ
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| chu_tro_id | UUID | FK to chu_tro |
| tieu_de | TEXT | Tiêu đề |
| mo_ta | TEXT | Mô tả |
| gia_thang | INTEGER | Giá tháng (VND, max 50tr) |
| dien_tich | INTEGER | Diện tích (m²) |
| dia_chi | TEXT | Địa chỉ |
| lat | DECIMAL(10,7) | Vĩ độ |
| lng | DECIMAL(10,7) | Kinh độ |
| facebook_url | TEXT | Link Facebook |
| trang_thai | TEXT | 'active', 'inactive', 'het_han' |
| luot_xem | INTEGER | Lượt xem |
| ngay_tao | TIMESTAMPTZ | Auto timestamp |
| ngay_cap_nhat | TIMESTAMPTZ | Auto update |

#### `goi_dang` - Gói đăng
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| chu_tro_id | UUID | FK to chu_tro |
| nha_tro_id | UUID | FK to nha_tro |
| so_ngay | INTEGER | Số ngày đăng |
| gia | INTEGER | Giá (VND) |
| ngay_mua | TIMESTAMPTZ | Ngày mua |
| ngay_het_han | TIMESTAMPTZ | Ngày hết hạn |
| trang_thai | TEXT | 'active', 'het_han', 'huy' |

#### `quang_cao` - Quảng cáo
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| vi_tri | TEXT | 'banner', 'sidebar', 'popup' |
| hinh_anh | TEXT | URL hình ảnh |
| link_den | TEXT | Link khi click |
| ngay_bat_dau | DATE | Ngày bắt đầu |
| ngay_ket_thuc | DATE | Ngày kết thúc |
| trang_thai | TEXT | 'active', 'inactive' |

#### `lich_su_xem` - Lịch sử xem
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| nha_tro_id | UUID | FK to nha_tro |
| thoi_gian_xem | TIMESTAMPTZ | Auto timestamp |
| device_info | JSONB | Device info |

#### `dong_y` - Consent tracking
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| chu_tro_id | UUID | FK to chu_tro |
| nha_tro_id | UUID | FK to nha_tro (nullable) |
| loai | TEXT | 'dang_ky', 'go_bo' |
| noi_dung | TEXT | Nội dung đồng ý |
| timestamp | TIMESTAMPTZ | Auto timestamp |
| nguon | TEXT | 'facebook', 'zalo', 'tuc_lai' |

#### `admin_users` - Admin users
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| email | TEXT | Unique email |
| password_hash | TEXT | Bcrypt hash |
| ten | TEXT | Tên admin |
| ngay_tao | TIMESTAMPTZ | Auto timestamp |

### RLS Policies

```sql
-- chu_tro: PUBLIC can SELECT (VULNERABLE - TODO: fix)
CREATE POLICY "Public can view chu_tro limited" ON chu_tro FOR SELECT USING (true);

-- nha_tro: Chỉ active và còn hạn goi_dang
CREATE POLICY "Public can view active nha_tro" ON nha_tro FOR SELECT USING (
  trang_thai = 'active' 
  AND EXISTS (SELECT 1 FROM goi_dang WHERE nha_tro_id = nha_tro.id AND trang_thai = 'active' AND ngay_het_han > NOW())
);

-- Admin: authenticated users can do anything
CREATE POLICY "Admin can do anything" ON chu_tro FOR ALL USING (auth.role() = 'authenticated');
```

---

## 🎨 UI/UX

### Color Palette
```css
--primary: #3B82F6;        /* Blue */
--secondary: #10B981;      /* Green */
--accent: #F59E0B;         /* Amber */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
```

### Đà Nẵng Bounds
```typescript
const DANANG_BOUNDS = {
  north: 16.1813,
  south: 15.9548,
  east: 108.3292,
  west: 108.0780,
};

const DANANG_CENTER = { lat: 16.0544, lng: 108.2022 };
```

### Font
- Sử dụng Next.js default font (Geist)
- Tailwind CSS for styling

---

## 🔧 UTILITIES

### `utils.ts` (tromap-dana)
```typescript
export function maskPhone(phone: string): string {
  // 0912345678 -> 0912***678
  if (phone.length < 9) return phone;
  return phone.slice(0, 4) + '***' + phone.slice(-3);
}

export function formatCurrency(amount: number): string {
  // 1500000 -> "1.500.000 đ"
  return new Intl.NumberFormat('vi-VN').format(amount) + ' đ';
}

export function formatDate(date: string): string {
  // ISO date -> Vietnamese format
  return new Date(date).toLocaleDateString('vi-VN');
}

export function formatNumber(num: number): string {
  // 1234 -> "1.234"
  return new Intl.NumberFormat('vi-VN').format(num);
}

export function formatRelativeTime(date: string): string {
  // "2 giờ trước", "3 ngày trước"
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'Vừa xong';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} phút trước`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} giờ trước`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} ngày trước`;
  return formatDate(date);
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  // Haversine formula - km
}

export function getMapStyles(): React.CSSProperties {
  return {
    height: '100vh',
    width: '100%',
    zIndex: 0,
  };
}
```

### `utils.ts` (tromap-admin) - Bao Giá
```typescript
export function generateEmailTemplate(ten: string, soNgay: number, gia: number): string {
  // Tạo email template
}

export function generateZaloTemplate(soNgay: number, gia: number): string {
  // Tạo Zalo message template
}

export function getGiaCoBan(soNgay: number): number {
  // Tính giá cơ bản
  // 30 ngày = 100k, 90 ngày = 250k, 180 ngày = 400k, 365 ngày = 600k
}
```

---

## 🔐 SECURITY

### Nguyên tắc
1. **SĐT/Zalo KHÔNG được hiển thị public** - Chỉ admin thấy
2. **RLS policies** bảo vệ database
3. **Không lưu ảnh phòng** - Chỉ lưu link Facebook
4. **Consent tracking** - Chủ trọ phải đồng ý trước khi đăng

### ⚠️ VULNERABILITIES (Cần fix)
1. `chu_tro` RLS policy cho phép public SELECT (SENSITIVE DATA EXPOSED)
2. Client-side rate limiting có thể bypass
3. Không có XSS sanitization cho facebook_url
4. Không có server-side rate limiting

---

## 📱 PAGES

### tromap-dana

| Route | File | Description |
|-------|------|-------------|
| `/` | `page.tsx` | Main map page |
| `/about` | ❌ Missing | About page |
| `/contact` | ❌ Missing | Contact page |
| `/privacy` | ❌ Missing | Privacy policy |
| `/terms` | ❌ Missing | Terms of service |

### tromap-admin

| Route | File | Description |
|-------|------|-------------|
| `/login` | `login/page.tsx` | Login page |
| `/dashboard` | `dashboard/page.tsx` | Dashboard home |
| `/dashboard/tro` | `tro/page.tsx` | Nhà trọ management |
| `/dashboard/chutro` | `chutro/page.tsx` | Chủ trọ management |
| `/dashboard/baocao` | `baocao/page.tsx` | Báo cáo & báo giá |
| `/dashboard/quangcao` | ❌ Missing | Quảng cáo management |
| `/dashboard/goi-dang` | ❌ Missing | Gói đăng |
| `/dashboard/users` | ❌ Missing | User management |
| `/dashboard/settings` | ❌ Missing | Settings |

---

## 🛠️ DEVELOPMENT

### Setup
```bash
# tromap-dana
cd tromap-dana
npm install
npm run dev  # http://localhost:3000

# tromap-admin
cd tromap-admin
npm install
npm run dev  # http://localhost:3001
```

### Environment Variables
```env
# tromap-dana/.env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# tromap-admin/.env.local
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Map**: Leaflet + React-Leaflet
- **Database**: Supabase
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts

---

## 📝 VIBE CODING RULES

### Khi tạo page mới
1. Tạo route trong `src/app/`
2. Dùng Tailwind CSS (không inline styles)
3. Import icons từ `lucide-react`
4. Thêm TypeScript types
5. Handle loading/error states

### Khi tạo component mới
1. Đặt trong `src/components/[category]/`
2. Export default component
3. Props interface ở đầu file
4. Dùng `use client` nếu cần interactivity

### Khi làm việc với Supabase
1. Dùng typed queries với `.select()`
2. Handle loading/error states
3. Không fetch sensitive data (SĐT/Zalo) nếu không cần
4. RLS tự động enforce

### Khi làm SEO
1. Thêm metadata vào `layout.tsx`
2. Tạo sitemap.ts nếu có dynamic routes
3. Thêm structured data (JSON-LD)
4. OG image cho social sharing

---

## 🚨 REMEMBER

1. **KHÔNG hardcode credentials** - Luôn dùng env vars
2. **SĐT/Zalo là SENSITIVE** - Không để lộ public
3. **Dùng Tailwind** - Không inline CSS
4. **TypeScript everywhere** - Không dùng `any`
5. **Handle errors** - Luôn có try/catch
6. **Responsive** - Mobile-first approach

---

## 📚 FILES ĐỂ ĐỌC THÊM

- `SPEC.md` - Technical specification đầy đủ
- `TODO.md` - Danh sách tasks chi tiết
- `README.md` - Hướng dẫn setup
- `supabase/migrations/001_initial_schema.sql` - Database schema

---

*Document này cung cấp context để vibe coding. Chi tiết xem trong SPEC.md*
