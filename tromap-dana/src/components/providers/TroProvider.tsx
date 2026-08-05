'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface ChuTro {
  id: string;
  ten: string;
  sdt: string | null;
  zalo: string | null;
  facebook_url: string | null;
}

interface NhaTro {
  id: string;
  chu_tro_id: string;
  tieu_de: string;
  mo_ta: string | null;
  gia_thang: number;
  dien_tich: number | null;
  dia_chi: string | null;
  lat: number;
  lng: number;
  facebook_url: string;
  trang_thai: string;
  luot_xem: number;
  ngay_tao: string;
  ngay_cap_nhat: string;
  chu_tro?: ChuTro;
}

interface QuangCao {
  id: string;
  ten_nguoi_dang: string;
  tieu_de: string;
  noi_dung: string | null;
  hinh_anh: string | null;
  lien_ket: string | null;
  vi_tri: string;
  trang_thai: string;
  luot_xem: number;
  luot_click: number;
}

interface TroData {
  nha_tro: NhaTro[];
  quang_cao: QuangCao[];
  cached_at: string;
}

interface NewDataNotification {
  hasNew: boolean;
  count: number;
  message: string;
}

interface TroContextType {
  data: TroData | null;
  loading: boolean;
  error: string | null;
  newDataNotification: NewDataNotification | null;
  refetch: () => void;
  dismissNotification: () => void;
}

const TroContext = createContext<TroContextType>({
  data: null,
  loading: true,
  error: null,
  newDataNotification: null,
  refetch: () => {},
  dismissNotification: () => {},
});

export function useTroData() {
  return useContext(TroContext);
}

interface TroProviderProps {
  children: ReactNode;
}

const POLL_INTERVAL = 10000; // 10 seconds
const CHECK_ENDPOINT = '/api/tro/check';
const DATA_ENDPOINT = '/api/tro';

export function TroProvider({ children }: TroProviderProps) {
  const [data, setData] = useState<TroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newDataNotification, setNewDataNotification] = useState<NewDataNotification | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  // Fetch full data from API
  const fetchData = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (isFetching) return;
    
    setIsFetching(true);
    try {
      const res = await fetch(DATA_ENDPOINT, { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch');
      const json: TroData = await res.json();
      
      // Check if data is actually new
      if (data && json.cached_at !== data.cached_at) {
        const newCount = json.nha_tro.length - (data.nha_tro?.length || 0);
        if (newCount > 0) {
          setNewDataNotification({
            hasNew: true,
            count: newCount,
            message: `Có ${newCount} tin trọ mới!`,
          });
        } else if (newCount < 0) {
          setNewDataNotification({
            hasNew: true,
            count: Math.abs(newCount),
            message: `${Math.abs(newCount)} tin trọ đã được cập nhật!`,
          });
        }
      }
      
      setData(json);
      setLastUpdateTime(json.cached_at);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsFetching(false);
      setLoading(false);
    }
  }, [data, isFetching]);

  // Lightweight poll to check for updates
  const checkForUpdates = useCallback(async () => {
    if (!data || isFetching) return; // Don't poll if no data yet or currently fetching

    try {
      const res = await fetch(CHECK_ENDPOINT, { cache: 'no-store' });
      if (!res.ok) return;
      
      const result = await res.json();
      
      // If server has newer data than what we have
      if (result.latest_update && lastUpdateTime && result.latest_update !== lastUpdateTime) {
        // Trigger full fetch
        fetchData();
      }
    } catch (err) {
      // Silent fail for polling
      console.debug('Poll check failed:', err);
    }
  }, [data, isFetching, lastUpdateTime, fetchData]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Set up polling
  useEffect(() => {
    const pollInterval = setInterval(checkForUpdates, POLL_INTERVAL);
    return () => clearInterval(pollInterval);
  }, [checkForUpdates]);

  const dismissNotification = useCallback(() => {
    setNewDataNotification(null);
  }, []);

  return (
    <TroContext.Provider value={{ 
      data, 
      loading, 
      error, 
      newDataNotification, 
      refetch: fetchData, 
      dismissNotification 
    }}>
      {children}
    </TroContext.Provider>
  );
}
