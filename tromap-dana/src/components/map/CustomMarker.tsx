'use client';

import { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface CustomMarkerProps {
  position: [number, number];
  icon?: L.DivIcon;
  children?: React.ReactNode;
  onClick?: () => void;
}

export function createHomeIcon(isActive = true): L.DivIcon {
  const color = isActive ? '#52B788' : '#6B7280';
  const bgColor = isActive ? '#DCFCE7' : '#F3F4F6';

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-container" style="
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
      ">
        <div style="
          background: ${bgColor};
          border: 3px solid ${color};
          border-radius: 50%;
          padding: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          animation: markerBounce 0.6s ease-out;
        ">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 9.5L12 4L21 9.5V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9.5Z" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="${bgColor}"/>
            <path d="M9 22V12H15V22" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 10px solid ${color};
          margin-top: -2px;
        "></div>
      </div>
    `,
    iconSize: [50, 60],
    iconAnchor: [25, 60],
    popupAnchor: [0, -55],
  });
}

export function createClusterIcon(count: number): L.DivIcon {
  let bgColor = '#00B4D8';
  if (count > 20) bgColor = '#52B788';
  if (count > 50) bgColor = '#FFB703';

  return L.divIcon({
    className: 'cluster-marker',
    html: `
      <div style="
        background: ${bgColor};
        color: white;
        border-radius: 50%;
        width: 44px;
        height: 44px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border: 3px solid white;
        animation: clusterPop 0.4s ease-out;
      ">
        ${count > 99 ? '99+' : count}
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

// Inject keyframes for marker animations
export function injectMarkerStyles() {
  if (typeof document === 'undefined') return;
  
  const styleId = 'marker-animations';
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    @keyframes markerBounce {
      0% { transform: translateY(-30px); opacity: 0; }
      60% { transform: translateY(5px); }
      80% { transform: translateY(-3px); }
      100% { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes clusterPop {
      0% { transform: scale(0); }
      70% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    
    @keyframes markerPulse {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(82, 183, 136, 0.7); }
      70% { transform: scale(1.1); box-shadow: 0 0 0 15px rgba(82, 183, 136, 0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(82, 183, 136, 0); }
    }
    
    .custom-marker:hover .marker-container > div:first-child {
      animation: markerPulse 0.8s ease-out;
    }
    
    .leaflet-popup-content-wrapper {
      border-radius: 16px !important;
      padding: 0 !important;
      overflow: hidden;
    }
    
    .leaflet-popup-content {
      margin: 0 !important;
      min-width: 200px;
    }
    
    .leaflet-popup-tip {
      background: white;
    }
  `;
  document.head.appendChild(style);
}

export default function CustomMarker({ position, onClick }: CustomMarkerProps) {
  const markerRef = useRef<L.Marker | null>(null);
  const map = useRef<L.Map | null>(null);

  useEffect(() => {
    injectMarkerStyles();
  }, []);

  return null; // This is a placeholder for the hook pattern
}

// Hook to create and manage markers
export function useMarkers(
  map: L.Map | null,
  positions: Array<{ id: string; lat: number; lng: number; isActive?: boolean }>,
  onMarkerClick?: (id: string) => void
) {
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());

    // Create new markers
    positions.forEach((pos, index) => {
      const icon = createHomeIcon(pos.isActive !== false);
      const marker = L.marker([pos.lat, pos.lng], { icon })
        .addTo(map)
        .on('click', () => onMarkerClick?.(pos.id));

      // Stagger animation
      const el = marker.getElement();
      if (el) {
        el.style.animationDelay = `${index * 50}ms`;
        el.style.animation = 'markerBounce 0.6s ease-out forwards';
      }

      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [map, positions, onMarkerClick]);

  return markersRef.current;
}
