# TroMapDana - TODO List

> **Document Version**: 1.0  
> **Last Updated**: 2026-08-05  
> **Priority**: P1 = Critical, P2 = High, P3 = Medium, P4 = Low

---

## Tổng Quan

| Category | ✅ Done | ❌ Todo | Progress |
|----------|--------|---------|----------|
| Security | 12 | 4 | 75% |
| SEO | 8 | 2 | 80% |
| Business Pages | 4 | 0 | 100% |
| Main App Features | 19 | 0 | 100% |
| Admin Features | 26 | 3 | 90% |
| UI/UX | 11 | 0 | 100% |
| Infrastructure | 0 | 3 | 0% |
| LLM Features | 4 | 1 | 80% |
| **Total** | **87** | **15** | **85%** |

---

## 🔴 PHASE 1: Security & SEO (Week 1)

### 1.1 Security Hardening

#### P1 - Critical Security Fixes

| # | Task | File | Description | Status |
|---|------|------|-------------|--------|
| S1 | Fix RLS `chu_tro` | `supabase/migrations/002_fix_rls_chu_tro.sql` | Remove public SELECT, admin-only access | ✅ Done |
| S2 | Server-side rate limiting | `tromap-admin/middleware.ts` | Real IP-based rate limit | 🟡 Pending |
| S3 | XSS sanitization | `tromap-dana/src/lib/sanitize.ts` | Sanitize facebook_url with DOMPurify | ✅ Done |
| S4 | Security headers | `tromap-dana/src/middleware.ts` | CSP, X-Frame-Options, etc. | ✅ Done |

#### P1 - Input Validation (Zod)

| # | Task | File | Description | Status |
|---|------|------|-------------|--------|
| S5 | Zod schemas | `tromap-admin/src/lib/schemas.ts` | Validation for all forms | ❌ |
| S6 | Validate Nhà Trọ form | `tromap-admin/src/app/dashboard/tro/page.tsx` | Add Zod validation | ❌ |
| S7 | Validate Chủ Trọ form | `tromap-admin/src/app/dashboard/chutro/page.tsx` | Add Zod validation | ❌ |

#### P2 - Additional Security

| # | Task | File | Description | Status |
|---|------|------|-------------|--------|
| S8 | CAPTCHA on login | `tromap-admin/src/app/login/page.tsx` | Add CAPTCHA (hCaptcha/reCAPTCHA) | ❌ |
| S9 | CSRF tokens | `tromap-admin/src/app/dashboard/*/page.tsx` | Add CSRF protection | ❌ |
| S10 | Audit logging | `supabase/migrations/` | Track admin actions | ❌ |

### 1.2 SEO Optimization

#### P1 - Critical SEO

| # | Task | File | Description | Status |
|---|------|------|-------------|--------|
| SEO1 | Sitemap | `tromap-dana/src/app/sitemap.ts` | Auto-generate sitemap.xml | ✅ Done |
| SEO2 | Robots.txt | `tromap-dana/src/app/robots.ts` | Crawler directives | ✅ Done |
| SEO3 | JSON-LD LocalBusiness | `tromap-dana/src/app/page.tsx` | Structured data for SEO | ✅ Done |
| SEO4 | OG Image | `tromap-dana/src/app/opengraph-image.tsx` | Social sharing image (1200x630) | ✅ Done |

#### P2 - Additional SEO

| # | Task | File | Description | Status |
|---|------|------|-------------|--------|
| SEO5 | Twitter Cards | `tromap-dana/src/app/layout.tsx` | Twitter meta tags | ✅ Done |
| SEO6 | Geo meta tags | `tromap-dana/src/app/layout.tsx` | geo.region, geo.placename | ✅ Done |
| SEO7 | Canonical URLs | `tromap-dana/src/app/layout.tsx` | Prevent duplicate content | ✅ Done |
| SEO8 | hreflang | `tromap-dana/src/app/layout.tsx` | Language alternates (vi-VN) | ✅ Done |

---

## 🟠 PHASE 2: Business Pages (Week 2)

### 2.1 Contact Page (`/contact`)

**Route:** `tromap-dana/src/app/contact/page.tsx`

| # | Task | Description | Status |
|---|------|-------------|--------|
| C1 | Page layout | Contact page structure | ❌ |
| C2 | Contact form | Name, email, phone, message | ❌ |
| C3 | Admin contact info | Zalo, Facebook display | ❌ |
| C4 | Ad inquiry section | "Đặt quảng cáo" section | ❌ |
| C5 | Submit handler | Send to Supabase or email | ❌ |
| C6 | Success/error states | Form feedback | ❌ |

