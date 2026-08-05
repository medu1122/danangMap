'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  X,
  Image,
  Link as LinkIcon,
  Calendar,
  Eye,
  MousePointer,
  ToggleLeft,
  ToggleRight,
  Search,
  Check,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/providers/ToastProvider';

interface QuangCao {
  id: string;
  ten_nguoi_dang: string;
  tieu_de: string;
  noi_dung?: string;
  hinh_anh?: string;
  lien_ket?: string;
  vi_tri: 'banner' | 'sidebar' | 'popup';
  trang_thai: 'active' | 'inactive';
  ngay_bat_dau?: string;
  ngay_ket_thuc?: string;
  luot_xem: number;
  luot_click: number;
  ngay_tao: string;
}

interface AdFormData {
  ten_nguoi_dang: string;
  tieu_de: string;
  noi_dung: string;
  hinh_anh: string;
  lien_ket: string;
  vi_tri: 'banner' | 'sidebar' | 'popup';
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  trang_thai: 'active' | 'inactive';
}

const initialFormData: AdFormData = {
  ten_nguoi_dang: '',
  tieu_de: '',
  noi_dung: '',
  hinh_anh: '',
  lien_ket: '',
  vi_tri: 'banner',
  ngay_bat_dau: '',
  ngay_ket_thuc: '',
  trang_thai: 'active',
};

const VI_TRI_OPTIONS = [
  { value: 'banner', label: 'Banner (Đầu trang)' },
  { value: 'sidebar', label: 'Sidebar (Thanh bên)' },
  { value: 'popup', label: 'Popup (Cửa sổ bật lên)' },
];

