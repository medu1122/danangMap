'use client';

import { NhaTro } from '@/types';

const HISTORY_KEY = 'troViewHistory';
const MAX_HISTORY = 20;

// Types
export interface HistoryItem {
  tro: NhaTro;
  viewedAt: string;
}

// Get all history
export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Add to history
export function addToHistory(tro: NhaTro): void {
  if (typeof window === 'undefined') return;
  
  const history = getHistory();
  
  // Remove if already exists (to update position)
  const filtered = history.filter(h => h.tro.id !== tro.id);
  
  // Add to beginning
  filtered.unshift({
    tro,
    viewedAt: new Date().toISOString(),
  });
  
  // Limit size
  const trimmed = filtered.slice(0, MAX_HISTORY);
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

// Remove from history
export function removeFromHistory(troId: string): void {
  if (typeof window === 'undefined') return;
  
  const history = getHistory();
  const updated = history.filter(h => h.tro.id !== troId);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
}

// Clear all history
export function clearHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_KEY);
}

// Get history count
export function getHistoryCount(): number {
  return getHistory().length;
}

// Check if tro is in history
export function isInHistory(troId: string): boolean {
  return getHistory().some(h => h.tro.id === troId);
}

// Get history by date
export function getHistoryByDate(): HistoryItem[] {
  return getHistory().sort((a, b) => 
    new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
  );
}

// Get recent history (last 7 days)
export function getRecentHistory(): HistoryItem[] {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return getHistory().filter(h => 
    new Date(h.viewedAt).getTime() > sevenDaysAgo.getTime()
  );
}
