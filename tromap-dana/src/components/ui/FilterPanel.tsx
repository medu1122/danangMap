'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterState } from '@/types';
import { formatPrice } from '@/lib/utils';
import { 
  Filter, 
  DollarSign, 
  Maximize2, 
  MapPin, 
  ChevronDown,
  X,
  Sparkles
} from 'lucide-react';

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  userLocation: { lat: number; lng: number } | null;
  onRequestLocation: () => void;
}

const PRICE_MAX = 50000000;
const AREA_MAX = 100;

export default function FilterPanel({
  filters,
  onFiltersChange,
  userLocation,
  onRequestLocation
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePriceChange = useCallback((value: number[]) => {
    onFiltersChange({
      ...filters,
      minPrice: value[0],
      maxPrice: value[1],
    });
  }, [filters, onFiltersChange]);

  const handleAreaChange = useCallback((value: number[]) => {
    onFiltersChange({
      ...filters,
      minDienTich: value[0] || undefined,
      maxDienTich: value[1] || undefined,
    });
  }, [filters, onFiltersChange]);

  const handleNearbyToggle = useCallback(() => {
    if (!userLocation) {
      onRequestLocation();
      return;
    }
    onFiltersChange({
      ...filters,
      showOnlyNearby: !filters.showOnlyNearby,
    });
  }, [filters, userLocation, onFiltersChange, onRequestLocation]);

  const handleSortChange = useCallback((sort: FilterState['sortBy']) => {
    onFiltersChange({
      ...filters,
      sortBy: sort,
    });
  }, [filters, onFiltersChange]);

  const quickFilters = [
    { label: 'Dưới 2 triệu', min: 0, max: 2000000 },
    { label: '2-5 triệu', min: 2000000, max: 5000000 },
    { label: '5-10 triệu', min: 5000000, max: 10000000 },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 z-[1000] md:bottom-4 md:left-auto md:right-4 md:w-80">
      {/* Expand button (mobile) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden w-full bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[#00B4D8]" />
          <span className="font-medium text-[#1A1A2E]">Bộ lọc</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-[#6B7280] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Filter content */}
      <AnimatePresence>
        {(isExpanded || typeof window !== 'undefined' && window.innerWidth >= 768) && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-4 space-y-5">
              {/* Quick filters */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-[#FFB703]" />
                  <span className="text-sm font-medium text-[#1A1A2E]">Lọc nhanh</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickFilters.map((qf) => (
                    <button
                      key={qf.label}
                      onClick={() => handlePriceChange([qf.min, qf.max])}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        filters.minPrice === qf.min && filters.maxPrice === qf.max
                          ? 'bg-[#00B4D8] text-white'
                          : 'bg-[#F0F9FF] text-[#00B4D8] hover:bg-[#E0F4FF]'
                      }`}
                    >
                      {qf.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#52B788]" />
                    <span className="text-sm font-medium text-[#1A1A2E]">Khoảng giá</span>
                  </div>
                  <span className="text-sm text-[#6B7280]">
                    {formatPrice(filters.minPrice)} - {formatPrice(filters.maxPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={PRICE_MAX}
                  value={filters.maxPrice}
                  onChange={(e) => handlePriceChange([filters.minPrice, parseInt(e.target.value)])}
                  className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#00B4D8]"
                />
                <div className="flex justify-between text-xs text-[#6B7280] mt-1">
                  <span>0đ</span>
                  <span>50 triệu</span>
                </div>
              </div>

              {/* Area range */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-[#FFB703]" />
                    <span className="text-sm font-medium text-[#1A1A2E]">Diện tích</span>
                  </div>
                  <span className="text-sm text-[#6B7280]">
                    {filters.minDienTich || 0}m² - {filters.maxDienTich || AREA_MAX}m²
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={AREA_MAX}
                  value={filters.maxDienTich || AREA_MAX}
                  onChange={(e) => handleAreaChange([filters.minDienTich || 0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-[#E5E7EB] rounded-lg appearance-none cursor-pointer accent-[#FFB703]"
                />
                <div className="flex justify-between text-xs text-[#6B7280] mt-1">
                  <span>0m²</span>
                  <span>100m²</span>
                </div>
              </div>

              {/* Nearby toggle */}
              <button
                onClick={handleNearbyToggle}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  filters.showOnlyNearby
                    ? 'bg-[#DCFCE7] border-2 border-[#52B788]'
                    : 'bg-[#F0F9FF] border-2 border-transparent hover:border-[#00B4D8]/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    filters.showOnlyNearby ? 'bg-[#52B788]' : 'bg-[#00B4D8]'
                  }`}>
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-[#1A1A2E]">Gần tôi</p>
                    <p className="text-xs text-[#6B7280]">
                      {userLocation ? 'Trong bán kính 5km' : 'Nhấn để bật vị trí'}
                    </p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  filters.showOnlyNearby
                    ? 'bg-[#52B788] border-[#52B788]'
                    : 'border-[#D1D5DB]'
                }`}>
                  {filters.showOnlyNearby && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>

              {/* Sort options */}
              <div>
                <span className="text-sm font-medium text-[#1A1A2E] block mb-2">Sắp xếp theo</span>
                <div className="flex gap-2">
                  {[
                    { value: 'newest' as const, label: 'Mới nhất' },
                    { value: 'price' as const, label: 'Giá' },
                    { value: 'distance' as const, label: 'Khoảng cách', requiresLocation: true },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSortChange(opt.value)}
                      disabled={opt.requiresLocation && !userLocation}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        filters.sortBy === opt.value
                          ? 'bg-[#00B4D8] text-white'
                          : opt.requiresLocation && !userLocation
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset button */}
              <button
                onClick={() => onFiltersChange({
                  minPrice: 0,
                  maxPrice: PRICE_MAX,
                  sortBy: 'newest',
                  showOnlyNearby: false,
                })}
                className="w-full py-2 text-sm text-[#6B7280] hover:text-[#EF4444] transition-colors"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
