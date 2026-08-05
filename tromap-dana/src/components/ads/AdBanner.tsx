'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { QuangCao } from '@/types';

interface AdBannerProps {
  position: 'top' | 'sidebar';
  limit?: number;
}

export default function AdBanner({ position, limit = 1 }: AdBannerProps) {
  const [ads, setAds] = useState<QuangCao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        const { data, error } = await supabase
          .from('quang_cao')
          .select('*')
          .eq('trang_thai', 'active')
          .eq('vi_tri', position === 'top' ? 'banner' : 'sidebar')
          .or(`ngay_bat_dau.is.null,ngay_bat_dau.lte.${today}`)
          .or(`ngay_ket_thuc.is.null,ngay_ket_thuc.gte.${today}`)
          .limit(limit);

        if (error) throw error;
        setAds(data || []);
        
        // Track impression (fire and forget)
        if (data && data.length > 0) {
          trackImpression(data.map(ad => ad.id));
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [position, limit]);

  const trackImpression = async (adIds: string[]) => {
    // Fire and forget - don't wait for response
    supabase.rpc('increment_ad_impression', { ad_ids: adIds }).then(() => {
      // Silently track
    }).catch(() => {
      // Silently fail
    });
  };

  if (loading || ads.length === 0) {
    // Placeholder ad
    return (
      <div 
        className={`bg-gradient-to-r from-[#E0F4FF] to-[#DCFCE7] border-2 border-dashed border-[#00B4D8]/30 rounded-xl flex items-center justify-center ${
          position === 'top' 
            ? 'h-[50px] md:h-[90px] w-full' 
            : 'h-[250px] w-[300px]'
        }`}
      >
        <div className="text-center px-4">
          <p className="text-sm text-[#6B7280]">Khu vực quảng cáo</p>
          <a 
            href="/contact" 
            className="text-xs text-[#00B4D8] hover:underline"
          >
            Liên hệ đặt quảng cáo
          </a>
        </div>
      </div>
    );
  }

  // For sidebar, show all ads stacked
  if (position === 'sidebar') {
    return (
      <div className="space-y-3">
        {ads.map((ad) => (
          <AdItem key={ad.id} ad={ad} />
        ))}
      </div>
    );
  }

  // For top banner, rotate between ads or show first one
  const currentAd = ads[Math.floor(Math.random() * ads.length)];
  return <AdItem ad={currentAd} />;
}

function AdItem({ ad }: { ad: QuangCao }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = async () => {
    if (clicked) return;
    setClicked(true);
    
    // Track click (fire and forget)
    supabase.rpc('increment_ad_click', { ad_id: ad.id }).then(() => {
      // Silently track
    }).catch(() => {
      // Silently fail
    });
  };

  if (!ad.hinh_anh) {
    // Text-only ad
    return (
      <motion.a
        href={ad.lien_ket || '#'}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block bg-gradient-to-r from-[#00B4D8] to-[#52B788] rounded-xl p-4 text-white hover:opacity-90 transition-opacity"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <p className="font-bold text-lg">{ad.tieu_de}</p>
        {ad.noi_dung && (
          <p className="text-sm opacity-90 mt-1">{ad.noi_dung}</p>
        )}
        <p className="text-xs opacity-70 mt-2">Quảng cáo - {ad.ten_nguoi_dang}</p>
      </motion.a>
    );
  }

  return (
    <motion.a
      href={ad.lien_ket || '#'}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="block rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <img
        src={ad.hinh_anh}
        alt={ad.tieu_de}
        className="w-full h-[50px] md:h-[90px] object-cover"
      />
      <div className="sr-only">
        <span>{ad.tieu_de}</span>
        <span>{ad.ten_nguoi_dang}</span>
      </div>
    </motion.a>
  );
}

// Ad manager component - wraps content with ads
export function AdManager({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Main content */}
      {children}
    </div>
  );
}

// Sidebar ads component
export function SidebarAds() {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-700 text-sm">Quảng cáo</h3>
      <AdBanner position="sidebar" limit={5} />
    </div>
  );
}
