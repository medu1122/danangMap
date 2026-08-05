-- =============================================
-- FIX RLS POLICIES - Add Admin Role Check
-- Migration: 003_fix_rls_admin_role.sql
-- Created: 2026-08-05
-- =============================================

-- Enable RLS on all tables (should already be enabled, but ensure it)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chu_tro ENABLE ROW LEVEL SECURITY;
ALTER TABLE nha_tro ENABLE ROW LEVEL SECURITY;
ALTER TABLE goi_dang ENABLE ROW LEVEL SECURITY;
ALTER TABLE quang_cao ENABLE ROW LEVEL SECURITY;
ALTER TABLE lich_su_xem ENABLE ROW LEVEL SECURITY;
ALTER TABLE dong_y ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 1. Drop existing admin policies (they use 'authenticated' which is wrong)
-- =============================================

-- Drop old admin policies for nha_tro
DROP POLICY IF EXISTS "Admin can insert nha_tro" ON nha_tro;
DROP POLICY IF EXISTS "Admin can update nha_tro" ON nha_tro;
DROP POLICY IF EXISTS "Admin can delete nha_tro" ON nha_tro;
DROP POLICY IF EXISTS "Admin can select nha_tro" ON nha_tro;

-- Drop old admin policies for chu_tro
DROP POLICY IF EXISTS "Admin can select chu_tro" ON chu_tro;
DROP POLICY IF EXISTS "Admin can insert chu_tro" ON chu_tro;
DROP POLICY IF EXISTS "Admin can update chu_tro" ON chu_tro;
DROP POLICY IF EXISTS "Admin can delete chu_tro" ON chu_tro;

-- Drop old admin policies for goi_dang
DROP POLICY IF EXISTS "Admin can select goi_dang" ON goi_dang;
DROP POLICY IF EXISTS "Admin can insert goi_dang" ON goi_dang;
DROP POLICY IF EXISTS "Admin can update goi_dang" ON goi_dang;
DROP POLICY IF EXISTS "Admin can delete goi_dang" ON goi_dang;

-- Drop old admin policies for quang_cao
DROP POLICY IF EXISTS "Admin can select quang_cao" ON quang_cao;
DROP POLICY IF EXISTS "Admin can insert quang_cao" ON quang_cao;
DROP POLICY IF EXISTS "Admin can update quang_cao" ON quang_cao;
DROP POLICY IF EXISTS "Admin can delete quang_cao" ON quang_cao;

-- Drop old admin policies for dong_y
DROP POLICY IF EXISTS "Admin can select dong_y" ON dong_y;
DROP POLICY IF EXISTS "Admin can insert dong_y" ON dong_y;
DROP POLICY IF EXISTS "Admin can update dong_y" ON dong_y;
DROP POLICY IF EXISTS "Admin can delete dong_y" ON dong_y;

-- =============================================
-- 2. Create helper function for admin check
-- =============================================

CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if current user exists in admin_users table
  RETURN EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 3. New admin policies using is_admin_user() function
-- =============================================

-- Admin Users table - only admins can see/manage
CREATE POLICY "Admins can view admin_users"
  ON admin_users FOR SELECT
  USING (is_admin_user());

CREATE POLICY "Admins can insert admin_users"
  ON admin_users FOR INSERT
  WITH CHECK (is_admin_user());

CREATE POLICY "Admins can update admin_users"
  ON admin_users FOR UPDATE
  USING (is_admin_user());

CREATE POLICY "Admins can delete admin_users"
  ON admin_users FOR DELETE
  USING (is_admin_user());

-- Chu Tro (Owner) table - only admins
CREATE POLICY "Admins can view chu_tro"
  ON chu_tro FOR SELECT
  USING (is_admin_user());

CREATE POLICY "Admins can insert chu_tro"
  ON chu_tro FOR INSERT
  WITH CHECK (is_admin_user());

CREATE POLICY "Admins can update chu_tro"
  ON chu_tro FOR UPDATE
  USING (is_admin_user());

CREATE POLICY "Admins can delete chu_tro"
  ON chu_tro FOR DELETE
  USING (is_admin_user());

-- Nha Tro (Listing) table - only admins
CREATE POLICY "Admins can view nha_tro"
  ON nha_tro FOR SELECT
  USING (is_admin_user());

CREATE POLICY "Admins can insert nha_tro"
  ON nha_tro FOR INSERT
  WITH CHECK (is_admin_user());

CREATE POLICY "Admins can update nha_tro"
  ON nha_tro FOR UPDATE
  USING (is_admin_user());

