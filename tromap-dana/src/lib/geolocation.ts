'use client';

import { useState, useEffect, useCallback } from 'react';
import { DANANG_BOUNDS, UserLocation, GeoStatus } from '@/types';
import { isWithinDanang } from '@/lib/utils';

interface UseGeolocationResult {
  location: UserLocation | null;
  status: GeoStatus;
  error: string | null;
  requestLocation: () => void;
  isWithinDanang: boolean;
}

export function useGeolocation(): UseGeolocationResult {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [status, setStatus] = useState<GeoStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setStatus('unavailable');
      setError('Trình duyệt không hỗ trợ định vị');
      return;
    }

    setStatus('requesting');
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const withinBounds = isWithinDanang(latitude, longitude, DANANG_BOUNDS);
        
        setLocation({
          lat: latitude,
          lng: longitude,
          withinDanang: withinBounds,
        });
        setStatus('granted');
      },
      (err) => {
        setStatus('denied');
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Bạn đã từ chối quyền truy cập vị trí');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Không thể xác định vị trí');
            break;
          case err.TIMEOUT:
            setError('Yêu cầu vị trí đã hết thời gian');
            break;
          default:
            setError('Đã xảy ra lỗi khi lấy vị trí');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  }, []);

  return {
    location,
    status,
    error,
    requestLocation,
    isWithinDanang: location?.withinDanang ?? false,
  };
}

// Danang bounds checker utility
export function isUserInDanang(lat: number, lng: number): boolean {
  return isWithinDanang(lat, lng, DANANG_BOUNDS);
}

// Get Danang center
export function getDanangCenter() {
  return {
    lat: 16.0544,
    lng: 108.2022,
  };
}
