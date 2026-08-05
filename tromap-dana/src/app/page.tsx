'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import LoadingScreen from '@/components/loading/LoadingScreen';
import FilterPanel from '@/components/ui/FilterPanel';
import AdBanner from '@/components/ads/AdBanner';
import DetailModal from '@/components/modal/DetailModal';
import SearchBox from '@/components/search/SearchBox';
import TroChatbot from '@/components/chat/TroChatbot';
import { useGeolocation } from '@/lib/geolocation';
import { supabase } from '@/lib/supabase';
import { NhaTroWithDistance, FilterState, NhaTro } from '@/types';
import { calculateDistance } from '@/lib/utils';
import { addToHistory } from '@/lib/history';
import { toggleFavorite, isFavorite as checkIsFavorite } from '@/lib/favorites';
import { MapPin, RefreshCw, AlertCircle, Info, Heart, Search, X } from 'lucide-react';

// Dynamic import MapView to avoid SSR issues
const MapView = dynamic(() => import('@/components/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gradient-to-b from-sky-100 to-sky-200 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00B4D8] border-t-transparent mx-auto mb-4"></div>
        <p className="text-[#00B4D8] font-medium">Đang tải bản đồ...</p>
      </div>
    </div>
  ),
});

const PRICE_MAX = 50000000;

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [troList, setTroList] = useState<NhaTro[]>([]);
  const [selectedTro, setSelectedTro] = useState<NhaTroWithDistance | null>(null);
  const [showOutOfBounds, setShowOutOfBounds] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<NhaTro[] | null>(null);
  
  const { location, status, requestLocation } = useGeolocation();
  
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: PRICE_MAX,
    sortBy: 'newest',
    showOnlyNearby: false,
  });

  // Fetch tro list from Supabase
  const fetchTroList = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('nha_tro')
        .select('*')
        .eq('trang_thai', 'active');
      
      if (error) throw error;
      setTroList(data || []);
    } catch (error) {
      console.error('Error fetching tro list:', error);
      // Use mock data if Supabase not configured
      setTroList(MOCK_TRO_LIST);
    }
  }, []);

  useEffect(() => {
    fetchTroList();
  }, [fetchTroList]);

  // Check user location
  useEffect(() => {
    if (location && !location.withinDanang) {
      setShowOutOfBounds(true);
    }
  }, [location]);

  // Process tro list with distance
  const troListWithDistance = useMemo((): NhaTroWithDistance[] => {
    return troList.map((tro) => ({
      ...tro,
      distance: location
        ? calculateDistance(location.lat, location.lng, tro.lat, tro.lng)
        : undefined,
    }));
  }, [troList, location]);

  // Handle tro selection - add to history
  const handleTroClick = useCallback((tro: NhaTroWithDistance) => {
    setSelectedTro(tro);
    addToHistory(tro);
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleRequestLocation = useCallback(() => {
    requestLocation();
  }, [requestLocation]);

  // Toggle favorite
  const handleToggleFavorite = useCallback((tro: NhaTroWithDistance) => {
    toggleFavorite(tro);
    // Force re-render to update favorite state
    setSelectedTro(prev => prev ? { ...prev } : null);
  }, []);

  // Check if current tro is favorite
  const isCurrentFavorite = useMemo(() => {
    return selectedTro ? checkIsFavorite(selectedTro.id) : false;
  }, [selectedTro]);

  // Handle search
  const handleSearch = useCallback((query: string, results: NhaTro[]) => {
    if (query && results.length > 0) {
      setSearchResults(results);
      setShowSearch(false);
    }
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchResults(null);
  }, []);

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  // Use search results or full list for display
  const displayList = searchResults || troListWithDistance;

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Out of bounds warning */}
      <AnimatePresence>
        {showOutOfBounds && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="absolute top-0 left-0 right-0 z-[9999] bg-[#FFB703] text-[#1A1A2E] px-4 py-3"
          >
            <div className="flex items-center justify-between max-w-lg mx-auto">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">
                  Vị trí của bạn nằm ngoài Đà Nẵng. Map hiển thị toàn bộ khu vực Đà Nẵng.
                </p>
              </div>
              <button
                onClick={() => setShowOutOfBounds(false)}
                className="p-1 hover:bg-white/20 rounded"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Ad Banner */}
      <div className="absolute top-0 left-0 right-0 z-[1001] p-2 hidden md:block">
        <AdBanner position="top" />
      </div>

      {/* Search Bar */}
      <div className="absolute top-[60px] left-4 right-4 z-[1002] flex gap-2">
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="p-3 bg-white rounded-2xl shadow-lg hover:bg-gray-50 transition-colors"
        >
          <Search className={`w-5 h-5 ${showSearch ? 'text-[#00B4D8]' : 'text-gray-600'}`} />
        </button>
        
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1"
            >
              <SearchBox
                troList={troList}
                onSearch={handleSearch}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search results indicator */}
        <AnimatePresence>
          {searchResults && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={clearSearch}
              className="flex items-center gap-2 px-4 bg-[#00B4D8] text-white rounded-2xl shadow-lg hover:bg-[#0096B4] transition-colors"
            >
              <X className="w-5 h-5" />
              <span className="font-medium">{searchResults.length} kết quả</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Main Map */}
      <div className="w-full h-full pt-[120px] md:pt-[130px]">
        <MapView
          troList={displayList}
          userLocation={location}
          filters={filters}
          onTroClick={handleTroClick}
        />
      </div>

      {/* Filter Panel */}
      <FilterPanel
        filters={filters}
        onFiltersChange={setFilters}
        userLocation={location}
        onRequestLocation={handleRequestLocation}
      />

      {/* Location indicator */}
      <div className="absolute top-4 right-4 z-[1000]">
        <motion.button
          onClick={requestLocation}
          className={`p-3 rounded-full shadow-lg transition-all ${
            status === 'granted'
              ? 'bg-[#52B788] text-white'
              : status === 'requesting'
              ? 'bg-[#FFB703] text-white animate-pulse'
              : 'bg-white text-[#00B4D8] hover:bg-[#F0F9FF]'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={status === 'requesting'}
        >
          {status === 'requesting' ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <MapPin className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      {/* Location status */}
      {status === 'denied' && (
        <div className="absolute bottom-32 left-4 right-4 md:left-auto md:right-[340px] z-[1000]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg flex items-start gap-3"
          >
            <Info className="w-5 h-5 text-[#FFB703] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-[#1A1A2E]">
                Không thể truy cập vị trí
              </p>
              <p className="text-xs text-[#6B7280] mt-1">
                Vui lòng bật định vị trong cài đặt trình duyệt để sử dụng tính năng &quot;Gần tôi&quot;
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer disclaimer */}
      <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white/90 backdrop-blur-sm border-t border-gray-200 px-4 py-2 hidden md:block">
        <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-[#6B7280]">
          <p className="flex items-center gap-1">
            <Info className="w-3 h-3" />
            Thông tin chỉ mang tính tham khảo. Vui lòng liên hệ trực tiếp qua Facebook.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-[#00B4D8]">Giới thiệu</Link>
            <Link href="/contact" className="hover:text-[#00B4D8]">Liên hệ</Link>
            <p>© 2026 TroMapDana</p>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <DetailModal
        tro={selectedTro}
        isOpen={!!selectedTro}
        onClose={() => setSelectedTro(null)}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={isCurrentFavorite}
      />

      {/* AI Chatbot */}
      <TroChatbot
        troList={troList}
        onTroSelect={(tro) => {
          const troWithDistance: NhaTroWithDistance = {
            ...tro,
            distance: location
              ? calculateDistance(location.lat, location.lng, tro.lat, tro.lng)
              : undefined,
          };
          setSelectedTro(troWithDistance);
        }}
      />
    </div>
  );
}

// Mock data for development (when Supabase is not configured)
const MOCK_TRO_LIST: NhaTro[] = [
  {
    id: '1',
    chu_tro_id: 'ct1',
    tieu_de: 'Phòng trọ sinh viên gần ĐH Bách Khoa',
    mo_ta: 'Phòng trọ sạch sẽ, yên tĩnh, gần trường ĐH Bách Khoa Đà Nẵng. Có wifi, nước nóng, camera an ninh.',
    gia_thang: 2500000,
    dien_tich: 25,
    dia_chi: '123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
    lat: 16.0544,
    lng: 108.2022,
    facebook_url: 'https://facebook.com/example',
    trang_thai: 'active',
    luot_xem: 156,
    ngay_tao: '2026-07-20T10:00:00Z',
    ngay_cap_nhat: '2026-07-28T10:00:00Z',
  },
  {
    id: '2',
    chu_tro_id: 'ct2',
    tieu_de: 'Nhà trọ cao cấp quận Sơn Trà',
    mo_ta: 'Nhà trọ mới xây, đầy đủ tiện nghi, gần biển Mỹ An. Phù hợp cho sinh viên và người đi làm.',
    gia_thang: 4500000,
    dien_tich: 35,
    dia_chi: '456 Võ Nguyên Giáp, Sơn Trà, Đà Nẵng',
    lat: 16.0615,
    lng: 108.2455,
    facebook_url: 'https://facebook.com/example2',
    trang_thai: 'active',
    luot_xem: 234,
    ngay_tao: '2026-07-22T10:00:00Z',
    ngay_cap_nhat: '2026-07-28T10:00:00Z',
  },
  {
    id: '3',
    chu_tro_id: 'ct3',
    tieu_de: 'Phòng trọ giá rẻ quận Thanh Khê',
    mo_ta: 'Phòng trọ giá rẻ, phù hợp sinh viên. Gần chợ, siêu thị, tiện đi lại.',
    gia_thang: 1500000,
    dien_tich: 20,
    dia_chi: '789 Lê Đình Lương, Thanh Khê, Đà Nẵng',
    lat: 16.0625,
    lng: 108.1780,
    facebook_url: 'https://facebook.com/example3',
    trang_thai: 'active',
    luot_xem: 89,
    ngay_tao: '2026-07-25T10:00:00Z',
    ngay_cap_nhat: '2026-07-28T10:00:00Z',
  },
  {
    id: '4',
    chu_tro_id: 'ct4',
    tieu_de: 'Căn hộ mini gần trung tâm',
    mo_ta: 'Căn hộ mini full nội thất, có gác, gần trung tâm quận Hải Châu. An ninh tốt, có thang máy.',
    gia_thang: 6000000,
    dien_tich: 40,
    dia_chi: '101 Trần Phú, Hải Châu, Đà Nẵng',
    lat: 16.0680,
    lng: 108.2200,
    facebook_url: 'https://facebook.com/example4',
    trang_thai: 'active',
    luot_xem: 312,
    ngay_tao: '2026-07-15T10:00:00Z',
    ngay_cap_nhat: '2026-07-28T10:00:00Z',
  },
  {
    id: '5',
    chu_tro_id: 'ct5',
    tieu_de: 'Phòng trọ sinh viên Liên Chiểu',
    mo_ta: 'Phòng trọ gần KCN Hòa Khánh, thuận tiện cho sinh viên ĐH Sư Phạm, ĐH Bà Rịa.',
    gia_thang: 1800000,
    dien_tich: 22,
    dia_chi: '222 Điện Biên Phủ, Liên Chiểu, Đà Nẵng',
    lat: 16.0980,
    lng: 108.1480,
    facebook_url: 'https://facebook.com/example5',
    trang_thai: 'active',
    luot_xem: 67,
    ngay_tao: '2026-07-26T10:00:00Z',
    ngay_cap_nhat: '2026-07-28T10:00:00Z',
  },
  {
    id: '6',
    chu_tro_id: 'ct6',
    tieu_de: 'Studio sang trọng gần Ngũ Hành Sơn',
    mo_ta: 'Studio cao cấp, view núi biển, đầy đủ tiện nghi. Gần cầu tàu, khu du lịch.',
    gia_thang: 8000000,
    dien_tich: 45,
    dia_chi: '55 Võ Văn Kiệt, Ngũ Hành Sơn, Đà Nẵng',
    lat: 16.0030,
    lng: 108.2530,
    facebook_url: 'https://facebook.com/example6',
    trang_thai: 'active',
    luot_xem: 445,
    ngay_tao: '2026-07-10T10:00:00Z',
    ngay_cap_nhat: '2026-07-28T10:00:00Z',
  },
];
