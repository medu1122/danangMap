'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, MapPin, Clock, TrendingUp } from 'lucide-react';
import { NhaTro } from '@/types';

interface SearchBoxProps {
  troList: NhaTro[];
  onSearch: (query: string, results: NhaTro[]) => void;
  placeholder?: string;
}

interface SearchSuggestion {
  type: 'tro' | 'district' | 'recent';
  text: string;
  tro?: NhaTro;
}

// Common districts in Da Nang
const DISTRICTS = [
  'Hải Châu',
  'Thanh Khê',
  'Sơn Trà',
  'Ngũ Hành Sơn',
  'Liên Chiểu',
  'Cẩm Lệ',
  'Hòa Vang',
];

export default function SearchBox({ troList, onSearch, placeholder = 'Tìm kiếm nhà trọ...' }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('troSearchRecent');
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save to recent searches
  const saveToRecent = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    try {
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('troSearchRecent', JSON.stringify(updated));
    } catch {
      // Ignore localStorage errors
    }
  }, [recentSearches]);

  // Generate suggestions based on query
  useEffect(() => {
    if (!query.trim()) {
      // Show recent searches when no query
      setSuggestions(recentSearches.map(text => ({ type: 'recent', text })));
      return;
    }

    const q = query.toLowerCase();
    const results: SearchSuggestion[] = [];

    // Search in listing titles
    const matchedTros = troList
      .filter(tro => 
        tro.tieu_de.toLowerCase().includes(q) ||
        tro.dia_chi?.toLowerCase().includes(q) ||
        tro.mo_ta?.toLowerCase().includes(q)
      )
      .slice(0, 5);

    matchedTros.forEach(tro => {
      results.push({
        type: 'tro',
        text: tro.tieu_de,
        tro,
      });
    });

    // Search in districts
    const matchedDistricts = DISTRICTS.filter(d => 
      d.toLowerCase().includes(q)
    );
    
    matchedDistricts.forEach(district => {
      results.push({
        type: 'district',
        text: district,
      });
    });

    setSuggestions(results);
    setSelectedIndex(-1);
  }, [query, troList, recentSearches]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(suggestions[selectedIndex]);
        } else if (query.trim()) {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setIsOpen(false);

    if (suggestion.type === 'tro' && suggestion.tro) {
      onSearch(suggestion.text, [suggestion.tro]);
    } else if (suggestion.type === 'district') {
      // Filter all tro in that district
      const filtered = troList.filter(tro => 
        tro.dia_chi?.toLowerCase().includes(suggestion.text.toLowerCase())
      );
      onSearch(suggestion.text, filtered);
    } else {
      // Recent search - perform full search
      handleSearch();
    }

    saveToRecent(suggestion.text);
  };

  const handleSearch = () => {
    if (!query.trim()) return;

    saveToRecent(query);

    // Search all matching tro
    const q = query.toLowerCase();
    const results = troList.filter(tro => 
      tro.tieu_de.toLowerCase().includes(q) ||
      tro.dia_chi?.toLowerCase().includes(q) ||
      tro.mo_ta?.toLowerCase().includes(q)
    );

    onSearch(query, results);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    onSearch('', troList);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('troSearchRecent');
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 bg-white rounded-2xl shadow-lg border border-gray-100 focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none transition-all text-gray-900 placeholder-gray-400"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <motion.button
          onClick={handleSearch}
          className="absolute right-1 top-1 bottom-1 px-4 bg-gradient-to-r from-[#00B4D8] to-[#52B788] text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Tìm
        </motion.button>
      </div>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {isOpen && (suggestions.length > 0 || query.trim() === '') && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[1000]"
          >
            {/* Recent searches header */}
            {query.trim() === '' && recentSearches.length > 0 && (
              <div className="px-4 py-2 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Tìm kiếm gần đây</span>
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-[#00B4D8] hover:underline"
                >
                  Xóa
                </button>
              </div>
            )}

            {/* Suggestions list */}
            <ul className="max-h-80 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <li key={`${suggestion.type}-${suggestion.text}`}>
                  <button
                    onClick={() => handleSelect(suggestion)}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                      selectedIndex === index ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      suggestion.type === 'tro' ? 'bg-[#00B4D8]/10' :
                      suggestion.type === 'district' ? 'bg-[#52B788]/10' :
                      'bg-gray-100'
                    }`}>
                      {suggestion.type === 'tro' && <MapPin className="w-4 h-4 text-[#00B4D8]" />}
                      {suggestion.type === 'district' && <TrendingUp className="w-4 h-4 text-[#52B788]" />}
                      {suggestion.type === 'recent' && <Clock className="w-4 h-4 text-gray-400" />}
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`font-medium ${
                        suggestion.type === 'tro' ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {suggestion.text}
                      </p>
                      {suggestion.type === 'tro' && suggestion.tro && (
                        <p className="text-sm text-gray-500">
                          {suggestion.tro.dia_chi} • {suggestion.tro.gia_thang.toLocaleString('vi-VN')}đ/tháng
                        </p>
                      )}
                      {suggestion.type === 'district' && (
                        <p className="text-sm text-gray-500">Quận/huyện</p>
                      )}
                    </div>
                    {suggestion.type === 'tro' && suggestion.tro && (
                      <div className="text-sm font-medium text-[#52B788]">
                        {suggestion.tro.gia_thang.toLocaleString('vi-VN')}đ
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {/* Search all results */}
            {query.trim() && suggestions.length > 0 && (
              <div className="border-t px-4 py-2">
                <button
                  onClick={handleSearch}
                  className="w-full py-2 text-sm text-[#00B4D8] hover:bg-[#00B4D8]/5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Xem tất cả kết quả cho "{query}"</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
