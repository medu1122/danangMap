-- =============================================
-- ADD PERFORMANCE INDEXES
-- Migration: 004_add_performance_indexes.sql
-- Created: 2026-08-05
-- =============================================

-- =============================================
-- 1. Indexes for nha_tro table
-- =============================================

-- Primary ordering index (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_nha_tro_ngay_tao_desc
ON nha_tro (ngay_tao DESC);

-- Status + date for filtered listings
CREATE INDEX IF NOT EXISTS idx_nha_tro_status_ngay_tao
ON nha_tro (trang_thai, ngay_tao DESC);

-- For price filtering and sorting
CREATE INDEX IF NOT EXISTS idx_nha_tro_gia_thang
ON nha_tro (gia_thang);

-- For geolocation queries (bounding box)
CREATE INDEX IF NOT EXISTS idx_nha_tro_coordinates
ON nha_tro (lat, lng);

-- Foreign key to chu_tro
CREATE INDEX IF NOT EXISTS idx_nha_tro_chu_tro_id
ON nha_tro (chu_tro_id);

-- =============================================
-- 2. Indexes for goi_dang table (package/ads)
-- =============================================

-- Critical: Composite index for RLS policy check
-- This is used by the "has active package" RLS policy
CREATE INDEX IF NOT EXISTS idx_goi_dang_nha_tro_active
ON goi_dang (nha_tro_id, ngay_het_han)
WHERE trang_thai = 'active';

-- For expiration cleanup jobs
CREATE INDEX IF NOT EXISTS idx_goi_dang_het_han_status
ON goi_dang (ngay_het_han, trang_thai);

-- =============================================
-- 3. Indexes for quang_cao table (advertisements)
-- =============================================

-- Ad position and status filtering
CREATE INDEX IF NOT EXISTS idx_quang_cao_vi_tri_trang_thai
ON quang_cao (vi_tri, trang_thai);

-- Date range for active period
CREATE INDEX IF NOT EXISTS idx_quang_cao_ngay_bat_dau_ket_thuc
ON quang_cao (ngay_bat_dau, ngay_ket_thuc);

-- For ordering by creation date
CREATE INDEX IF NOT EXISTS idx_quang_cao_ngay_tao
ON quang_cao (ngay_tao DESC);

-- =============================================
-- 4. Indexes for chu_tro table (owners)
-- =============================================

-- Common ordering
CREATE INDEX IF NOT EXISTS idx_chu_tro_ngay_tao
ON chu_tro (ngay_tao DESC);

-- Name search (for autocomplete)
CREATE INDEX IF NOT EXISTS idx_chu_tro_ten
ON chu_tro (ten);

-- =============================================
-- 5. Indexes for lich_su_xem (view history)
-- =============================================

-- For time-based analytics queries
CREATE INDEX IF NOT EXISTS idx_lich_su_xem_thoi_gian_xem
ON lich_su_xem (thoi_gian_xem DESC);

-- Composite for listing + time
CREATE INDEX IF NOT EXISTS idx_lich_su_xem_nha_tro_thoi_gian
ON lich_su_xem (nha_tro_id, thoi_gian_xem DESC);

-- For daily/hourly aggregation
CREATE INDEX IF NOT EXISTS idx_lich_su_xem_created_at
ON lich_su_xem (created_at DESC);

-- =============================================
-- 6. Indexes for admin_users
-- =============================================

-- Primary key is already indexed, but add for common lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_email
ON admin_users (created_at);

-- =============================================
-- 7. Analyze tables to update statistics
-- =============================================

ANALYZE nha_tro;
ANALYZE goi_dang;
ANALYZE quang_cao;
ANALYZE chu_tro;
ANALYZE lich_su_xem;
ANALYZE admin_users;

-- =============================================
-- 8. Verify indexes created
-- =============================================

SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
