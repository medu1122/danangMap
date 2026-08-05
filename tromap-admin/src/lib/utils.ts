import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatPriceShort(price: number): string {
  if (price >= 1000000) {
    const millions = price / 1000000;
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)} triệu`;
  }
  return new Intl.NumberFormat('vi-VN').format(price);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function maskPhone(phone: string): string {
  if (!phone || phone.length <= 4) return phone;
  return phone.slice(0, phone.length - 4).replace(/./g, '*') + phone.slice(-4);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function calculateBaoGia(soNgay: number, donGia: number = 5000): number {
  return soNgay * donGia;
}

export const DON_GIA_NGAY = 5000; // 5k/ngày

export function generateBaoGiaContent(
  tenChuTro: string,
  soNgay: number,
  donGia: number,
  tongTien: number
): string {
  return `
Chào anh/chị ${tenChuTro},

Cảm ơn đã quan tâm đến TroMapDana!

Chi phí đăng thông tin nhà trọ:
- Số ngày đăng: ${soNgay} ngày
- Đơn giá: ${formatPrice(donGia)}/ngày
- Tổng cộng: ${formatPrice(tongTien)}

Thông tin tài khoản thanh toán:
- Ngân hàng: [Tên ngân hàng]
- Số tài khoản: [Số TK]
- Tên tài khoản: [Tên TK]
- Chi nhánh: [Chi nhánh]

Sau khi thanh toán, vui lòng gửi tin nhắn xác nhận qua Zalo hoặc Facebook để chúng tôi kích hoạt dịch vụ.

TroMapDana - Hỗ trợ sinh viên tìm trọ Đà Nẵng
  `.trim();
}

export function generateZaloContent(
  tenChuTro: string,
  soNgay: number,
  tongTien: number
): string {
  return `Chào anh/chị ${tenChuTro}!

TroMapDana gửi báo giá dịch vụ đăng thông tin nhà trọ:

📅 Số ngày: ${soNgay} ngày
💰 Tổng tiền: ${formatPrice(tongTien)}

Vui lòng thanh toán và gửi xác nhận qua tin nhắn này.

TroMapDana - Hỗ trợ tìm trọ Đà Nẵng`;
}
