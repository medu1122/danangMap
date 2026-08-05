// Đà Nẵng bounds
export const DANANG_BOUNDS = {
  north: 16.1813,
  south: 15.9548,
  east: 108.3292,
  west: 108.0780,
} as const;

export const DANANG_CENTER = {
  lat: 16.0544,
  lng: 108.2022,
} as const;

// Types
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

export interface NhaTroWithDistance extends NhaTro {
  distance?: number;
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
  device_info?: {
    userAgent?: string;
    screen?: string;
    referrer?: string;
  };
}

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  minDienTich?: number;
  maxDienTich?: number;
  sortBy: 'price' | 'distance' | 'newest';
  showOnlyNearby: boolean;
}

export interface UserLocation {
  lat: number;
  lng: number;
  withinDanang: boolean;
}

// Geolocation status
export type GeoStatus = 
  | 'idle'
  | 'requesting'
  | 'granted'
  | 'denied'
  | 'unavailable';
