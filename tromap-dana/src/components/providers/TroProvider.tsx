'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

interface TroContextType {
  data: TroData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const TroContext = createContext<TroContextType>({
  data: null,
  loading: true,
  error: null,
  refetch: () => {},
});

export function useTroData() {
  return useContext(TroContext);
}

interface TroProviderProps {
  children: ReactNode;
}

export function TroProvider({ children }: TroProviderProps) {
  const [data, setData] = useState<TroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/tro');
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TroContext.Provider value={{ data, loading, error, refetch: fetchData }}>
      {children}
    </TroContext.Provider>
  );
}