export default function QuangCaoPage() {
  const { showToast } = useToast();
  
  const [ads, setAds] = useState<QuangCao[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAd, setEditingAd] = useState<QuangCao | null>(null);
  const [formData, setFormData] = useState<AdFormData>(initialFormData);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchAds = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('quang_cao')
        .select('*')
        .order('ngay_tao', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (error) {
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  const handleOpenModal = (ad?: QuangCao) => {
    if (ad) {
      setEditingAd(ad);
      setFormData({
        ten_nguoi_dang: ad.ten_nguoi_dang,
        tieu_de: ad.tieu_de,
        noi_dung: ad.noi_dung || '',
        hinh_anh: ad.hinh_anh || '',
        lien_ket: ad.lien_ket || '',
        vi_tri: ad.vi_tri,
        ngay_bat_dau: ad.ngay_bat_dau ? ad.ngay_bat_dau.split('T')[0] : '',
        ngay_ket_thuc: ad.ngay_ket_thuc ? ad.ngay_ket_thuc.split('T')[0] : '',
        trang_thai: ad.trang_thai,
      });
    } else {
      setEditingAd(null);
      setFormData(initialFormData);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAd(null);
    setFormData(initialFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData = {
        ten_nguoi_dang: formData.ten_nguoi_dang,
        tieu_de: formData.tieu_de,
        noi_dung: formData.noi_dung || null,
        hinh_anh: formData.hinh_anh || null,
        lien_ket: formData.lien_ket || null,
        vi_tri: formData.vi_tri,
        trang_thai: formData.trang_thai,
        ngay_bat_dau: formData.ngay_bat_dau || null,
        ngay_ket_thuc: formData.ngay_ket_thuc || null,
      };

      if (editingAd) {
        const { error } = await supabase
          .from('quang_cao')
          .update(submitData)
          .eq('id', editingAd.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('quang_cao')
          .insert([submitData]);

        if (error) throw error;
      }

      handleCloseModal();
      fetchAds();
      showToast('Lưu quảng cáo thành công!', 'success');
    } catch (error) {
      console.error('Error saving ad:', error);
      showToast('Đã xảy ra lỗi khi lưu quảng cáo', 'error');
    }
  };

  const handleToggleStatus = async (ad: QuangCao) => {
    try {
      const newStatus = ad.trang_thai === 'active' ? 'inactive' : 'active';
      const { error } = await supabase
        .from('quang_cao')
        .update({ trang_thai: newStatus })
        .eq('id', ad.id);

      if (error) throw error;
      fetchAds();
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quang_cao')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDeleteConfirm(null);
      fetchAds();
      showToast('Xóa quảng cáo thành công!', 'success');
    } catch (error) {
      console.error('Error deleting ad:', error);
      showToast('Đã xảy ra lỗi khi xóa quảng cáo', 'error');
    }
  };

  const filteredAds = ads.filter((ad) => {
    const matchesSearch =
      ad.tieu_de.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.ten_nguoi_dang.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || ad.trang_thai === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getViTriLabel = (viTri: string) => {
    const option = VI_TRI_OPTIONS.find((o) => o.value === viTri);
    return option ? option.label : viTri;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Quảng Cáo</h1>
          <p className="text-gray-500 mt-1">
            Quản lý các quảng cáo trên TroMapDana
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00B4D8] to-[#52B788] text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          Thêm quảng cáo
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Tổng quảng cáo</p>
          <p className="text-2xl font-bold text-gray-900">{ads.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Đang hiển thị</p>
          <p className="text-2xl font-bold text-green-600">
            {ads.filter((a) => a.trang_thai === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Tổng lượt xem</p>
          <p className="text-2xl font-bold text-[#00B4D8]">
            {ads.reduce((sum, a) => sum + a.luot_xem, 0)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-sm text-gray-500">Tổng lượt click</p>
          <p className="text-2xl font-bold text-[#F59E0B]">
            {ads.reduce((sum, a) => sum + a.luot_click, 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none bg-white"
        >
          <option value="all">Tất cả</option>
          <option value="active">Đang hiển thị</option>
          <option value="inactive">Đã ẩn</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-[#00B4D8] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-2 text-gray-500">Đang tải...</p>
          </div>
        ) : filteredAds.length === 0 ? (
          <div className="p-8 text-center">
            <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Chưa có quảng cáo nào</p>
            <button
              onClick={() => handleOpenModal()}
              className="mt-3 text-[#00B4D8] hover:underline"
            >
              Thêm quảng cáo đầu tiên
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                    Quảng cáo
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                    Vị trí
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                    Trạng thái
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                    Thống kê
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAds.map((ad) => (
                  <tr key={ad.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {ad.hinh_anh ? (
                          <img
                            src={ad.hinh_anh}
                            alt={ad.tieu_de}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Image className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{ad.tieu_de}</p>
                          <p className="text-sm text-gray-500">{ad.ten_nguoi_dang}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                        {getViTriLabel(ad.vi_tri)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(ad)}
                        className={`flex items-center gap-2 ${
                          ad.trang_thai === 'active'
                            ? 'text-green-600'
                            : 'text-gray-400'
                        }`}
                      >
                        {ad.trang_thai === 'active' ? (
                          <ToggleRight className="w-6 h-6" />
                        ) : (
                          <ToggleLeft className="w-6 h-6" />
                        )}
                        <span className="text-sm">
                          {ad.trang_thai === 'active' ? 'Hiển thị' : 'Ẩn'}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1 text-gray-500">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">{ad.luot_xem}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <MousePointer className="w-4 h-4" />
                          <span className="text-sm">{ad.luot_click}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(ad)}
                          className="p-2 text-gray-400 hover:text-[#00B4D8] hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        {deleteConfirm === ad.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDelete(ad.id)}
                              className="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(ad.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-bold text-gray-900">
                  {editingAd ? 'Sửa quảng cáo' : 'Thêm quảng cáo mới'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên người đăng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.ten_nguoi_dang}
                      onChange={(e) =>
                        setFormData({ ...formData, ten_nguoi_dang: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none"
                      placeholder="Công ty ABC"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tiêu đề <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.tieu_de}
                      onChange={(e) =>
                        setFormData({ ...formData, tieu_de: e.target.value })
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none"
                      placeholder="Quảng cáo dịch vụ"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nội dung
                  </label>
                  <textarea
                    value={formData.noi_dung}
                    onChange={(e) =>
                      setFormData({ ...formData, noi_dung: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none resize-none"
                    placeholder="Mô tả quảng cáo..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link hình ảnh
                  </label>
                  <div className="relative">
                    <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={formData.hinh_anh}
                      onChange={(e) =>
                        setFormData({ ...formData, hinh_anh: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link đích
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      value={formData.lien_ket}
                      onChange={(e) =>
                        setFormData({ ...formData, lien_ket: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vị trí <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.vi_tri}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          vi_tri: e.target.value as typeof formData.vi_tri,
                        })
                      }
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none bg-white"
                    >
                      {VI_TRI_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      value={formData.trang_thai}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          trang_thai: e.target.value as typeof formData.trang_thai,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none bg-white"
                    >
                      <option value="active">Hiển thị</option>
                      <option value="inactive">Ẩn</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày bắt đầu
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={formData.ngay_bat_dau}
                        onChange={(e) =>
                          setFormData({ ...formData, ngay_bat_dau: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày kết thúc
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={formData.ngay_ket_thuc}
                        onChange={(e) =>
                          setFormData({ ...formData, ngay_ket_thuc: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </form>

              <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSubmit as any}
                  className="px-6 py-2 bg-gradient-to-r from-[#00B4D8] to-[#52B788] text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                >
                  {editingAd ? 'Lưu thay đổi' : 'Thêm quảng cáo'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
