'use client';

import { NhaTroWithDistance } from '@/types';
import { formatPrice } from '@/lib/utils';
import { sanitizeUrl, isValidFacebookUrl, formatFacebookUrl } from '@/lib/sanitize';

interface MarkerPopupProps {
  tro: NhaTroWithDistance;
  onClose?: () => void;
}

// Safe Facebook URL - validated and formatted
function getSafeFacebookUrl(url: string | null | undefined): string {
  if (!url) return '#';
  
  // Format the URL
  const formatted = formatFacebookUrl(url);
  
  // Validate and sanitize
  if (isValidFacebookUrl(formatted)) {
    return sanitizeUrl(formatted) || '#';
  }
  
  return '#';
}

export default function MarkerPopup({ tro, onClose }: MarkerPopupProps) {
  const facebookUrl = getSafeFacebookUrl(tro.facebook_url);
  
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-xl"
      style={{ fontFamily: 'Quicksand, sans-serif' }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#00B4D8] to-[#52B788] px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M3 9.5L12 4L21 9.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9.5Z"/>
            </svg>
          </div>
          <h3 className="text-white font-semibold text-base truncate flex-1">
            {tro.tieu_de}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-[#DCFCE7] rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#52B788" strokeWidth="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div>
            <p className="text-[#52B788] font-bold text-lg">
              {formatPrice(tro.gia_thang)}
              <span className="text-[#6B7280] font-normal text-sm">/tháng</span>
            </p>
          </div>
        </div>

        {/* Area */}
        {tro.dien_tich && (
          <div className="flex items-center gap-2 mb-2 text-[#6B7280]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
            <span className="text-sm">{tro.dien_tich}m²</span>
          </div>
        )}

        {/* Address */}
        {tro.dia_chi && (
          <div className="flex items-center gap-2 mb-2 text-[#6B7280]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="text-sm truncate flex-1">{tro.dia_chi}</span>
          </div>
        )}

        {/* Distance */}
        {tro.distance !== undefined && (
          <div className="flex items-center gap-2 mb-3 text-[#6B7280]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            <span className="text-sm">
              {tro.distance < 1 
                ? `${Math.round(tro.distance * 1000)}m` 
                : `${tro.distance.toFixed(1)}km`} từ vị trí của bạn
            </span>
          </div>
        )}

        {/* Description */}
        {tro.mo_ta && (
          <p className="text-sm text-[#6B7280] mb-3 line-clamp-2">
            {tro.mo_ta}
          </p>
        )}

        {/* Facebook button - with sanitized URL */}
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-3 bg-[#00B4D8] hover:bg-[#0096B4] text-white font-semibold rounded-xl transition-all duration-200 active:scale-95"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Xem chi tiết trên Facebook
        </a>
      </div>
    </div>
  );
}