**Contact Form Schema:**
```typescript
interface ContactForm {
  ho_ten: string;        // Required, min 2 chars
  email: string;         // Required, valid email
  so_dt: string;         // Optional, phone format
  loai: 'tu_van' | 'quang_cao' | 'bao_cao' | 'khac';
  noi_dung: string;      // Required, min 10 chars
}
```

### 2.2 About Page (`/about`)

**Route:** `tromap-dana/src/app/about/page.tsx`

| # | Task | Description | Status |
|---|------|-------------|--------|
| A1 | Page layout | About page structure | ❌ |
| A2 | Introduction | What is TroMapDana | ❌ |
| A3 | How it works | Step-by-step guide | ❌ |
| A4 | Contact link | Link to /contact | ❌ |
| A5 | FAQ section | Common questions | ❌ |

### 2.3 Privacy Policy (`/privacy`)

**Route:** `tromap-dana/src/app/privacy/page.tsx`

| # | Task | Description | Status |
|---|------|-------------|--------|
| P1 | Page layout | Privacy policy structure | ❌ |
| P2 | Data collection | What data we collect | ❌ |
| P3 | Data usage | How we use data | ❌ |
| P4 | Data protection | Security measures | ❌ |
| P5 | User rights | User rights section | ❌ |
| P6 | Contact info | DPO contact | ❌ |

### 2.4 Terms of Service (`/terms`)

**Route:** `tromap-dana/src/app/terms/page.tsx`

| # | Task | Description | Status |
|---|------|-------------|--------|
| T1 | Page layout | Terms page structure | ❌ |
| T2 | Acceptance | Terms acceptance | ❌ |
| T3 | User obligations | What users can/cannot do | ❌ |
| T4 | Content policy | Listing content rules | ❌ |
| T5 | Liability | Limitation of liability | ❌ |
| T6 | Changes | Terms modification | ❌ |

---

## 🟡 PHASE 3: Ad Management (Week 2)

### 3.1 Admin Ad Management

**Route:** `tromap-admin/src/app/dashboard/quangcao/page.tsx`

| # | Task | Description | Status |
|---|------|-------------|--------|
| AD1 | Ad list table | Display all ads | ❌ |
| AD2 | Add ad form | Create new ad | ❌ |
| AD3 | Edit ad | Modify existing ad | ❌ |
| AD4 | Delete ad | Remove ad | ❌ |
| AD5 | Toggle status | Active/inactive | ❌ |
| AD6 | Image upload | Upload banner images | ❌ |
| AD7 | Stats display | Views, clicks | ❌ |
| AD8 | Schedule ads | Set start/end date | ❌ |

**Ad Form Schema:**
```typescript
interface QuangCaoForm {
  ten_nguoi_dang: string;
  tieu_de: string;
  noi_dung?: string;
  hinh_anh?: File;
  lien_ket?: string;
  vi_tri: 'banner' | 'sidebar' | 'popup';
  ngay_bat_dau?: Date;
  ngay_ket_thuc?: Date;
  trang_thai: 'active' | 'inactive';
}
```

### 3.2 Ad Display (Main App)

**Files:** `tromap-dana/src/components/ads/AdBanner.tsx`

| # | Task | Description | Status |
|---|------|-------------|--------|
| ADD1 | Fetch from Supabase | Load active ads | ❌ |
| ADD2 | Banner position | Top banner display | ❌ |
| ADD3 | Sidebar position | Sidebar ads | ❌ |
| ADD4 | Click tracking | Track ad clicks | ❌ |
| ADD5 | View tracking | Track ad views | ❌ |

---

## 🟢 PHASE 4: User Experience (Week 3)

### 4.1 Detail Modal

**File:** `tromap-dana/src/components/modal/DetailModal.tsx`

| # | Task | Description | Status |
|---|------|-------------|--------|
| D1 | Modal component | Full-screen/modal view | ❌ |
| D2 | Display details | All listing info | ❌ |
| D3 | Facebook button | Open Facebook link | ❌ |
| D4 | Share button | Web Share API | ❌ |
| D5 | Report button | Report listing | ❌ |
| D6 | Close behavior | ESC, click outside | ❌ |

### 4.2 Search Feature

**File:** `tromap-dana/src/components/search/SearchBox.tsx`

| # | Task | Description | Status |
|---|------|-------------|--------|
| S1 | Search input | Text input field | ❌ |
| S2 | Autocomplete | Address suggestions | ❌ |
| S3 | Search by name | Search listing titles | ❌ |
| S4 | Search by area | Search by district | ❌ |
| S5 | Clear button | Reset search | ❌ |

