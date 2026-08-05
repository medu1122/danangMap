'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { DANANG_BOUNDS, DANANG_CENTER, NhaTroWithDistance, FilterState } from '@/types';
import { formatPrice, calculateDistance, isWithinDanang } from '@/lib/utils';
import { injectMarkerStyles, createHomeIcon } from './CustomMarker';
import 'leaflet/dist/leaflet.css';

// Dynamic import to avoid SSR issues
const MarkerPopup = dynamic(() => import('./MarkerPopup'), { ssr: false });

interface MapViewProps {
  troList: NhaTroWithDistance[];
  userLocation: { lat: number; lng: number } | null;
  filters: FilterState;
  onTroClick: (tro: NhaTroWithDistance) => void;
  onMapMove?: (center: { lat: number; lng: number }, bounds: typeof DANANG_BOUNDS) => void;
}

// Component to handle map bounds restrictions
function MapBoundsController({ userLocation }: { userLocation: { lat: number; lng: number } | null }) {
  const map = useMap();
  
  useEffect(() => {
    // Set max bounds to Danang area
    const bounds = L.latLngBounds(
      [DANANG_BOUNDS.south - 0.1, DANANG_BOUNDS.west - 0.1],
      [DANANG_BOUNDS.north + 0.1, DANANG_BOUNDS.east + 0.1]
    );
    map.setMaxBounds(bounds);
    
    // Set initial view to Danang center
    map.setView([DANANG_CENTER.lat, DANANG_CENTER.lng], 13);
  }, [map]);

  return null;
}

// Component to add markers
function MarkersLayer({
  troList,
  onTroClick
}: {
  troList: NhaTroWithDistance[];
  onTroClick: (tro: NhaTroWithDistance) => void;
}) {
  const [markers, setMarkers] = useState<L.Marker[]>([]);
  const map = useMap();

  useEffect(() => {
    injectMarkerStyles();
  }, []);

  useEffect(() => {
    // Clear existing markers
    markers.forEach(m => m.remove());
    
    // Create new markers
    const newMarkers = troList.map((tro) => {
      const icon = createHomeIcon(true);
      const marker = L.marker([tro.lat, tro.lng], { icon });
      
      // Create popup
      const popup = L.popup({
        className: 'custom-popup',
        closeButton: true,
        maxWidth: 280,
      }).setContent(`
        <div style="padding: 0;">
          ${MarkerPopup ? '' : `
            <div style="padding: 16px; font-family: 'Quicksand', sans-serif;">
              <h3 style="margin: 0 0 8px; font-size: 16px; font-weight: 600; color: #1A1A2E;">
                ${tro.tieu_de}
              </h3>
              <div style="display: flex; align-items: center; gap: 6px; color: #52B788; font-weight: 600; margin-bottom: 8px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                ${formatPrice(tro.gia_thang)}/tháng
              </div>
              ${tro.dia_chi ? `
                <div style="display: flex; align-items: center; gap: 6px; color: #6B7280; font-size: 13px; margin-bottom: 4px;">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  ${tro.dia_chi}
                </div>
              ` : ''}
              <a 
                href="${tro.facebook_url}" 
                target="_blank" 
                rel="noopener noreferrer"
                style="
                  display: block;
                  margin-top: 12px;
                  padding: 10px 16px;
                  background: #00B4D8;
                  color: white;
                  text-align: center;
                  border-radius: 8px;
                  text-decoration: none;
                  font-weight: 600;
                  font-size: 14px;
                "
              >
                Xem chi tiết trên Facebook
              </a>
            </div>
          `}
        </div>
      `);
      
      marker.bindPopup(popup);
      marker.on('click', () => onTroClick(tro));
      marker.addTo(map);
      
      return marker;
    });
    
    setMarkers(newMarkers);
    
    return () => {
      newMarkers.forEach(m => m.remove());
    };
  }, [troList, map, onTroClick]);

  return null;
}

export default function MapView({ troList, userLocation, filters, onTroClick, onMapMove }: MapViewProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter and sort tro list
  const filteredTroList = useMemo(() => {
    let result = troList.filter((tro) => {
      // Price filter
      if (tro.gia_thang < filters.minPrice || tro.gia_thang > filters.maxPrice) {
        return false;
      }
      
      // Area filter
      if (filters.minDienTich && tro.dien_tich && tro.dien_tich < filters.minDienTich) {
        return false;
      }
      if (filters.maxDienTich && tro.dien_tich && tro.dien_tich > filters.maxDienTich) {
        return false;
      }
      
      // Nearby filter
      if (filters.showOnlyNearby && userLocation) {
        const distance = calculateDistance(userLocation.lat, userLocation.lng, tro.lat, tro.lng);
        if (distance > 5) return false; // Within 5km
      }
      
      return true;
    });

    // Sort
    if (filters.sortBy === 'distance' && userLocation) {
      result.sort((a, b) => {
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
        return distA - distB;
      });
    } else if (filters.sortBy === 'price') {
      result.sort((a, b) => a.gia_thang - b.gia_thang);
    } else {
      // newest first
      result.sort((a, b) => new Date(b.ngay_tao).getTime() - new Date(a.ngay_tao).getTime());
    }

    return result;
  }, [troList, filters, userLocation]);

  if (!isMounted) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-sky-200 to-sky-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#00B4D8] border-t-transparent mx-auto mb-4"></div>
          <p className="text-[#00B4D8] font-medium">Đang tải bản đồ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[DANANG_CENTER.lat, DANANG_CENTER.lng]}
        zoom={13}
        className="w-full h-full"
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapBoundsController userLocation={userLocation} />
        
        <MarkersLayer
          troList={filteredTroList}
          onTroClick={onTroClick}
        />
      </MapContainer>

      {/* Map info overlay */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
        <p className="text-sm font-medium text-[#1A1A2E]">
          <span className="text-[#52B788] font-bold">{filteredTroList.length}</span> nhà trọ
          {filters.showOnlyNearby && userLocation && (
            <span className="text-[#6B7280]"> gần bạn</span>
          )}
        </p>
      </div>

      {/* Danang indicator */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#52B788] animate-pulse"></div>
          <span className="text-xs font-medium text-[#1A1A2E]">Đà Nẵng</span>
        </div>
      </div>
    </div>
  );
}
