-- Migration: Fix RLS on chu_tro table
-- Security Fix: Remove public SELECT policy for sensitive data
-- Date: 2026-08-04

-- Drop the insecure public SELECT policy
DROP POLICY IF EXISTS "Public can view chu_tro limited" ON chu_tro;

-- Create new policy: Only authenticated users (admin) can view chu_tro
-- This protects sensitive data like SDT and Zalo
CREATE POLICY "Admin can view chu_tro" ON chu_tro
  FOR SELECT USING (auth.role() = 'authenticated');

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename IN ('chu_tro', 'nha_tro', 'goi_dang', 'quang_cao')
ORDER BY tablename, policyname;
