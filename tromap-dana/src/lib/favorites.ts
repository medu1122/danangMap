'use client';

import { NhaTro } from '@/types';

const FAVORITES_KEY = 'troFavorites';

// Types
export interface FavoriteItem {
  tro: NhaTro;
  addedAt: string;
}

// Get all favorites
export function getFavorites(): FavoriteItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Check if a tro is favorited
export function isFavorite(troId: string): boolean {
  const favorites = getFavorites();
  return favorites.some(f => f.tro.id === troId);
}

// Add to favorites
export function addFavorite(tro: NhaTro): void {
  if (typeof window === 'undefined') return;
  
  const favorites = getFavorites();
  
  // Check if already exists
  if (favorites.some(f => f.tro.id === tro.id)) {
    return;
  }
  
  favorites.unshift({
    tro,
    addedAt: new Date().toISOString(),
  });
  
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// Remove from favorites
export function removeFavorite(troId: string): void {
  if (typeof window === 'undefined') return;
  
  const favorites = getFavorites();
  const updated = favorites.filter(f => f.tro.id !== troId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
}

// Toggle favorite
export function toggleFavorite(tro: NhaTro): boolean {
  if (isFavorite(tro.id)) {
    removeFavorite(tro.id);
    return false;
  } else {
    addFavorite(tro);
    return true;
  }
}

// Clear all favorites
export function clearFavorites(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(FAVORITES_KEY);
}

// Get favorites count
export function getFavoritesCount(): number {
  return getFavorites().length;
}

// Get favorites sorted by date
export function getFavoritesByDate(): FavoriteItem[] {
  return getFavorites().sort((a, b) => 
    new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  );
}

// Get favorites sorted by price
export function getFavoritesByPrice(): FavoriteItem[] {
  return getFavorites().sort((a, b) => 
    a.tro.gia_thang - b.tro.gia_thang
  );
}
