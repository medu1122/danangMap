-- TroMapDana Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: chu_tro (Chủ trọ)
CREATE TABLE IF NOT EXISTS chu_tro (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ten TEXT NOT NULL,
  sdt TEXT,
  zalo TEXT,
  email TEXT,
  facebook_url TEXT,
  ngay_tao TIMESTAMPTZ DEFAULT NOW(),
  ngay_cap_nhat TIMESTAMPTZ DEFAULT NOW()
);

-- Table: nha_tro (Nhà trọ)
CREATE TABLE IF NOT EXISTS nha_tro (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chu_tro_id UUID REFERENCES chu_tro(id) ON DELETE CASCADE,
  tieu_de TEXT NOT NULL,
  mo_ta TEXT,
  gia_thang INTEGER NOT NULL CHECK (gia_thang >= 0 AND gia_thang <= 50000000),
  dien_tich INTEGER CHECK (dien_tich > 0),
  dia_chi TEXT,
  lat DECIMAL(10, 7) NOT NULL,
  lng DECIMAL(10, 7) NOT NULL,
  facebook_url TEXT NOT NULL,
  trang_thai TEXT DEFAULT 'active' CHECK (trang_thai IN ('active', 'inactive', 'het_han')),
  luot_xem INTEGER DEFAULT 0,
  ngay_tao TIMESTAMPTZ DEFAULT NOW(),
  ngay_cap_nhat TIMESTAMPTZ DEFAULT NOW()
);

-- Table: goi_dang (Gói đăng)
CREATE TABLE IF NOT EXISTS goi_dang (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chu_tro_id UUID REFERENCES chu_tro(id) ON DELETE CASCADE,
  nha_tro_id UUID REFERENCES nha_tro(id) ON DELETE CASCADE,
  so_ngay INTEGER NOT NULL CHECK (so_ngay > 0),
  gia INTEGER NOT NULL CHECK (gia >= 0),
  ngay_mua TIMESTAMPTZ DEFAULT NOW(),
  ngay_het_han TIMESTAMPTZ NOT NULL,
  trang_thai TEXT DEFAULT 'active' CHECK (trang_thai IN ('active', 'het_han', 'huy'))
);

-- Table: quang_cao (Quảng cáo)
CREATE TABLE IF NOT EXISTS quang_cao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vi_tri TEXT NOT NULL CHECK (vi_tri IN ('banner', 'sidebar', 'popup')),
  hinh_anh TEXT,
  link_den TEXT,
  ngay_bat_dau DATE,
  ngay_ket_thuc DATE,
  trang_thai TEXT DEFAULT 'active' CHECK (trang_thai IN ('active', 'inactive'))
);

-- Table: lich_su_xem (Lịch sử xem)
CREATE TABLE IF NOT EXISTS lich_su_xem (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nha_tro_id UUID REFERENCES nha_tro(id) ON DELETE CASCADE,
  thoi_gian_xem TIMESTAMPTZ DEFAULT NOW(),
  device_info JSONB
);

-- Table: dong_y (Consent tracking)
CREATE TABLE IF NOT EXISTS dong_y (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chu_tro_id UUID REFERENCES chu_tro(id) ON DELETE CASCADE,
  nha_tro_id UUID REFERENCES nha_tro(id) ON DELETE SET NULL,
  loai TEXT NOT NULL CHECK (loai IN ('dang_ky', 'go_bo')),
  noi_dung TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  nguon TEXT CHECK (nguon IN ('facebook', 'zalo', 'tuc_lai'))
);

-- Table: admin_users (Admin users)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  ten TEXT,
  ngay_tao TIMESTAMPTZ DEFAULT NOW()
);

