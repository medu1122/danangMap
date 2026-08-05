# TroMapDana - Technical Specification

> **Document Version**: 1.0  
> **Last Updated**: 2026-08-04  
> **Status**: In Development

---

## 📋 Mục Lục

1. [Tổng Quan Dự Án](#1-tổng-quan-dự-án)
2. [Kiến Trúc Hệ Thống](#2-kiến-trúc-hệ-thống)
3. [Database Schema](#3-database-schema)
4. [Features - App Chính](#4-features---app-chính)
5. [Features - Admin Dashboard](#5-features---admin-dashboard)
6. [Security](#6-security)
7. [SEO Optimization](#7-seo-optimization)
8. [TODO List](#8-todo-list)
9. [Development Workflow](#9-development-workflow)
10. [Deployment](#10-deployment)

---

## 1. Tổng Quan Dự Án

### 1.1 Mô Tả
**TroMapDana** là ứng dụng web giúp sinh viên tìm nhà trọ tại Đà Nẵng. Người dùng có thể xem bản đồ, filter theo giá/diện tích, và liên hệ chủ trọ qua Facebook.

### 1.2 Cấu Trúc Project

```
D:\TroMap\
├── tromap-dana/              # App chính (public users)
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   │   ├── page.tsx     # Trang chính (map)
│   │   │   ├── layout.tsx   # Root layout
│   │   │   ├── sitemap.ts   # [TODO] SEO sitemap
│   │   │   └── robots.ts    # [TODO] SEO robots
│   │   ├── components/
│   │   │   ├── ads/         # Ad banners
│   │   │   ├── loading/     # Loading screen
│   │   │   ├── map/         # Map components
│   │   │   └── ui/          # UI components
│   │   ├── lib/
│   │   │   ├── supabase.ts  # Supabase client
│   │   │   ├── geolocation.ts # Geolocation hook
│   │   │   └── utils.ts     # Utilities
│   │   └── types/
│   │       └── index.ts     # TypeScript interfaces
│   └── public/
│
├── tromap-admin/             # Admin Dashboard
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/       # Login page
│   │   │   └── dashboard/    # Dashboard routes
│   │   │       ├── page.tsx           # Dashboard home
│   │   │       ├── tro/              # Nhà trọ management
│   │   │       ├── chutro/           # Chủ trọ management
│   │   │       ├── baocao/           # Báo cáo & báo giá
│   │   │       ├── quangcao/         # [TODO] Quảng cáo
│   │   │       ├── goi-dang/          # [TODO] Gói đăng
│   │   │       ├── users/             # [TODO] User management
│   │   │       └── settings/          # [TODO] Settings
│   │   ├── lib/
│   │   │   ├── supabase.ts  # Supabase client + rate limit
│   │   │   ├── types.ts     # TypeScript interfaces
│   │   │   └── utils.ts     # Utilities (bao gia)
│   │   └── components/      # Reusable components
│   └── public/
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Database schema
│
├── SPEC.md                   # This file
└── README.md                 # Basic README
```

### 1.3 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14 (App Router) |
| **Styling** | Tailwind CSS |
| **Map** | Leaflet + React-Leaflet |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth |
| **Icons** | Lucide React |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Deployment** | Vercel |

### 1.4 Phạm Vi

**✅ Đã làm:**
- Map với markers
- Filter theo giá, diện tích, khoảng cách
- Geolocation + bounds check Đà Nẵng
- CRUD nhà trọ & chủ trọ
- Báo giá tự động
- Bảo mật SĐT/Zalo (client-side masking)

**❌ Cần làm (xem TODO Section):**
- SEO optimization
- Security hardening
- Contact/About pages
- LLM chatbot
- Ad management
- V.v...

---

## 2. Kiến Trúc Hệ Thống

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Users                                │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Vercel Edge                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ tromap-dana │  │ tromap-admin│  │ Rate Limiting       │  │
│  │ (Next.js)   │  │ (Next.js)   │  │ Security Headers    │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────────┘  │
└─────────┼────────────────┼────────────────────────────────┘
          │                │
          ▼                ▼
┌─────────────────┐  ┌───────────────────────────────────────┐
│   Supabase      │  │              Supabase                  │
│ ┌─────────────┐ │  │  ┌─────────────────────────────────┐  │
│ │ PostgreSQL  │ │  │  │         RLS Policies            │  │
│ │ - nha_tro   │ │  │  │  - Public: SELECT active only   │  │
│ │ - chu_tro   │ │  │  │  - Admin: Full access          │  │
│ │ - goi_dang  │ │  │  │  - Sensitive: SĐT/Zalo masked  │  │
│ │ - quang_cao │ │  │  └─────────────────────────────────┘  │
│ └─────────────┘ │  │                                        │
└─────────────────┘  └───────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
│  ┌───────────┐  ┌───────────┐  ┌────────────┐              │
│  │ Leaflet   │  │ Facebook  │  │ [TODO] LLM │              │
│  │ Maps API  │  │ Links     │  │ (Ollama)   │              │
│  └───────────┘  └───────────┘  └────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Data Flow

**Public User (View Listings):**
```
User → tromap-dana → Supabase (SELECT active nha_tro) → Filter locally → Display on Map
```

**Admin (Manage Listings):**
```
Admin → tromap-admin → Supabase Auth → RLS (authenticated) → Full CRUD
```

### 2.3 Environment Variables

**tromap-dana/.env.local:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**tromap-admin/.env.local:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPabase_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 3. Database Schema

### 3.1 Tables

#### `nha_tro` - Nhà trọ
```sql
CREATE TABLE nha_tro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chu_tro_id UUID NOT NULL REFERENCES chu_tro(id),
  tieu_de VARCHAR(255) NOT NULL,
  mo_ta TEXT,
  gia_thang INTEGER CHECK (gia_thang >= 0 AND gia_thang <= 50000000),
  dien_tich INTEGER CHECK (dien_tich >= 0 AND dien_tich <= 1000),
  dia_chi TEXT NOT NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  facebook_url TEXT,
  trang_thai VARCHAR(20) DEFAULT 'active' CHECK (trang_thai IN ('active', 'inactive', 'het_han')),
  luot_xem INTEGER DEFAULT 0,
  ngay_tao TIMESTAMPTZ DEFAULT NOW(),
  ngay_cap_nhat TIMESTAMPTZ DEFAULT NOW()
);
```

#### `chu_tro` - Chủ trọ
```sql
CREATE TABLE chu_tro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ten VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  sdt VARCHAR(20),           -- SENSITIVE - masked by default
  zalo VARCHAR(100),        -- SENSITIVE - masked by default
  facebook_url TEXT,
  ngay_tao TIMESTAMPTZ DEFAULT NOW(),
  ngay_cap_nhat TIMESTAMPTZ DEFAULT NOW()
);
```

#### `goi_dang` - Gói đăng
```sql
CREATE TABLE goi_dang (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nha_tro_id UUID NOT NULL REFERENCES nha_tro(id),
  loai_goi VARCHAR(50) NOT NULL,  -- 'vip', 'thuong', 'flash'
  ngay_bat_dau TIMESTAMPTZ DEFAULT NOW(),
  ngay_het_han TIMESTAMPTZ NOT NULL,
  gia_tri NUMBER DEFAULT 0,
  ngay_tao TIMESTAMPTZ DEFAULT NOW()
);
```

#### `quang_cao` - Quảng cáo
```sql
CREATE TABLE quang_cao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ten_nguoi_dang VARCHAR(255) NOT NULL,
  tieu_de VARCHAR(255) NOT NULL,
  noi_dung TEXT,
  hinh_anh TEXT,             -- URL to image
  lien_ket TEXT,             -- Link when clicked
  vi_tri VARCHAR(50) NOT NULL, -- 'banner_top', 'banner_bottom', 'sidebar'
  trang_thai VARCHAR(20) DEFAULT 'active',
  ngay_bat_dau TIMESTAMPTZ,
  ngay_ket_thuc TIMESTAMPTZ,
  luot_xem INTEGER DEFAULT 0,
  luot_click INTEGER DEFAULT 0,
  ngay_tao TIMESTAMPTZ DEFAULT NOW()
);
```

#### `lich_su_xem` - Lịch sử xem
```sql
CREATE TABLE lich_su_xem (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nha_tro_id UUID REFERENCES nha_tro(id),
  ip_address VARCHAR(45),
  user_agent TEXT,
  ngay_xem TIMESTAMPTZ DEFAULT NOW()
);
```

#### `dong_y` - Consent tracking
```sql
CREATE TABLE dong_y (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chu_tro_id UUID NOT NULL REFERENCES chu_tro(id),
  da_dong_y BOOLEAN DEFAULT false,
  ngay_dong_y TIMESTAMPTZ,
  ip_address VARCHAR(45),
  ngay_tao TIMESTAMPTZ DEFAULT NOW()
);
```

#### `admin_users` - Admin accounts
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  ten VARCHAR(255),
  vai_tro VARCHAR(50) DEFAULT 'admin',  -- 'admin', 'super_admin'
  trang_thai VARCHAR(20) DEFAULT 'active',
  lan_dang_nhap_cuoi TIMESTAMPTZ,
  ngay_tao TIMESTAMPTZ DEFAULT NOW()
);
```

### 3.2 RLS Policies

```sql
-- Enable RLS on all tables
ALTER TABLE nha_tro ENABLE ROW LEVEL SECURITY;
ALTER TABLE chu_tro ENABLE ROW LEVEL SECURITY;
ALTER TABLE goi_dang ENABLE ROW LEVEL SECURITY;
ALTER TABLE quang_cao ENABLE ROW LEVEL SECURITY;

-- nha_tro: Public can view active only
CREATE POLICY "Public can view active nha_tro" ON nha_tro
  FOR SELECT USING (trang_thai = 'active');

-- chu_tro: [TODO] Should be admin-only (CURRENTLY VULNERABLE)
CREATE POLICY "Public can view chu_tro limited" ON chu_tro
  FOR SELECT USING (true);

-- goi_dang: Authenticated users
CREATE POLICY "Auth users can view goi_dang" ON goi_dang
  FOR SELECT USING (auth.role() = 'authenticated');

-- quang_cao: Public can view active
CREATE POLICY "Public can view active quang_cao" ON quang_cao
  FOR SELECT USING (trang_thai = 'active');
```

### 3.3 Indexes

```sql
CREATE INDEX idx_nha_tro_chu_tro ON nha_tro(chu_tro_id);
CREATE INDEX idx_nha_tro_trang_thai ON nha_tro(trang_thai);
CREATE INDEX idx_nha_tro_gia_thang ON nha_tro(gia_thang);
CREATE INDEX idx_nha_tro_location ON nha_tro(lat, lng);

CREATE INDEX idx_goi_dang_nha_tro ON goi_dang(nha_tro_id);
CREATE INDEX idx_goi_dang_het_han ON goi_dang(ngay_het_han);

CREATE INDEX idx_lich_su_xem_nha_tro ON lich_su_xem(nha_tro_id);
CREATE INDEX idx_lich_su_xem_ngay ON lich_su_xem(ngay_xem);

CREATE INDEX idx_dong_y_chu_tro ON dong_y(chu_tro_id);
```

### 3.4 Functions

```sql
-- Auto increment view count
CREATE OR REPLACE FUNCTION increment_luot_xem(nha_tro_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE nha_tro 
  SET luot_xem = luot_xem + 1 
  WHERE id = nha_tro_id;
END;
$$ LANGUAGE plpgsql;

-- Auto update ngay_cap_nhat trigger
CREATE OR REPLACE FUNCTION update_ngay_cap_nhat()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ngay_cap_nhat = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_nha_tro_update
  BEFORE UPDATE ON nha_tro
  FOR EACH ROW EXECUTE FUNCTION update_ngay_cap_nhat();
```

---

## 4. Features - App Chính

### 4.1 Current Features

| Feature | Status | Implementation |
|---------|--------|----------------|
| Leaflet Map | ✅ Done | `components/map/MapView.tsx` |
| Custom Markers | ✅ Done | `components/map/CustomMarker.tsx` |
| Price Filter | ✅ Done | `components/ui/FilterPanel.tsx` |
| Area Filter | ✅ Done | `components/ui/FilterPanel.tsx` |
| Distance Sort | ✅ Done | `components/ui/FilterPanel.tsx` |
| Geolocation | ✅ Done | `lib/geolocation.ts` |
| Bounds Check | ✅ Done | Warns if outside Đà Nẵng |
| Loading Screen | ✅ Done | `components/loading/LoadingScreen.tsx` |
| Mobile Responsive | ✅ Done | Tailwind breakpoints |
| Ad Banner Placeholder | ✅ Done | `components/ads/AdBanner.tsx` |

### 4.2 Map Configuration

```typescript
// Danang Bounds
const DANANG_BOUNDS = {
  north: 16.15,  // Vĩ độ Bắc
  south: 15.95,  // Vĩ độ Nam
  east: 108.35,  // Kinh độ Đông
  west: 108.05   // Kinh độ Tây
};

// Default Map Center
const DEFAULT_CENTER: [number, number] = [16.0544, 108.2022]; // Đà Nẵng center
const DEFAULT_ZOOM = 14;
```

### 4.3 [TODO] Features to Implement

#### Priority 1: Core User Experience
| Feature | File | Description |
|---------|------|-------------|
| Detail Modal | `components/modal/DetailModal.tsx` | Full listing details when clicking marker |
| Search Box | `components/search/SearchBox.tsx` | Search by address/name |
| Marker Clustering | `components/map/MapView.tsx` | Group nearby markers |

#### Priority 2: User Engagement
| Feature | File | Description |
|---------|------|-------------|
| Favorites | `lib/favorites.ts` | Save to localStorage |
| View History | `lib/history.ts` | Recently viewed list |
| Share Feature | `components/ui/ShareButton.tsx` | Web Share API |

#### Priority 3: Advanced Features
| Feature | File | Description |
|---------|------|-------------|
| LLM Chatbot | `components/chat/TroChatbot.tsx` | AI assistant for recommendations |
| Dark Mode | `components/ui/ThemeToggle.tsx` | Theme switcher |

### 4.4 Component Structure

```
tromap-dana/src/components/
├── ads/
│   └── AdBanner.tsx          # Ad display component
├── loading/
│   └── LoadingScreen.tsx     # Animated loading
├── map/
│   ├── MapView.tsx           # Main map component
│   ├── CustomMarker.tsx      # Custom marker styling
│   └── [TODO] MarkerPopup.tsx
├── modal/                    # [TODO]
│   └── DetailModal.tsx       # Listing detail modal
├── search/                   # [TODO]
│   └── SearchBox.tsx         # Search component
└── ui/
    ├── FilterPanel.tsx       # Filter controls
    └── [TODO] ShareButton.tsx
```

---

## 5. Features - Admin Dashboard

### 5.1 Current Features

| Feature | Route | Status |
|---------|-------|--------|
| Login | `/login` | ✅ Done |
| Dashboard | `/dashboard` | ✅ Done |
| Nhà Trọ CRUD | `/dashboard/tro` | ✅ Done |
| Chủ Trọ CRUD | `/dashboard/chutro` | ✅ Done |
| Báo Cáo | `/dashboard/baocao` | ✅ Done |
| Stats Cards | Dashboard | ✅ Done |
| Views Chart | Dashboard | ✅ Done |

### 5.2 [TODO] Admin Features

| Feature | Route | Priority |
|---------|-------|----------|
| Quảng Cáo CRUD | `/dashboard/quangcao` | P1 |
| Gói Đăng View | `/dashboard/goi-dang` | P1 |
| User Management | `/dashboard/users` | P2 |
| Settings | `/dashboard/settings` | P2 |
| Pagination | All tables | P2 |
| Column Sorting | All tables | P3 |
| Bulk Actions | All tables | P3 |
| PDF Export | Reports | P3 |

### 5.3 Báo Giá Feature

**Current Implementation:**
- Select chủ trọ
- Slider 1-365 ngày
- Generate email template
- Generate Zalo message template
- Copy to clipboard

**Template Format:**
```typescript
// Email Template
const emailTemplate = (ten: string, soNgay: number, gia: number) => `
Kính gửi ${ten},

Cảm ơn Quý khách đã quan tâm đến dịch vụ đăng tin trên TroMapDana.

THÔNG TIN BÁO GIÁ:
- Thời gian: ${soNgay} ngày
- Chi phí: ${formatCurrency(gia)}

[Bank transfer info]

Trân trọng,
TroMapDana
`;

// Zalo Template
const zaloTemplate = (soNgay: number, gia: number) => `
🏠 TROMAPDANA - BÁO GIÁ

📅 Thời gian: ${soNgay} ngày
💰 Chi phí: ${formatCurrency(gia)}

Liên hệ đăng tin ngay!`;
```

---

## 6. Security

### 6.1 Current Security Measures

| Measure | Status | Location |
|---------|--------|----------|
| RLS Enabled | ✅ Done | Database |
| SĐT Masking | ✅ Done | Client-side |
| Auth Required | ✅ Done | Admin |
| Password Hashing | ✅ Done | Admin login |
| Env Variables | ✅ Done | Both apps |
| No Sensitive in URL | ✅ Done | Best practice |

### 6.2 [TODO] Security Hardening

#### Priority 1: Critical
| Issue | Fix | File |
|-------|-----|------|
| RLS `chu_tro` open | Remove public SELECT policy | `supabase/migrations/` |
| Client-side rate limit | Server-side middleware | `tromap-admin/middleware.ts` |
| XSS via Facebook URL | DOMPurify sanitization | All render FB URL |
| No input validation | Zod schema validation | All forms |

#### Priority 2: High
| Issue | Fix | File |
|-------|-----|------|
| DDoS protection | Vercel rate limiting | `middleware.ts` |
| Security headers | CSP, X-Frame-Options | `middleware.ts` |
| CSRF tokens | Next.js CSRF | Forms |
| Bot protection | CAPTCHA | Login page |

#### Priority 3: Medium
| Issue | Fix | File |
|-------|-----|------|
| Audit logging | `admin_actions` table | Database |
| Session timeout | Config refresh | `supabase.ts` |
| IP-based rate limit | Supabase Edge | Edge function |

### 6.3 Security Headers (To Implement)

```typescript
// middleware.ts
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};
```

### 6.4 Input Validation Schemas (Zod)

```typescript
// schemas.ts
import { z } from 'zod';

export const nhaTroSchema = z.object({
  tieu_de: z.string().min(5).max(255),
  mo_ta: z.string().max(2000).optional(),
  gia_thang: z.number().min(0).max(50000000),
  dien_tich: z.number().min(0).max(1000),
  dia_chi: z.string().min(5).max(500),
  lat: z.number().min(15.95).max(16.15),
  lng: z.number().min(108.05).max(108.35),
  facebook_url: z.string().url().optional().or(z.literal('')),
});

export const chuTroSchema = z.object({
  ten: z.string().min(2).max(255),
  email: z.string().email().optional().or(z.literal('')),
  sdt: z.string().regex(/^[0-9]{9,11}$/).optional(),
  zalo: z.string().max(100).optional(),
  facebook_url: z.string().url().optional().or(z.literal('')),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

---

## 7. SEO Optimization

### 7.1 [TODO] SEO Checklist

| Item | Priority | File |
|------|----------|------|
| `sitemap.xml` | P1 | `app/sitemap.ts` |
| `robots.txt` | P1 | `app/robots.ts` |
| JSON-LD LocalBusiness | P1 | `app/page.tsx` |
| JSON-LD WebSite | P1 | `app/page.tsx` |
| OG Image | P1 | `app/opengraph-image.tsx` |
| Twitter Cards | P2 | `app/page.tsx` |
| Geo meta tags | P2 | `app/layout.tsx` |
| Canonical URLs | P2 | `app/layout.tsx` |
| hreflang | P3 | `app/layout.tsx` |

### 7.2 Sitemap Structure

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tromapdana.com';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // [TODO] Add dynamic routes when created
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
```

### 7.3 JSON-LD Schema

```typescript
// In app/page.tsx
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'TroMapDana - Bản Đồ Nhà Trọ Đà Nẵng',
  description: 'Hỗ trợ sinh viên tìm nhà trọ nhanh chóng tại Đà Nẵng',
  url: 'https://tromapdana.com',
  telephone: '', // Admin contact
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Đà Nẵng',
    addressCountry: 'VN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 16.0544,
    longitude: 108.2022,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
};
```

### 7.4 Page Metadata

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'TroMapDana - Bản Đồ Nhà Trọ Đà Nẵng',
    template: '%s | TroMapDana',
  },
  description: 'Tìm nhà trọ Đà Nẵng nhanh chóng. Hỗ trợ sinh viên với bản đồ trực quan, filter theo giá và diện tích.',
  keywords: ['nhà trọ Đà Nẵng', 'tìm trọ Đà Nẵng', 'trọ sinh viên Đà Nẵng', 'thuê nhà Đà Nẵng'],
  authors: [{ name: 'TroMapDana' }],
  creator: 'TroMapDana',
  metadataBase: new URL('https://tromapdana.com'),
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://tromapdana.com',
    siteName: 'TroMapDana',
    title: 'TroMapDana - Bản Đồ Nhà Trọ Đà Nẵng',
    description: 'Tìm nhà trọ Đà Nẵng nhanh chóng',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TroMapDana',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TroMapDana - Bản Đồ Nhà Trọ Đà Nẵng',
    description: 'Tìm nhà trọ Đà Nẵng nhanh chóng',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  geo: {
    placename: 'Da Nang, Vietnam',
    position: '16.0544;108.2022',
    region: 'VN',
  },
};
```

---

## 8. TODO List

### Phase 1: SEO & Security (Week 1)

#### 8.1 SEO Implementation
- [ ] Create `app/sitemap.ts`
- [ ] Create `app/robots.ts`
- [ ] Add JSON-LD LocalBusiness schema
- [ ] Add JSON-LD WebSite schema
- [ ] Create OG image (`app/opengraph-image.tsx`)
- [ ] Add Twitter card meta tags
- [ ] Add geo meta tags
- [ ] Add canonical URLs

#### 8.2 Security Hardening
- [ ] Fix RLS on `chu_tro` table (remove public SELECT)
- [ ] Implement server-side rate limiting middleware
- [ ] Add XSS sanitization (DOMPurify)
- [ ] Add security headers middleware
- [ ] Add Zod validation to all forms
- [ ] Add CAPTCHA to login

### Phase 2: Business Pages (Week 2)

#### 8.3 Contact & About Pages
- [ ] Create `app/contact/page.tsx`
  - Contact form (name, email, message, phone)
  - Admin contact info (Zalo, Facebook)
  - Ad inquiry section
- [ ] Create `app/about/page.tsx`
  - About TroMapDana
  - How it works
  - Terms of service
  - Privacy policy
- [ ] Create `app/privacy/page.tsx`
- [ ] Create `app/terms/page.tsx`

#### 8.4 Ad Management (Admin)
- [ ] Create `/dashboard/quangcao/page.tsx`
  - List all ads
  - Add new ad form
  - Edit ad
  - Delete ad
  - Toggle active/inactive
  - Upload image (file upload)

### Phase 3: User Experience (Week 3)

#### 8.5 Main App Improvements
- [ ] Create `DetailModal.tsx`
  - Full listing info
  - Photo gallery (if added)
  - Contact buttons (Facebook)
  - Share button
- [ ] Create `SearchBox.tsx`
  - Address autocomplete
  - Search by name
- [ ] Add marker clustering
- [ ] Add favorites (localStorage)
- [ ] Add view history (localStorage)
- [ ] Add share feature (Web Share API)

### Phase 4: LLM Features (Week 4)

#### 8.6 LLM Chatbot
- [ ] Setup Ollama or external LLM API
- [ ] Create chat interface
- [ ] Implement recommendation logic
- [ ] Add conversation history
- [ ] Add quick suggestions

### Phase 5: Polish (Week 5)

#### 8.7 UI/UX
- [ ] Add dark mode toggle
- [ ] Add skeleton loading
- [ ] Add toast notifications
- [ ] Add PWA support (manifest, service worker)

#### 8.8 Admin Improvements
- [ ] Add pagination to all tables
- [ ] Add column sorting
- [ ] Add bulk actions
- [ ] Add PDF export for reports
- [ ] Create `/dashboard/goi-dang/page.tsx`
- [ ] Create `/dashboard/users/page.tsx`
- [ ] Create `/dashboard/settings/page.tsx`

### Phase 6: Infrastructure (Week 6+)

#### 8.9 DevOps
- [ ] Setup GitHub Actions CI/CD
- [ ] Add Playwright tests
- [ ] Add unit tests (Jest)
- [ ] Create shared types package

#### 8.10 Database
- [ ] Enable pg_cron for auto-expiry
- [ ] Add `admin_actions` audit table
- [ ] Add soft delete (`deleted_at` column)

---

## 9. Development Workflow

### 9.1 Setup Commands

```bash
# Clone repository
git clone <repo-url>
cd TroMap

# Install dependencies
cd tromap-dana && npm install
cd ../tromap-admin && npm install

# Copy env files
cd tromap-dana
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

cd ../tromap-admin
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Setup database
# Go to Supabase Dashboard > SQL Editor
# Run supabase/migrations/001_initial_schema.sql

# Run migrations (if using Supabase CLI)
supabase db reset
```

### 9.2 Development Commands

```bash
# Start main app
cd tromap-dana
npm run dev
# Opens http://localhost:3000

# Start admin app (separate terminal)
cd tromap-admin
npm run dev
# Opens http://localhost:3001
```

### 9.3 Deployment

```bash
# Deploy to Vercel (Main App)
cd tromap-dana
vercel --prod

# Deploy to Vercel (Admin)
cd tromap-admin
vercel --prod
```

### 9.4 Environment Variables (Production)

**Vercel Dashboard > Settings > Environment Variables:**

| Variable | tromap-dana | tromap-admin |
|----------|-------------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ | ✅ |

---

## 10. Deployment

### 10.1 Vercel Setup

1. Create Vercel account at [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Configure build settings:

**tromap-dana:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

**tromap-admin:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

### 10.2 Domain Configuration

- Main app: `tromapdana.com`
- Admin: `admin.tromapdana.com` (or subdomain)

### 10.3 SSL

Vercel provides free SSL automatically. Ensure:
- HTTPS forced redirect
- Valid SSL certificate

### 10.4 Monitoring

**Vercel Analytics:**
- Enable Vercel Analytics for both apps
- Track page views, performance, Core Web Vitals

**Supabase Dashboard:**
- Monitor database usage
- Check RLS policy violations
- View API usage

---

## Appendix A: Type Definitions

```typescript
// tromap-dana/src/types/index.ts

export interface NhaTro {
  id: string;
  chu_tro_id: string;
  tieu_de: string;
  mo_ta: string | null;
  gia_thang: number;
  dien_tich: number;
  dia_chi: string;
  lat: number;
  lng: number;
  facebook_url: string | null;
  trang_thai: 'active' | 'inactive' | 'het_han';
  luot_xem: number;
  ngay_tao: string;
  ngay_cap_nhat: string;
  // Joined from chu_tro (admin only)
  chu_tro?: ChuTro;
}

export interface ChuTro {
  id: string;
  ten: string;
  email: string | null;
  sdt: string | null;       // SENSITIVE
  zalo: string | null;      // SENSITIVE
  facebook_url: string | null;
  ngay_tao: string;
  ngay_cap_nhat: string;
}

export interface GoiDang {
  id: string;
  nha_tro_id: string;
  loai_goi: 'vip' | 'thuong' | 'flash';
  ngay_bat_dau: string;
  ngay_het_han: string;
  gia_tri: number;
  ngay_tao: string;
}

export interface QuangCao {
  id: string;
  ten_nguoi_dang: string;
  tieu_de: string;
  noi_dung: string | null;
  hinh_anh: string | null;
  lien_ket: string | null;
  vi_tri: 'banner_top' | 'banner_bottom' | 'sidebar';
  trang_thai: 'active' | 'inactive';
  ngay_bat_dau: string | null;
  ngay_ket_thuc: string | null;
  luot_xem: number;
  luot_click: number;
  ngay_tao: string;
}

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  minArea: number;
  maxArea: number;
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'distance';
  withinDistance: number; // km
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
```

## Appendix B: Color Palette

```css
/* tromap-dana/src/app/globals.css */

:root {
  /* Primary Colors */
  --primary: #3B82F6;        /* Blue */
  --primary-dark: #2563EB;
  --primary-light: #60A5FA;
  
  /* Secondary Colors */
  --secondary: #10B981;       /* Green */
  --secondary-dark: #059669;
  
  /* Accent */
  --accent: #F59E0B;          /* Amber */
  --accent-dark: #D97706;
  
  /* Neutrals */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
  
  /* Semantic */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
}

/* Dark Mode */
.dark {
  --background: #111827;
  --foreground: #F9FAFB;
}
```

## Appendix C: API Reference (Supabase)

### Public Queries

```typescript
// Get active listings with bounds
const { data, error } = await supabase
  .from('nha_tro')
  .select(`
    id, tieu_de, gia_thang, dien_tich, dia_chi, lat, lng, 
    facebook_url, trang_thai, luot_xem
  `)
  .eq('trang_thai', 'active')
  .gte('lat', bounds.south)
  .lte('lat', bounds.north)
  .gte('lng', bounds.west)
  .lte('lng', bounds.east)
  .gte('gia_thang', minPrice)
  .lte('gia_thang', maxPrice);

// Get active ads
const { data: ads } = await supabase
  .from('quang_cao')
  .select('*')
  .eq('trang_thai', 'active')
  .or(`ngay_ket_thuc.is.null,ngay_ket_thuc.gte.${new Date().toISOString()}`);
```

### Admin Queries (Service Role)

```typescript
// Get all data including sensitive
const { data } = await adminClient
  .from('chu_tro')
  .select('*')
  .order('ngay_tao', { ascending: false });

// Create listing
const { data, error } = await adminClient
  .from('nha_tro')
  .insert({
    chu_tro_id: chuTroId,
    tieu_de: title,
    gia_thang: price,
    // ...
  })
  .select()
  .single();

// Increment view count
await adminClient.rpc('increment_luot_xem', { nha_tro_id });
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-08-04 | Initial spec creation |

---

*Document maintained by: TroMapDana Development Team*