### 4.3 Marker Improvements

| # | Task | File | Description | Status |
|---|------|------|-------------|--------|
| M1 | Marker clustering | `MapView.tsx` | Group nearby markers | ❌ |
| M2 | Custom popup | `MarkerPopup.tsx` | Better popup component | ❌ |
| M3 | Price label | `CustomMarker.tsx` | Show price on marker | ❌ |

### 4.4 User Features

| # | Task | File | Description | Status |
|---|------|------|-------------|--------|
| F1 | Favorites | `lib/favorites.ts` | Save to localStorage | ❌ |
| F2 | View history | `lib/history.ts` | Recently viewed | ❌ |
| F3 | Share feature | `ShareButton.tsx` | Web Share API | ❌ |
| F4 | Compare rooms | `CompareModal.tsx` | Compare 2-3 listings | ❌ |

---

## 🔵 PHASE 5: LLM Features (Week 4)

### 5.1 LLM Chatbot

**Files:** `tromap-dana/src/components/chat/TroChatbot.tsx`

| # | Task | Description | Status |
|---|------|-------------|--------|
| L1 | Chat UI | Chat interface | ❌ |
| L2 | LLM integration | Connect to Ollama/API | ❌ |
| L3 | Recommendation logic | Suggest listings | ❌ |
| L4 | Conversation history | Store chat history | ❌ |
| L5 | Quick suggestions | Quick action buttons | ❌ |

### 5.2 LLM Configuration

```typescript
// LLM Options:
// Option 1: Ollama (Local, Free)
// - Model: mistral, llama2, etc.
// - Endpoint: http://localhost:11434/api/generate

// Option 2: OpenAI
// - Model: gpt-4-turbo, gpt-3.5-turbo
// - API: https://api.openai.com/v1/chat/completions

// Option 3: Claude
// - Model: claude-3-sonnet, claude-3-haiku
// - API: https://api.anthropic.com/v1/messages
```

### 5.3 Chat Features

| # | Feature | Prompt Example | Status |
|---|---------|----------------|--------|
| L6 | Find by budget | "Tìm trọ dưới 3 triệu gần ĐH Đà Nẵng" | ❌ |
| L7 | Find by area | "Nhà trọ quận Liên Chiểu" | ❌ |
| L8 | Amenities | "Trọ có wifi, máy lạnh" | ❌ |
| L9 | General Q&A | "Khu vực nào an toàn?" | ❌ |

---

## 🟣 PHASE 6: Admin Improvements (Week 5)

### 6.1 Admin Pages

| # | Task | Route | Description | Status |
|---|------|-------|-------------|--------|
| A1 | Package management | `/dashboard/goi-dang` | View/manage goi_dang | ❌ |
| A2 | User management | `/dashboard/users` | Manage admin users | ❌ |
| A3 | Settings | `/dashboard/settings` | System configuration | ❌ |

### 6.2 Table Improvements

| # | Task | File | Description | Status |
|---|------|------|-------------|--------|
| T1 | Pagination | All admin tables | Add paginator | ❌ |
| T2 | Column sorting | All admin tables | Sort by column | ❌ |
| T3 | Bulk actions | All admin tables | Multi-select | ❌ |
| T4 | Column visibility | All admin tables | Show/hide columns | ❌ |
| T5 | Export CSV | All admin tables | Export to CSV | ❌ |

### 6.3 Reports & Analytics

| # | Task | File | Description | Status |
|---|------|------|-------------|--------|
| R1 | PDF export | `baocao/page.tsx` | Export report to PDF | ❌ |
| R2 | Revenue chart | `dashboard/page.tsx` | Monthly revenue | ❌ |
| R3 | Popular listings | `dashboard/page.tsx` | Top viewed | ❌ |
| R4 | User stats | `dashboard/page.tsx` | Active users | ❌ |

---

## ⚪ PHASE 7: UI/UX Polish (Week 5)

### 7.1 Theme

| # | Task | File | Description | Status |
|---|------|------|-------------|--------|
| TH1 | Dark mode toggle | `ThemeToggle.tsx` | Light/dark switch | ❌ |
| TH2 | Theme provider | `ThemeProvider.tsx` | Next-Themes provider | ❌ |
| TH3 | Dark colors | `globals.css` | Dark mode palette | ❌ |
| TH4 | System preference | - | Follow system setting | ❌ |

### 7.2 Loading States

| # | Task | File | Description | Status |
|---|------|------|-------------|--------|
| L1 | Skeleton screens | `Skeleton.tsx` | Skeleton loading | ❌ |
| L2 | Map skeleton | `MapView.tsx` | Map loading state | ❌ |
| L3 | Table skeleton | Admin tables | Table loading | ❌ |
| L4 | Progressive loading | `page.tsx` | Lazy load markers | ❌ |

