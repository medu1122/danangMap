'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Phone,
  Mail,
  MessageCircle,
  X,
  Copy,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  UserPlus,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDate, maskPhone } from '@/lib/utils';
import { ChuTro, NhaTro } from '@/lib/types';
import { useToast } from '@/components/providers/ToastProvider';
import { chuTroSchema, formatValidationError } from '@/lib/schemas';

export default function ChuTroManagementPage() {
  const { showToast } = useToast();
  
  const [chuTroList, setChuTroList] = useState<ChuTro[]>([]);
  const [troOfChuTro, setTroOfChuTro] = useState<Record<string, NhaTro[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showSensitive, setShowSensitive] = useState(false);
  const [editingChuTro, setEditingChuTro] = useState<ChuTro | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    ten: '',
    sdt: '',
    zalo: '',
    email: '',
    facebook_url: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [ctRes, troRes] = await Promise.all([
        supabase.from('chu_tro').select('*').order('ngay_tao', { ascending: false }),
        supabase.from('nha_tro').select('*'),
      ]);

      if (ctRes.error) {
        throw new Error(ctRes.error.message);
      }

      setChuTroList(ctRes.data || []);
      
      // Group tro by chu_tro
      const grouped: Record<string, NhaTro[]> = {};
      (troRes.data || []).forEach((tro) => {
        if (!grouped[tro.chu_tro_id]) {
          grouped[tro.chu_tro_id] = [];
        }
        grouped[tro.chu_tro_id].push(tro);
      });
      setTroOfChuTro(grouped);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu');
      setChuTroList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredChuTroList = useMemo(() => {
    return chuTroList.filter((ct) =>
      ct.ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ct.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [chuTroList, searchTerm]);

  const handleOpenModal = (ct?: ChuTro) => {
    setValidationErrors({});
    if (ct) {
      setEditingChuTro(ct);
      setFormData({
        ten: ct.ten,
        sdt: ct.sdt || '',
        zalo: ct.zalo || '',
        email: ct.email || '',
        facebook_url: ct.facebook_url || '',
      });
    } else {
      setEditingChuTro(null);
      setFormData({
        ten: '',
        sdt: '',
        zalo: '',
        email: '',
        facebook_url: '',
      });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    setValidationErrors({});
    setSaving(true);

    // Validate with Zod
    const result = chuTroSchema.safeParse(formData);
    
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        if (path && !errors[path]) {
          errors[path] = issue.message;
        }
      });
      setValidationErrors(errors);
      setSaving(false);
      return;
    }

    try {
      if (editingChuTro) {
        const { error: updateError } = await supabase
          .from('chu_tro')
          .update({
            ten: formData.ten,
            sdt: formData.sdt || null,
            zalo: formData.zalo || null,
            email: formData.email || null,
            facebook_url: formData.facebook_url || null,
          })
          .eq('id', editingChuTro.id);
        
        if (updateError) {
          throw new Error(updateError.message);
        }
        
        showToast('Cập nhật chủ trọ thành công!', 'success');
      } else {
        const { error: insertError } = await supabase.from('chu_tro').insert([{
          ten: formData.ten,
          sdt: formData.sdt || null,
          zalo: formData.zalo || null,
          email: formData.email || null,
          facebook_url: formData.facebook_url || null,
        }]);
        
        if (insertError) {
          throw new Error(insertError.message);
        }
        
        showToast('Thêm chủ trọ mới thành công!', 'success');
      }
      
      await fetchData();
      setShowModal(false);
    } catch (err) {
      console.error('Save error:', err);
      showToast(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi lưu', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa chủ trọ này?')) return;
    
    try {
      const { error: deleteError } = await supabase.from('chu_tro').delete().eq('id', id);
      
      if (deleteError) {
        throw new Error(deleteError.message);
      }
      
      showToast('Xóa chủ trọ thành công!', 'success');
      await fetchData();
    } catch (err) {
      console.error('Delete error:', err);
      showToast(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi xóa', 'error');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getSoLuongTro = (id: string) => {
    return troOfChuTro[id]?.length || 0;
  };

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Chủ Trọ</h1>
          <p className="text-gray-500 mt-1">Tổng cộng {filteredChuTroList.length} chủ trọ</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSensitive(!showSensitive)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
              showSensitive
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showSensitive ? 'Ẩn thông tin nhạy cảm' : 'Hiện SĐT/Zalo'}
          </button>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#52B788] to-[#3D9A6E] text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Thêm chủ trọ
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm tên, email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:outline-none"
        />
      </div>

      {/* Warning */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl"
      >
        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
          <Phone className="w-5 h-5 text-yellow-600" />
        </div>
        <div>
          <p className="font-medium text-yellow-800">Thông tin nhạy cảm</p>
          <p className="text-sm text-yellow-700">
            SĐT và Zalo chỉ hiển thị khi bạn chủ động bật. Tuyệt đối không chia sẻ cho người khác.
          </p>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-[#00B4D8] animate-spin" />
        </div>
      )}

      {/* Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChuTroList.map((ct) => (
            <motion.div
              key={ct.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00B4D8] to-[#52B788] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {ct.ten.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{ct.ten}</h3>
                    <p className="text-sm text-gray-500">ID: {ct.id.slice(0, 8)}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleOpenModal(ct)}
                    className="p-2 text-gray-400 hover:text-[#00B4D8] hover:bg-gray-100 rounded-lg"
                    title="Sửa"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ct.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-2 mb-4">
                {ct.sdt && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className={`font-medium ${showSensitive ? 'text-gray-900' : 'text-gray-400'}`}>
                      {showSensitive ? ct.sdt : maskPhone(ct.sdt)}
                    </span>
                    {showSensitive && (
                      <button
                        onClick={() => copyToClipboard(ct.sdt!, 'sdt-' + ct.id)}
                        className="p-1 text-gray-400 hover:text-[#00B4D8]"
                      >
                        {copiedId === 'sdt-' + ct.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                )}
                {ct.zalo && (
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                    <span className={`font-medium ${showSensitive ? 'text-gray-900' : 'text-gray-400'}`}>
                      {showSensitive ? ct.zalo : maskPhone(ct.zalo!)}
                    </span>
                  </div>
                )}
                {ct.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600 truncate">{ct.email}</span>
                  </div>
                )}
                {ct.facebook_url && (
                  <a
                    href={ct.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-[#00B4D8] hover:underline"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="truncate">Facebook</span>
                  </a>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-500">Số nhà trọ</p>
                  <p className="text-xl font-bold text-gray-900">{getSoLuongTro(ct.id)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Ngày tham gia</p>
                  <p className="font-medium text-gray-900">{formatDate(ct.ngay_tao)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredChuTroList.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4">Chưa có chủ trọ nào</p>
          <button
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-[#00B4D8] text-white rounded-xl hover:bg-[#0096B4]"
          >
            Thêm chủ trọ đầu tiên
          </button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !saving && setShowModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingChuTro ? 'Sửa chủ trọ' : 'Thêm chủ trọ mới'}
                </h2>
                <button 
                  onClick={() => !saving && setShowModal(false)} 
                  className="p-2 text-gray-400 hover:text-gray-600"
                  disabled={saving}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Tên */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên *</label>
                  <input
                    type="text"
                    value={formData.ten}
                    onChange={(e) => setFormData({ ...formData, ten: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none ${
                      validationErrors.ten ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#00B4D8]'
                    }`}
                    placeholder="Nguyễn Văn A"
                    disabled={saving}
                  />
                  {validationErrors.ten && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.ten}</p>
                  )}
                </div>

                {/* SĐT */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.sdt}
                    onChange={(e) => setFormData({ ...formData, sdt: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none ${
                      validationErrors.sdt ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#00B4D8]'
                    }`}
                    placeholder="0912345678"
                    disabled={saving}
                  />
                  {validationErrors.sdt && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.sdt}</p>
                  )}
                </div>

                {/* Zalo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zalo</label>
                  <input
                    type="text"
                    value={formData.zalo}
                    onChange={(e) => setFormData({ ...formData, zalo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:border-[#00B4D8] focus:outline-none"
                    placeholder="ID Zalo"
                    disabled={saving}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none ${
                      validationErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#00B4D8]'
                    }`}
                    placeholder="email@example.com"
                    disabled={saving}
                  />
                  {validationErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>
                  )}
                </div>

                {/* Facebook URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
                  <input
                    type="url"
                    value={formData.facebook_url}
                    onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-xl focus:outline-none ${
                      validationErrors.facebook_url ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#00B4D8]'
                    }`}
                    placeholder="https://facebook.com/..."
                    disabled={saving}
                  />
                  {validationErrors.facebook_url && (
                    <p className="mt-1 text-sm text-red-500">{validationErrors.facebook_url}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
                <button 
                  onClick={() => !saving && setShowModal(false)} 
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                  disabled={saving}
                >
                  Hủy
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-[#00B4D8] text-white rounded-xl font-medium hover:bg-[#0096B4] disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingChuTro ? 'Lưu thay đổi' : 'Thêm mới'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
