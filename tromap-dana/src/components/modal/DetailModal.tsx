'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  MapPin,
  Heart,
  Share2,
  ExternalLink,
  Home,
  Ruler,
  Clock,
  Eye,
  Check,
} from 'lucide-react';
import { NhaTroWithDistance } from '@/types';
import { formatPrice, formatDate, formatRelativeTime } from '@/lib/utils';
import { sanitizeUrl, isValidFacebookUrl, formatFacebookUrl } from '@/lib/sanitize';
import { useToast } from '@/components/providers/ToastProvider';

interface DetailModalProps {
  tro: NhaTroWithDistance | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite?: (tro: NhaTroWithDistance) => void;
  isFavorite?: boolean;
}

export default function DetailModal({
  tro,
  isOpen,
  onClose,
  onToggleFavorite,
  isFavorite = false,
}: DetailModalProps) {
  const { showToast } = useToast();
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Safe Facebook URL
  const getSafeFacebookUrl = useCallback((url: string | null | undefined): string => {
    if (!url) return '#';
    const formatted = formatFacebookUrl(url);
    if (isValidFacebookUrl(formatted)) {
      return sanitizeUrl(formatted) || '#';
    }
    return '#';
  }, []);

  if (!tro) return null;

  const facebookUrl = getSafeFacebookUrl(tro.facebook_url);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: tro.tieu_de,
          text: `${tro.tieu_de} - ${formatPrice(tro.gia_thang)}/tháng tại Đà Nẵng`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      showToast('Đã copy link!', 'success');
    }
  };

  const handleContact = () => {
    window.open(facebookUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[9998]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl md:max-h-[90vh] bg-white rounded-3xl shadow-2xl z-[9999] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-[#00B4D8] to-[#52B788] px-6 py-5">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Action buttons */}
              <div className="absolute top-4 left-4 flex gap-2">
                {onToggleFavorite && (
                  <button
                    onClick={() => onToggleFavorite(tro)}
                    className={`p-2 rounded-full transition-colors ${
                      isFavorite
                        ? 'bg-red-500 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                )}
                <button
                  onClick={handleShare}
                  className="p-2 bg-white/20 text-white hover:bg-white/30 rounded-full transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Title */}
              <div className="pr-16">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {tro.tieu_de}
                </h2>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>Đăng {formatRelativeTime(tro.ngay_tao)}</span>
                  <span className="mx-2">•</span>
                  <Eye className="w-4 h-4" />
                  <span>{tro.luot_xem} lượt xem</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Price - Featured */}
              <div className="bg-gradient-to-br from-[#DCFCE7] to-[#BBF7D0] rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#52B788] rounded-xl flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#52B788] text-3xl font-bold">
                      {formatPrice(tro.gia_thang)}
                    </p>
                    <p className="text-[#6B7280] text-sm">Giá thuê mỗi tháng</p>
                  </div>
                </div>
              </div>

              {/* Quick info grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {tro.dien_tich && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#00B4D8]/10 rounded-lg flex items-center justify-center">
                        <Ruler className="w-5 h-5 text-[#00B4D8]" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{tro.dien_tich} m²</p>
                        <p className="text-xs text-gray-500">Diện tích</p>
                      </div>
                    </div>
                  </div>
                )}

                {tro.distance !== undefined && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-[#F59E0B]" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          {tro.distance < 1
                            ? `${Math.round(tro.distance * 1000)}m`
                            : `${tro.distance.toFixed(1)}km`}
                        </p>
                        <p className="text-xs text-gray-500">Từ vị trí của bạn</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#52B788]/10 rounded-lg flex items-center justify-center">
                      <Home className="w-5 h-5 text-[#52B788]" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900 capitalize">{tro.trang_thai === 'active' ? 'Đang cho thuê' : tro.trang_thai}</p>
                      <p className="text-xs text-gray-500">Trạng thái</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{formatDate(tro.ngay_tao)}</p>
                      <p className="text-xs text-gray-500">Ngày đăng</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              {tro.dia_chi && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#00B4D8]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#00B4D8]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Địa chỉ</p>
                      <p className="font-medium text-gray-900">{tro.dia_chi}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              {tro.mo_ta && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-2">Mô tả</h3>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {tro.mo_ta}
                  </p>
                </div>
              )}

              {/* Contact card */}
              <div className="bg-gradient-to-br from-[#1877F2] to-[#0d65d9] rounded-2xl p-5 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold">Liên hệ chủ trọ</p>
                    <p className="text-white/80 text-sm">Qua Facebook Messenger</p>
                  </div>
                </div>
                <button
                  onClick={handleContact}
                  className="w-full py-3 bg-white text-[#1877F2] font-bold rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.97.241-.97.778s.432.777.972.777h.793l.805 2.554c.075.257.326.424.594.424h.164c.268 0 .518-.167.593-.424l.805-2.554h1.035c.54 0 .973-.241.973-.778s-.433-.777-.972-.777h-1.35l-.293-1.043c-.12-.428-.542-.722-.961-.722h-1.196c-.419 0-.84.294-.961.722l-.293 1.043z"/>
                  </svg>
                  Nhắn tin qua Facebook
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-gray-400 text-center mt-6">
                Thông tin chỉ mang tính tham khảo. Vui lòng liên hệ trực tiếp để biết thêm chi tiết.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