CREATE POLICY "Admins can delete nha_tro"
  ON nha_tro FOR DELETE
  USING (is_admin_user());

-- Goi Dang (Package) table - only admins
CREATE POLICY "Admins can view goi_dang"
  ON goi_dang FOR SELECT
  USING (is_admin_user());

CREATE POLICY "Admins can insert goi_dang"
  ON goi_dang FOR INSERT
  WITH CHECK (is_admin_user());

CREATE POLICY "Admins can update goi_dang"
  ON goi_dang FOR UPDATE
  USING (is_admin_user());

CREATE POLICY "Admins can delete goi_dang"
  ON goi_dang FOR DELETE
  USING (is_admin_user());

-- Quang Cao (Advertisement) table - only admins
CREATE POLICY "Admins can view quang_cao"
  ON quang_cao FOR SELECT
  USING (is_admin_user());

CREATE POLICY "Admins can insert quang_cao"
  ON quang_cao FOR INSERT
  WITH CHECK (is_admin_user());

CREATE POLICY "Admins can update quang_cao"
  ON quang_cao FOR UPDATE
  USING (is_admin_user());

CREATE POLICY "Admins can delete quang_cao"
  ON quang_cao FOR DELETE
  USING (is_admin_user());

-- Dong Y (Agreement) table - only admins
CREATE POLICY "Admins can view dong_y"
  ON dong_y FOR SELECT
  USING (is_admin_user());

CREATE POLICY "Admins can insert dong_y"
  ON dong_y FOR INSERT
  WITH CHECK (is_admin_user());

CREATE POLICY "Admins can update dong_y"
  ON dong_y FOR UPDATE
  USING (is_admin_user());

CREATE POLICY "Admins can delete dong_y"
  ON dong_y FOR DELETE
  USING (is_admin_user());

-- =============================================
-- 4. Lich Su Xem (View History) - Limited public access with constraints
-- =============================================

-- Drop existing public policies
DROP POLICY IF EXISTS "Public can insert lich_su_xem" ON lich_su_xem;
DROP POLICY IF EXISTS "Public can select lich_su_xem" ON lich_su_xem;

-- Add constraint for device_info size (prevent DoS)
ALTER TABLE lich_su_xem ADD CONSTRAINT lich_su_xem_device_info_size
  CHECK (device_info IS NULL OR octet_length(device_info::text) < 4096);

-- Public can insert (for tracking views) but with limits
CREATE POLICY "Anyone can insert lich_su_xem"
  ON lich_su_xem FOR INSERT
  WITH CHECK (
    nha_tro_id IS NOT NULL
    AND thoi_gian_xem <= NOW()
    AND thoi_gian_xem >= NOW() - INTERVAL '1 day'
  );

-- Anyone can select their own history (by device fingerprint)
-- This requires adding a device_fingerprint column - optional enhancement
-- For now, only admins can view all history
CREATE POLICY "Admins can view lich_su_xem"
  ON lich_su_xem FOR SELECT
  USING (is_admin_user());

-- =============================================
-- 5. Create function to add admin user (called manually or via admin panel)
-- =============================================

CREATE OR REPLACE FUNCTION add_admin_user(admin_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Only existing admins can add new admins
  IF NOT is_admin_user() THEN
    RAISE EXCEPTION 'Only admins can add new admin users';
  END IF;
  
  INSERT INTO admin_users (id, created_at)
  VALUES (admin_id, NOW())
  ON CONFLICT (id) DO NOTHING;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 6. Create function to remove admin user
-- =============================================

CREATE OR REPLACE FUNCTION remove_admin_user(admin_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Only admins can remove admins
  IF NOT is_admin_user() THEN
    RAISE EXCEPTION 'Only admins can remove admin users';
  END IF;
  
  -- Prevent self-removal
  IF admin_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot remove yourself as admin';
  END IF;
  
  DELETE FROM admin_users WHERE id = admin_id;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- 7. Grant execute on helper functions
-- =============================================

GRANT EXECUTE ON FUNCTION is_admin_user() TO PUBLIC;
GRANT EXECUTE ON FUNCTION add_admin_user(UUID) TO PUBLIC;
GRANT EXECUTE ON FUNCTION remove_admin_user(UUID) TO PUBLIC;

-- =============================================
-- 8. Verify setup
-- =============================================

-- Check if policies were created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('admin_users', 'chu_tro', 'nha_tro', 'goi_dang', 'quang_cao', 'dong_y', 'lich_su_xem')
ORDER BY tablename, policyname;
