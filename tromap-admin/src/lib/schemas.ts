import { z } from 'zod';

// =============================================
// Coordinate Bounds for Da Nang
// =============================================
const DANANG_LAT_MIN = 15.9548;
const DANANG_LAT_MAX = 16.1813;
const DANANG_LNG_MIN = 108.0780;
const DANANG_LNG_MAX = 108.3292;

// =============================================
// Chu Tro (Owner) Schemas
// =============================================

export const chuTroSchema = z.object({
  id: z.string().uuid().optional(),
  ten: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(100, 'Tên quá dài'),
  email: z.string().email('Email không hợp lệ').optional().or(z.literal('')),
  sdt: z.string()
    .regex(/^[0-9]{10,11}$/, 'SĐT phải có 10-11 chữ số')
    .optional()
    .or(z.literal('')),
  zalo: z.string().max(50).optional(),
  facebook_url: z.string().url('Facebook URL không hợp lệ').optional().or(z.literal('')),
  dia_chi: z.string().max(200).optional(),
  ghi_chu: z.string().max(500).optional(),
  ngay_tao: z.string().datetime().optional(),
  ngay_cap_nhat: z.string().datetime().optional(),
});

export type ChuTroInput = z.infer<typeof chuTroSchema>;

// =============================================
// Nha Tro (Listing) Schemas
// =============================================

export const nhaTroSchema = z.object({
  id: z.string().uuid().optional(),
  chu_tro_id: z.string().uuid('ID chủ trọ không hợp lệ'),
  tieu_de: z.string()
    .min(10, 'Tiêu đề phải có ít nhất 10 ký tự')
    .max(200, 'Tiêu đề quá dài (tối đa 200 ký tự)'),
  mo_ta: z.string().max(2000, 'Mô tả quá dài (tối đa 2000 ký tự)').optional(),
  gia_thang: z.number()
    .min(100000, 'Giá phải lớn hơn 100,000 VNĐ')
    .max(100000000, 'Giá quá cao'),
  dien_tich: z.number().min(5, 'Diện tích phải lớn hơn 5m²').max(1000, 'Diện tích quá lớn').optional(),
  dia_chi: z.string().max(300, 'Địa chỉ quá dài').optional().or(z.literal('')),
  lat: z.number()
    .min(DANANG_LAT_MIN, 'Vĩ độ ngoài khu vực Đà Nẵng')
    .max(DANANG_LAT_MAX, 'Vĩ độ ngoài khu vực Đà Nẵng'),
  lng: z.number()
    .min(DANANG_LNG_MIN, 'Kinh độ ngoài khu vực Đà Nẵng')
    .max(DANANG_LNG_MAX, 'Kinh độ ngoài khu vực Đà Nẵng'),
  facebook_url: z.string()
    .url('Facebook URL không hợp lệ')
    .refine(
      (url) => url.includes('facebook.com') || url.includes('fb.com'),
      'Facebook URL phải thuộc domain facebook.com hoặc fb.com'
    ),
  trang_thai: z.enum(['active', 'inactive', 'het_han']).default('active'),
  luot_xem: z.number().int().min(0).default(0),
  ngay_tao: z.string().datetime().optional(),
  ngay_cap_nhat: z.string().datetime().optional(),
});

export type NhaTroInput = z.infer<typeof nhaTroSchema>;

// =============================================
// Quang Cao (Advertisement) Schemas
// =============================================

export const quangCaoSchema = z.object({
  id: z.string().uuid().optional(),
  ten_nguoi_dang: z.string().min(2, 'Tên người đăng quá ngắn').max(100),
  tieu_de: z.string().min(5, 'Tiêu đề quá ngắn').max(200),
  noi_dung: z.string().max(1000, 'Nội dung quá dài').optional(),
  hinh_anh: z.string().url('URL hình ảnh không hợp lệ').optional().or(z.literal('')),
  lien_ket: z.string().url('URL liên kết không hợp lệ').optional().or(z.literal('')),
  vi_tri: z.enum(['banner', 'sidebar', 'popup']),
  ngay_bat_dau: z.string().datetime().optional(),
  ngay_ket_thuc: z.string().datetime().optional(),
  trang_thai: z.enum(['active', 'inactive']).default('inactive'),
  luot_xem: z.number().int().min(0).default(0),
  luot_click: z.number().int().min(0).default(0),
  ngay_tao: z.string().datetime().optional(),
  ngay_cap_nhat: z.string().datetime().optional(),
}).refine(
  (data) => {
    if (data.ngay_bat_dau && data.ngay_ket_thuc) {
      return new Date(data.ngay_ket_thuc) >= new Date(data.ngay_bat_dau);
    }
    return true;
  },
  {
    message: 'Ngày kết thúc phải sau ngày bắt đầu',
    path: ['ngay_ket_thuc'],
  }
);

export type QuangCaoInput = z.infer<typeof quangCaoSchema>;

// =============================================
// Chat API Schemas
// =============================================

export const chatMessageSchema = z.object({
  message: z.string()
    .min(1, 'Tin nhắn không được trống')
    .max(500, 'Tin nhắn quá dài (tối đa 500 ký tự)'),
  troList: z.array(z.any()).max(20).optional().default([]),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

// =============================================
// Filter/Search Schemas
// =============================================

export const troFilterSchema = z.object({
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().max(100000000).optional(),
  minArea: z.number().min(0).optional(),
  maxArea: z.number().max(1000).optional(),
  district: z.string().optional(),
  sortBy: z.enum(['price', 'distance', 'newest']).default('newest'),
  showOnlyNearby: z.boolean().default(false),
  search: z.string().max(100).optional(),
});

export type TroFilterInput = z.infer<typeof troFilterSchema>;

// =============================================
// Pagination Schema
// =============================================

export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
  sortField: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

// =============================================
// Validation Helper Functions
// =============================================

export function validateCoordinates(lat: number, lng: number): boolean {
  return (
    lat >= DANANG_LAT_MIN &&
    lat <= DANANG_LAT_MAX &&
    lng >= DANANG_LNG_MIN &&
    lng <= DANANG_LNG_MAX
  );
}

export function validatePhone(sdt: string): boolean {
  return /^[0-9]{10,11}$/.test(sdt);
}

export function validateFacebookUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return (
      (parsed.hostname.includes('facebook.com') || 
       parsed.hostname.includes('fb.com')) &&
      !parsed.hostname.includes('javascript')
    );
  } catch {
    return false;
  }
}

export function formatValidationError(error: z.ZodError): string {
  const issues = error.issues.map((issue) => {
    const path = issue.path.join('.');
    return path ? `${path}: ${issue.message}` : issue.message;
  });
  return issues.join('; ');
}
