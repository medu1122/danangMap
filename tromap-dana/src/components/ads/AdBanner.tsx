'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { QuangCao } from '@/types';

interface AdBannerProps {
  position: 'top' | 'sidebar';
  limit?: number;
  ads?: QuangCao[]; // Optional - if provided, uses this instead of fetching
}

export default function AdBanner({ position, limit = 1, ads: propAds }: AdBannerProps) {
  const [clickedIds, setClickedIds] = useState<Set<string>>(new Set());

  // Filter ads by position
  const filteredAds = (propAds || []).filter(ad => ad.vi_tri === (position === 'top' ? 'banner' : 'sidebar')).slice(0, limit);

  const trackImpression = async (adIds: string[]) => {
    adIds.forEach(id => {
      supabase.rpc('increment_ad_impression', { ad_id: id }).catch(() => {});
    });
  };

  // Track impressions on mount
  if (filteredAds.length > 0) {
    trackImpression(filteredAds.map(ad => ad.id));
  }

  if (filteredAds.length === 0) {
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
        {filteredAds.map((ad) => (
          <AdItem key={ad.id} ad={ad} clickedIds={clickedIds} setClickedIds={setClickedIds} />
        ))}
      </div>
    );
  }

  // For top banner, rotate between ads or show first one
  const currentAd = filteredAds[Math.floor(Math.random() * filteredAds.length)];
  return <AdItem ad={currentAd} clickedIds={clickedIds} setClickedIds={setClickedIds} />;
}

interface AdItemProps {
  ad: QuangCao;
  clickedIds: Set<string>;
  setClickedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
}

function AdItem({ ad, clickedIds, setClickedIds }: AdItemProps) {
  const isClicked = clickedIds.has(ad.id);

  const handleClick = async () => {
    if (isClicked) return;
    
    setClickedIds(prev => new Set(prev).add(ad.id));
    
    // Track click
    supabase.rpc('increment_ad_click', { ad_id: ad.id }).catch(() => {});
  };

  if (!ad.hinh_anh) {
    // Text-only ad
    return (
      <motion.a
        href={ad.link_den || '#'}
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
      href={ad.link_den || '#'}
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
