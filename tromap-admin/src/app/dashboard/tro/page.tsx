'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MapPin,
  ExternalLink,
  X,
  AlertCircle,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  CheckSquare,
  Square,
  AlertTriangle,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatPrice, formatDate } from '@/lib/utils';
import { NhaTro, ChuTro } from '@/lib/types';
import { nhaTroSchema, formatValidationError } from '@/lib/schemas';

export default function TroManagementPage() {
  const [troList, setTroList] = useState<NhaTro[]>([]);
  const [chuTroList, setChuTroList] = useState<ChuTro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'het_han'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTro, setEditingTro] = useState<NhaTro | null>(null);
  
  // Validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Sorting
  const [sortField, setSortField] = useState<string>('ngay_tao');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  
  const [formData, setFormData] = useState({
    tieu_de: '',
    mo_ta: '',
    gia_thang: 0,
    dien_tich: 0,
    dia_chi: '',
    lat: 16.0544,
    lng: 108.2022,
    facebook_url: '',
    chu_tro_id: '',
    trang_thai: 'active' as 'active' | 'inactive' | 'het_han',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [troRes, chuTroRes] = await Promise.all([
        supabase.from('nha_tro').select('*').order('ngay_tao', { ascending: false }),
        supabase.from('chu_tro').select('*'),
      ]);

      if (troRes.error) {
        throw new Error(troRes.error.message);
      }

      setTroList(troRes.data || []);
      setChuTroList(chuTroRes.data || []);
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

  // Filter and sort
  const filteredTroList = useMemo(() => {
    let result = troList.filter((tro) => {
      const matchesSearch = tro.tieu_de.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tro.dia_chi?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || tro.trang_thai === filterStatus;
      return matchesSearch && matchesStatus;
    });

    // Sort
    result.sort((a, b) => {
      let aVal: any = a[sortField as keyof NhaTro];
      let bVal: any = b[sortField as keyof NhaTro];
      
      if (sortField === 'gia_thang' || sortField === 'luot_xem') {
        aVal = Number(aVal) || 0;
        bVal = Number(bVal) || 0;
      }
      
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [troList, searchTerm, filterStatus, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredTroList.length / itemsPerPage);
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTroList.slice(start, start + itemsPerPage);
  }, [filteredTroList, currentPage, itemsPerPage]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedList.map(t => t.id)));
    }
    setSelectAll(!selectAll);
  };

  // Handle select one
  const handleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
    setSelectAll(newSet.size === paginatedList.length);
  };

  // Export CSV with proper escaping
  const exportCSV = () => {
    const headers = ['ID', 'Tên', 'Chủ trọ', 'Giá', 'Diện tích', 'Địa chỉ', 'Trạng thái', 'Lượt xem', 'Ngày tạo'];
    
    // Safe CSV field - escape quotes and special characters
    const csvField = (v: unknown): string => {
      if (v == null) return '';
      const str = String(v);
      // Escape cells starting with =, +, -, @ to prevent formula injection
      const safe = /^[=+\-@\t\r]/.test(str) ? "'" + str : str;
      // Wrap in quotes and escape internal quotes
      return `"${safe.replace(/"/g, '""')}"`;
    };
    
    const rows = filteredTroList.map(tro => [
      csvField(tro.id),
      csvField(tro.tieu_de),
      csvField(getChuTroName(tro.chu_tro_id)),
      csvField(tro.gia_thang),
      csvField(tro.dien_tich || ''),
      csvField(tro.dia_chi || ''),
      csvField(tro.trang_thai),
      csvField(tro.luot_xem),
      csvField(tro.ngay_tao),
    ]);

    const csv = [headers.map(csvField).join(','), ...rows.map(row => row.join(','))].join('\r\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }); // BOM for Excel
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tro_list_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Bulk delete - single query
  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Xóa ${selectedIds.size} nhà trọ đã chọn?`)) return;
    
    try {
      const { error: deleteError } = await supabase
        .from('nha_tro')
        .delete()
        .in('id', Array.from(selectedIds));
      
      if (deleteError) {
        throw new Error(deleteError.message);
      }
      
      setSelectedIds(new Set());
      setSelectAll(false);
      await fetchData();
    } catch (err) {
      console.error('Bulk delete error:', err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi xóa');
    }
  };

  const handleOpenModal = (tro?: NhaTro) => {
    if (tro) {
      setEditingTro(tro);
      setFormData({
        tieu_de: tro.tieu_de,
        mo_ta: tro.mo_ta || '',
        gia_thang: tro.gia_thang,
        dien_tich: tro.dien_tich || 0,
        dia_chi: tro.dia_chi || '',
        lat: tro.lat,
        lng: tro.lng,
        facebook_url: tro.facebook_url,
        chu_tro_id: tro.chu_tro_id,
        trang_thai: tro.trang_thai,
      });
    } else {
      setEditingTro(null);
      setFormData({
        tieu_de: '',
        mo_ta: '',
        gia_thang: 0,
        dien_tich: 0,
        dia_chi: '',
        lat: 16.0544,
        lng: 108.2022,
        facebook_url: '',
        chu_tro_id: '',
        trang_thai: 'active',
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    setValidationErrors({});
    
    // Validate with Zod
    const result = nhaTroSchema.safeParse(formData);
    
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        if (path && !errors[path]) {
          errors[path] = issue.message;
        }
      });
      setValidationErrors(errors);
      return;
    }

    try {
      if (editingTro) {
        const { error: updateError } = await supabase
          .from('nha_tro')
          .update(formData)
          .eq('id', editingTro.id);
        
        if (updateError) {
          throw new Error(updateError.message);
        }
      } else {
        const { error: insertError } = await supabase.from('nha_tro').insert([formData]);
        
        if (insertError) {
          throw new Error(insertError.message);
        }
      }
      
      await fetchData();
      setShowModal(false);
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi lưu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa nhà trọ này?')) return;
    
    try {
      const { error: deleteError } = await supabase.from('nha_tro').delete().eq('id', id);
      
      if (deleteError) {
        throw new Error(deleteError.message);
      }
      
      // Clear selection if deleted
      setSelectedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      
      await fetchData();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi xóa');
    }
  };

  const getChuTroName = (id: string) => {
    const ct = chuTroList.find(c => c.id === id);
    return ct?.ten || 'Chưa có';
  };

  const statusColors = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-700',
    het_han: 'bg-red-100 text-red-700',
  };

  const statusLabels = {
    active: 'Hoạt động',
    inactive: 'Tạm dừng',
    het_han: 'Hết hạn',
  };

  return (
    <div className="space-y-6">
      {/* Header with bulk actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Nhà Trọ</h1>
          <p className="text-gray-500 mt-1">Tổng cộng {filteredTroList.length} nhà trọ</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 mr-4">
              <span className="text-sm text-gray-500">{selectedIds.size} đã chọn</span>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
                Xóa
              </button>
            </div>
          )}
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
          >
            <Download className="w-5 h-5" />
            Export CSV
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00B4D8] to-[#52B788] text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Thêm nhà trọ
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm tên, địa chỉ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:outline-none"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:outline-none"
        >
          <option value="all">Tất cả</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Tạm dừng</option>
          <option value="het_han">Hết hạn</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 w-12">
                  <button onClick={handleSelectAll} className="text-gray-400 hover:text-gray-600">
                    {selectAll ? <CheckSquare className="w-5 h-5 text-[#00B4D8]" /> : <Square className="w-5 h-5" />}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  <button onClick={() => handleSort('tieu_de')} className="flex items-center gap-1 hover:text-gray-900">
                    Tên nhà trọ
                    {sortField === 'tieu_de' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Chủ trọ</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  <button onClick={() => handleSort('gia_thang')} className="flex items-center gap-1 hover:text-gray-900">
                    Giá
                    {sortField === 'gia_thang' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  <button onClick={() => handleSort('luot_xem')} className="flex items-center gap-1 hover:text-gray-900">
                    Lượt xem
                    {sortField === 'luot_xem' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  <button onClick={() => handleSort('ngay_tao')} className="flex items-center gap-1 hover:text-gray-900">
                    Ngày tạo
                    {sortField === 'ngay_tao' && (sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                  </button>
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedList.map((tro) => (
                <tr key={tro.id} className={`hover:bg-gray-50 ${selectedIds.has(tro.id) ? 'bg-[#00B4D8]/5' : ''}`}>
                  <td className="px-4 py-3">
                    <button onClick={() => handleSelect(tro.id)} className="text-gray-400 hover:text-gray-600">
                      {selectedIds.has(tro.id) ? <CheckSquare className="w-5 h-5 text-[#00B4D8]" /> : <Square className="w-5 h-5" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{tro.tieu_de}</p>
                      <p className="text-sm text-gray-500">{tro.dia_chi || 'Chưa có địa chỉ'}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{getChuTroName(tro.chu_tro_id)}</td>
                  <td className="px-4 py-3 font-medium text-[#52B788]">{formatPrice(tro.gia_thang)}</td>
                  <td className="px-4 py-3 text-gray-600">{tro.luot_xem}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[tro.trang_thai]}`}>
                      {statusLabels[tro.trang_thai]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(tro.ngay_tao)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={tro.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-[#00B4D8] hover:bg-gray-100 rounded-lg"
                        title="Xem Facebook"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleOpenModal(tro)}
                        className="p-2 text-gray-400 hover:text-[#00B4D8] hover:bg-gray-100 rounded-lg"
                        title="Sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tro.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTroList.length === 0 && !loading && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy nhà trọ nào</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
            <p className="text-sm text-gray-500">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredTroList.length)} của {filteredTroList.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium ${
                      currentPage === pageNum
                        ? 'bg-[#00B4D8] text-white'
                        : 'hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
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
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingTro ? 'Sửa nhà trọ' : 'Thêm nhà trọ mới'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhà trọ *</label>
                  <input
                    type="text"
                    value={formData.tieu_de}
                    onChange={(e) => setFormData({ ...formData, tieu_de: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:outline-none"
                    placeholder="VD: Phòng trọ sinh viên gần ĐH Bách Khoa"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá tháng (VNĐ) *</label>
                    <input
                      type="number"
                      value={formData.gia_thang}
                      onChange={(e) => setFormData({ ...formData, gia_thang: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:outline-none"
                      placeholder="2500000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diện tích (m²)</label>
                    <input
                      type="number"
                      value={formData.dien_tich}
                      onChange={(e) => setFormData({ ...formData, dien_tich: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:outline-none"
                      placeholder="25"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                  <input
                    type="text"
                    value={formData.dia_chi}
                    onChange={(e) => setFormData({ ...formData, dia_chi: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:outline-none"
                    placeholder="123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vĩ độ (Lat)</label>
                    <input
                      type="number"
                      step="0.0000001"
                      value={formData.lat}
                      onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kinh độ (Lng)</label>
                    <input
                      type="number"
                      step="0.0000001"
                      value={formData.lng}
                      onChange={(e) => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link Facebook *</label>
                  <input
                    type="url"
                    value={formData.facebook_url}
                    onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:outline-none"
                    placeholder="https://facebook.com/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    value={formData.mo_ta}
                    onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:outline-none resize-none"
                    placeholder="Mô tả về nhà trọ..."
                  />
                </div>

                {editingTro && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                    <select
                      value={formData.trang_thai}
                      onChange={(e) => setFormData({ ...formData, trang_thai: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:outline-none"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Tạm dừng</option>
                      <option value="het_han">Hết hạn</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-[#00B4D8] text-white rounded-xl font-medium hover:bg-[#0096B4]"
                >
                  {editingTro ? 'Lưu thay đổi' : 'Thêm mới'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mock data
const MOCK_TRO_LIST: NhaTro[] = [
  {
    id: '1',
    chu_tro_id: 'ct1',
    tieu_de: 'Phòng trọ sinh viên gần ĐH Bách Khoa',
    mo_ta: 'Phòng trọ sạch sẽ, yên tĩnh, gần trường ĐH Bách Khoa Đà Nẵng.',
    gia_thang: 2500000,
    dien_tich: 25,
    dia_chi: '123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
    lat: 16.0544,
    lng: 108.2022,
    facebook_url: 'https://facebook.com/example',
    trang_thai: 'active',
    luot_xem: 156,
    ngay_tao: '2026-07-20T10:00:00Z',
    ngay_cap_nhat: '2026-07-28T10:00:00Z',
  },
];
