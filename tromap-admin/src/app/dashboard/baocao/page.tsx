'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Download,
  Copy,
  Check,
  Calendar,
  TrendingUp,
  Eye,
  DollarSign,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  formatPrice,
  formatDate,
  formatDateTime,
  DON_GIA_NGAY,
  calculateBaoGia,
  generateBaoGiaContent,
  generateZaloContent,
} from '@/lib/utils';
import { ChuTro, NhaTro, BaoGiaTemplate } from '@/lib/types';
import { useToast } from '@/components/providers/ToastProvider';

export default function BaoCaoPage() {
  const { showToast } = useToast();
  
  const [chuTroList, setChuTroList] = useState<ChuTro[]>([]);
  const [troList, setTroList] = useState<NhaTro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Bao gia form
  const [selectedChuTro, setSelectedChuTro] = useState<ChuTro | null>(null);
  const [soNgay, setSoNgay] = useState(30);
  const [previewContent, setPreviewContent] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [ctRes, troRes] = await Promise.all([
        supabase.from('chu_tro').select('*').order('ten'),
        supabase.from('nha_tro').select('*'),
      ]);

      if (ctRes.error) {
        throw new Error(ctRes.error.message);
      }

      setChuTroList(ctRes.data || []);
      setTroList(troRes.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tongTien = calculateBaoGia(soNgay, DON_GIA_NGAY);

  const handleSelectChuTro = (ct: ChuTro) => {
    setSelectedChuTro(ct);
    setPreviewContent(generateBaoGiaContent(ct.ten, soNgay, DON_GIA_NGAY, tongTien));
  };

  useEffect(() => {
    if (selectedChuTro) {
      setPreviewContent(generateBaoGiaContent(selectedChuTro.ten, soNgay, DON_GIA_NGAY, tongTien));
    }
  }, [soNgay, selectedChuTro, tongTien]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Đã copy!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Stats
  const totalTro = troList.length;
  const activeTro = troList.filter(t => t.trang_thai === 'active').length;
  const avgPrice = troList.length > 0 
    ? troList.reduce((sum, t) => sum + t.gia_thang, 0) / troList.length 
    : 0;

  const tongGiaTri = troList.reduce((sum, t) => sum + t.gia_thang, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#00B4D8] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={fetchData}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
          >
            Thử lại
          </button>
        </motion.div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Báo Cáo & Báo Giá</h1>
        <p className="text-gray-500 mt-1">Thống kê và tạo báo giá dịch vụ</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-gray-500">Tổng nhà trọ</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalTro}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-gray-500">Đang hoạt động</span>
          </div>
          <p className="text-3xl font-bold text-green-600">{activeTro}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-gray-500">Giá trung bình</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{formatPrice(avgPrice)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-gray-500">Tổng giá trị</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{formatPrice(tongGiaTri)}</p>
        </motion.div>
      </div>

      {/* Bao Gia Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chủ trọ list */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#00B4D8]" />
            Tạo Báo Giá
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số ngày quảng cáo
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={soNgay}
                onChange={(e) => setSoNgay(Number(e.target.value))}
                min={1}
                max={365}
                className="w-24 px-3 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:outline-none"
              />
              <span className="text-gray-500">ngày</span>
              <span className="text-[#00B4D8] font-medium">
                = {formatPrice(tongTien)}
              </span>
            </div>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {chuTroList.map((ct) => (
              <button
                key={ct.id}
                onClick={() => handleSelectChuTro(ct)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedChuTro?.id === ct.id
                    ? 'border-[#00B4D8] bg-blue-50'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
              >
                <p className="font-medium text-gray-900">{ct.ten}</p>
                <p className="text-sm text-gray-500">{ct.email || 'Chưa có email'}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Preview */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Xem Trước Báo Giá</h2>
          
          {selectedChuTro ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                  {previewContent}
                </pre>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => copyToClipboard(previewContent, 'baogia')}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#00B4D8] text-white rounded-xl hover:bg-[#0096B4]"
                >
                  {copiedId === 'baogia' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Copy Báo Giá
                </button>
                <button
                  onClick={() => copyToClipboard(
                    generateZaloContent(selectedChuTro.ten, tongTien),
                    'zalo'
                  )}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                >
                  {copiedId === 'zalo' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  Copy Zalo
                </button>
              </div>

              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${selectedChuTro.email || ''}&su=Báo giá dịch vụ TroMapDana&body=${encodeURIComponent(previewContent)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
              >
                <FileText className="w-4 h-4" />
                Gửi qua Email
              </a>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Chọn chủ trọ để xem báo giá</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
