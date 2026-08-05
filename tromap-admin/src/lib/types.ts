export interface ChuTro {
  id: string;
  ten: string;
  sdt?: string;
  zalo?: string;
  email?: string;
  facebook_url?: string;
  ngay_tao: string;
  ngay_cap_nhat: string;
}

export interface NhaTro {
  id: string;
  chu_tro_id: string;
  tieu_de: string;
  mo_ta?: string;
  gia_thang: number;
  dien_tich?: number;
  dia_chi?: string;
  lat: number;
  lng: number;
  facebook_url: string;
  trang_thai: 'active' | 'inactive' | 'het_han';
  luot_xem: number;
  ngay_tao: string;
  ngay_cap_nhat: string;
}

export interface GoiDang {
  id: string;
  chu_tro_id: string;
  nha_tro_id: string;
  so_ngay: number;
  gia: number;
  ngay_mua: string;
  ngay_het_han: string;
  trang_thai: 'active' | 'het_han' | 'huy';
}

export interface QuangCao {
  id: string;
  vi_tri: 'banner' | 'sidebar' | 'popup';
  hinh_anh?: string;
  link_den?: string;
  ngay_bat_dau?: string;
  ngay_ket_thuc?: string;
  trang_thai: 'active' | 'inactive';
}

export interface DongY {
  id: string;
  chu_tro_id: string;
  nha_tro_id?: string;
  loai: 'dang_ky' | 'go_bo';
  noi_dung?: string;
  timestamp: string;
  nguon: 'facebook' | 'zalo' | 'tuc_lai';
}

export interface LichSuXem {
  id: string;
  nha_tro_id: string;
  thoi_gian_xem: string;
  device_info?: Record<string, unknown>;
}

export interface DashboardStats {
  totalTro: number;
  totalChuTro: number;
  luotXemHomNay: number;
  doanhThuThang: number;
}

export interface BaoGiaTemplate {
  chu_tro: ChuTro;
  so_ngay: number;
  don_gia: number;
  tong_tien: number;
  ngay_tao: string;
}