-- Table: lien_he (Contact submissions)
CREATE TABLE IF NOT EXISTS lien_he (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ho_ten TEXT NOT NULL,
  email TEXT NOT NULL,
  so_dt TEXT,
  loai TEXT NOT NULL CHECK (loai IN ('tu_van', 'quang_cao', 'bao_cao', 'khac')),
  noi_dung TEXT NOT NULL,
  da_doc BOOLEAN DEFAULT FALSE,
  ngay_tao TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_nha_tro_trang_thai ON nha_tro(trang_thai);
CREATE INDEX IF NOT EXISTS idx_nha_tro_chu_tro ON nha_tro(chu_tro_id);
CREATE INDEX IF NOT EXISTS idx_nha_tro_location ON nha_tro(lat, lng);
CREATE INDEX IF NOT EXISTS idx_goi_dang_het_han ON goi_dang(ngay_het_han);
CREATE INDEX IF NOT EXISTS idx_lich_su_xem_nha_tro ON lich_su_xem(nha_tro_id);
CREATE INDEX IF NOT EXISTS idx_dong_y_chu_tro ON dong_y(chu_tro_id);

-- Row Level Security (RLS)
ALTER TABLE chu_tro ENABLE ROW LEVEL SECURITY;
ALTER TABLE nha_tro ENABLE ROW LEVEL SECURITY;
ALTER TABLE goi_dang ENABLE ROW LEVEL SECURITY;
ALTER TABLE quang_cao ENABLE ROW LEVEL SECURITY;
ALTER TABLE lich_su_xem ENABLE ROW LEVEL SECURITY;
ALTER TABLE dong_y ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chu_tro
CREATE POLICY "Public can view chu_tro limited" ON chu_tro
  FOR SELECT USING (true);

CREATE POLICY "Admin can do anything on chu_tro" ON chu_tro
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for nha_tro (PUBLIC - only active trọ without sensitive data)
CREATE POLICY "Public can view active nha_tro" ON nha_tro
  FOR SELECT USING (
    trang_thai = 'active' 
    AND EXISTS (
      SELECT 1 FROM goi_dang gd 
      WHERE gd.nha_tro_id = nha_tro.id 
      AND gd.trang_thai = 'active' 
      AND gd.ngay_het_han > NOW()
    )
  );

CREATE POLICY "Admin can do anything on nha_tro" ON nha_tro
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for goi_dang
CREATE POLICY "Public can view active goi_dang" ON goi_dang
  FOR SELECT USING (trang_thai = 'active');

CREATE POLICY "Admin can do anything on goi_dang" ON goi_dang
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for quang_cao
CREATE POLICY "Public can view active quang_cao" ON quang_cao
  FOR SELECT USING (
    trang_thai = 'active'
    AND (ngay_bat_dau IS NULL OR ngay_bat_dau <= CURRENT_DATE)
    AND (ngay_ket_thuc IS NULL OR ngay_ket_thuc >= CURRENT_DATE)
  );

CREATE POLICY "Admin can do anything on quang_cao" ON quang_cao
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for lich_su_xem
CREATE POLICY "Public can insert lich_su_xem" ON lich_su_xem
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view lich_su_xem" ON lich_su_xem
  FOR SELECT USING (auth.role() = 'authenticated');

-- RLS Policies for dong_y
CREATE POLICY "Admin can do anything on dong_y" ON dong_y
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for admin_users
CREATE POLICY "Admin can do anything on admin_users" ON admin_users
  FOR ALL USING (auth.role() = 'authenticated');

-- RLS Policies for lien_he (Contact submissions)
CREATE POLICY "Public can insert lien_he" ON lien_he
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view lien_he" ON lien_he
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can update lien_he" ON lien_he
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Function: Auto update ngay_cap_nhat
CREATE OR REPLACE FUNCTION update_ngay_cap_nhat()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ngay_cap_nhat = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS update_chu_tro_timestamp ON chu_tro;
CREATE TRIGGER update_chu_tro_timestamp
  BEFORE UPDATE ON chu_tro
  FOR EACH ROW
  EXECUTE FUNCTION update_ngay_cap_nhat();

DROP TRIGGER IF EXISTS update_nha_tro_timestamp ON nha_tro;
CREATE TRIGGER update_nha_tro_timestamp
  BEFORE UPDATE ON nha_tro
  FOR EACH ROW
  EXECUTE FUNCTION update_ngay_cap_nhat();

-- Function: Increment luot_xem
CREATE OR REPLACE FUNCTION increment_luot_xem(troid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE nha_tro SET luot_xem = luot_xem + 1 WHERE id = troid;
END;
$$ LANGUAGE plpgsql;

-- Cron job: Auto set het_han for expired packages (requires pg_cron extension)
-- Uncomment after enabling pg_cron in Supabase
/*
SELECT cron.schedule(
  'check_expired_packages',
  '0 0 * * *',
  $$
    UPDATE goi_dang 
    SET trang_thai = 'het_han'
    WHERE ngay_het_han < NOW() 
      AND trang_thai = 'active'
  $$
);
*/