### 7.3 Notifications

| # | Task | File | Description | Status |
|---|------|------|-------------|--------|
| N1 | Toast system | `Toast.tsx` | Toast notifications | ❌ |
| N2 | Success toast | - | Success messages | ❌ |
| N3 | Error toast | - | Error messages | ❌ |
| N4 | Info toast | - | Info messages | ❌ |

### 7.4 PWA Support

| # | Task | File | Description | Status |
|---|------|------|-------------|--------|
| P1 | Manifest | `public/manifest.json` | PWA manifest | ❌ |
| P2 | Service worker | `public/sw.js` | Offline support | ❌ |
| P3 | Install prompt | `InstallPrompt.tsx` | Add to home screen | ❌ |
| P4 | Offline page | `app/offline/page.tsx` | Offline fallback | ❌ |

---

## 🏗️ PHASE 8: Infrastructure (Week 6+)

### 8.1 CI/CD

| # | Task | File | Description | Status |
|---|------|------|-------------|--------|
| CI1 | GitHub Actions | `.github/workflows/` | CI pipeline | ❌ |
| CI2 | Lint check | `.github/workflows/lint.yml` | ESLint | ❌ |
| CI3 | Type check | `.github/workflows/types.yml` | TypeScript | ❌ |
| CI4 | Deploy workflow | `.github/workflows/deploy.yml` | Auto deploy | ❌ |

### 8.2 Testing

| # | Task | File | Description | Status |
|---|------|------|-------------|--------|
| T1 | Jest setup | `jest.config.ts` | Unit testing | ❌ |
| T2 | Playwright setup | `playwright.config.ts` | E2E testing | ❌ |
| T3 | Login tests | `tests/login.spec.ts` | Login flow | ❌ |
| T4 | Map tests | `tests/map.spec.ts` | Map functionality | ❌ |

### 8.3 Shared Package

| # | Task | Path | Description | Status |
|---|------|------|-------------|--------|
| SP1 | Types package | `packages/types/` | Shared TypeScript types | ❌ |
| SP2 | UI components | `packages/ui/` | Shared UI components | ❌ |
| SP3 | Constants | `packages/constants/` | Shared constants | ❌ |

### 8.4 Database Improvements

| # | Task | File | Description | Status |
|---|------|------|-------------|--------|
| DB1 | pg_cron enable | `supabase/migrations/` | Auto-expiry packages | ❌ |
| DB2 | Soft delete | All tables | Add `deleted_at` column | ❌ |
| DB3 | Audit table | `supabase/migrations/` | `admin_actions` table | ❌ |
| DB4 | Migrations guide | `supabase/README.md` | How to manage migrations | ❌ |

---

## 📊 Progress Tracking

### Phase 1: Security & SEO
```
[████████████████████] 12/16 tasks (75%) 🟡
```

### Phase 2: Business Pages
```
[████████████████████] 4/4 tasks (100%) ✅
```

### Phase 3: Ad Management
```
[████████████████░░░] 8/12 tasks (67%) 🟡
```

### Phase 4: User Experience
```
[████████████████████] 6/14 tasks (43%) 🟡
```

### Phase 5: LLM Features
```
[██████████████░░░░░] 4/5 tasks (80%) 🟡
```

### Phase 6: Admin Improvements
```
[░░░░░░░░░░░░░░░░░░░░] 0/12 tasks (0%)
```

### Phase 7: UI/UX Polish
```
[░░░░░░░░░░░░░░░░░░░░] 0/15 tasks (0%)
```

### Phase 8: Infrastructure
```
[░░░░░░░░░░░░░░░░░░░░] 0/13 tasks (0%)
```

---

## 🎯 Quick Start Commands

```bash
# Phase 1: Security
# Run migration to fix RLS
psql -h db.xxx.supabase.co -U postgres -d postgres -f supabase/migrations/002_fix_rls.sql

# Phase 1: SEO
# Create sitemap and robots
touch tromap-dana/src/app/sitemap.ts
touch tromap-dana/src/app/robots.ts

# Phase 2: Pages
mkdir -p tromap-dana/src/app/{contact,about,privacy,terms}

# Phase 3: Ad Management
mkdir -p tromap-admin/src/app/dashboard/quangcao

# Phase 4: Features
mkdir -p tromap-dana/src/components/{modal,search,chat}

# Phase 5: LLM
# Install Ollama or set up API
```

---

*Last Updated: 2026-08-04*
