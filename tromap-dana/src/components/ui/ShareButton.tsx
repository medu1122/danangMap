'use client';

import { useState } from 'react';
import { Share2, Check, Copy, X } from 'lucide-react';

interface ShareButtonProps {
  url?: string;
  title?: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ShareButton({
  url,
  title = 'TroMapDana',
  description = 'Bản đồ nhà trọ Đà Nẵng',
  size = 'md',
  className = '',
}: ShareButtonProps) {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback to copy
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      showToastMessage('Đã copy link!');
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch {
      showToastMessage('Không thể copy');
    }
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        onClick={handleNativeShare}
        className={`flex items-center gap-2 bg-gradient-to-r from-[#00B4D8] to-[#52B788] text-white font-medium rounded-xl hover:opacity-90 transition-opacity ${sizeClasses[size]}`}
      >
        {isCopied ? (
          <Check className={iconSizes[size]} />
        ) : (
          <Share2 className={iconSizes[size]} />
        )}
        <span>{isCopied ? 'Đã copy!' : 'Chia sẻ'}</span>
      </button>

      {/* Toast notification */}
      {showToast && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-50 animate-fade-in">
          {toastMessage}
        </div>
      )}
    </div>
  );
}

// Share modal component
interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
  title?: string;
}

export function ShareModal({ isOpen, onClose, url, title }: ShareModalProps) {
  const [copied, setCopied] = useState<string | null>(null);
  
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Ignore
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-bold text-gray-900">Chia sẻ</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Copy link */}
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600"
            />
            <button
              onClick={() => copyToClipboard(shareUrl, 'link')}
              className="px-4 py-2 bg-[#00B4D8] text-white rounded-xl hover:bg-[#0096B4] transition-colors flex items-center gap-2"
            >
              {copied === 'link' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied === 'link' ? 'Đã copy' : 'Copy'}</span>
            </button>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-3 gap-3">
            {/* Facebook */}
            <button
              onClick={() => {
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                  '_blank'
                );
              }}
              className="flex flex-col items-center gap-2 p-4 bg-[#1877F2] text-white rounded-xl hover:bg-[#0d65d9] transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span className="text-xs font-medium">Facebook</span>
            </button>

            {/* Zalo - simplified */}
            <button
              onClick={() => copyToClipboard(shareUrl, 'zalo')}
              className="flex flex-col items-center gap-2 p-4 bg-[#0068FF] text-white rounded-xl hover:bg-[#0052CC] transition-colors"
            >
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#0068FF] text-sm font-bold">Z</span>
              </div>
              <span className="text-xs font-medium">Zalo</span>
            </button>

            {/* More options */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title, url: shareUrl });
                } else {
                  copyToClipboard(shareUrl, 'more');
                }
              }}
              className="flex flex-col items-center gap-2 p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-6 h-6" />
              <span className="text-xs font-medium">Khác</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
