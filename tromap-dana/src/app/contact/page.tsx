'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MessageCircle, Facebook, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type ContactType = 'tu_van' | 'quang_cao' | 'bao_cao' | 'khac';

interface FormData {
  ho_ten: string;
  email: string;
  so_dt: string;
  loai: ContactType;
  noi_dung: string;
}

interface FormErrors {
  ho_ten?: string;
  email?: string;
  noi_dung?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    ho_ten: '',
    email: '',
    so_dt: '',
    loai: 'tu_van',
    noi_dung: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.ho_ten.trim() || formData.ho_ten.length < 2) {
      newErrors.ho_ten = 'Vui lòng nhập họ tên (ít nhất 2 ký tự)';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.noi_dung.trim() || formData.noi_dung.length < 10) {
      newErrors.noi_dung = 'Vui lòng nhập nội dung (ít nhất 10 ký tự)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // TODO: Send to Supabase or email service
      // For now, simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success
      setSubmitStatus('success');
      setFormData({
        ho_ten: '',
        email: '',
        so_dt: '',
        loai: 'tu_van',
        noi_dung: '',
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-[#00B4D8] hover:text-[#0096B4] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="font-bold text-lg">TroMapDana</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#00B4D8] to-[#52B788] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Liên Hệ
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 max-w-2xl mx-auto"
          >
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
          </motion.p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">Gửi tin nhắn</h2>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-700">Cảm ơn bạn! Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-700">Đã xảy ra lỗi. Vui lòng thử lại sau.</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Họ tên */}
                <div>
                  <label htmlFor="ho_ten" className="block text-sm font-medium text-[#1A1A2E] mb-2">
                    Họ tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="ho_ten"
                    name="ho_ten"
                    value={formData.ho_ten}
                    onChange={handleChange}
                    placeholder="Nhập họ tên của bạn"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.ho_ten ? 'border-red-500' : 'border-gray-200'
                    } focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none transition-all`}
                  />
                  {errors.ho_ten && (
                    <p className="mt-1 text-sm text-red-500">{errors.ho_ten}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#1A1A2E] mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    } focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none transition-all`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Số điện thoại */}
                <div>
                  <label htmlFor="so_dt" className="block text-sm font-medium text-[#1A1A2E] mb-2">
                    Số điện thoại <span className="text-gray-400">(tùy chọn)</span>
                  </label>
                  <input
                    type="tel"
                    id="so_dt"
                    name="so_dt"
                    value={formData.so_dt}
                    onChange={handleChange}
                    placeholder="0xxx xxx xxx"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none transition-all"
                  />
                </div>

                {/* Loại liên hệ */}
                <div>
                  <label htmlFor="loai" className="block text-sm font-medium text-[#1A1A2E] mb-2">
                    Chủ đề
                  </label>
                  <select
                    id="loai"
                    name="loai"
                    value={formData.loai}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none transition-all bg-white"
                  >
                    <option value="tu_van">Tư vấn thuê trọ</option>
                    <option value="quang_cao">Đặt quảng cáo</option>
                    <option value="bao_cao">Báo cáo tin rác</option>
                    <option value="khac">Khác</option>
                  </select>
                </div>

                {/* Nội dung */}
                <div>
                  <label htmlFor="noi_dung" className="block text-sm font-medium text-[#1A1A2E] mb-2">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="noi_dung"
                    name="noi_dung"
                    value={formData.noi_dung}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.noi_dung ? 'border-red-500' : 'border-gray-200'
                    } focus:border-[#00B4D8] focus:ring-2 focus:ring-[#00B4D8]/20 outline-none transition-all resize-none`}
                  />
                  {errors.noi_dung && (
                    <p className="mt-1 text-sm text-red-500">{errors.noi_dung}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#00B4D8] hover:bg-[#0096B4] disabled:bg-gray-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Gửi tin nhắn
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Direct Contact */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">Liên hệ trực tiếp</h2>
              
              <div className="space-y-4">
                <a
                  href="https://zalo.me/0901234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A2E]">Zalo</p>
                    <p className="text-[#6B7280]">0901 234 567</p>
                  </div>
                </a>

                <a
                  href="https://m.me/tromapdana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center">
                    <Facebook className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A2E]">Facebook</p>
                    <p className="text-[#6B7280]">TroMapDana</p>
                  </div>
                </a>

                <a
                  href="mailto:contact@tromapdana.com"
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#00B4D8] rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A2E]">Email</p>
                    <p className="text-[#6B7280]">contact@tromapdana.com</p>
                  </div>
                </a>

                <a
                  href="tel:0901234567"
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-12 h-12 bg-[#52B788] rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A2E]">Điện thoại</p>
                    <p className="text-[#6B7280]">0901 234 567</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Ad Inquiry */}
            <div className="bg-gradient-to-br from-[#F59E0B] to-[#D97706] rounded-2xl shadow-lg p-8 text-white">
              <h2 className="text-xl font-bold mb-3">Quảng cáo trên TroMapDana</h2>
              <p className="text-white/90 mb-4">
                Bạn muốn đặt quảng cáo trên TroMapDana? Liên hệ ngay để được tư vấn gói quảng cáo phù hợp với nhu cầu của bạn.
              </p>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Chỉ từ 500k/tháng
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">Giờ làm việc</h2>
              <div className="space-y-2 text-[#6B7280]">
                <div className="flex justify-between">
                  <span>Thứ 2 - Thứ 6</span>
                  <span className="font-medium text-[#1A1A2E]">8:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Thứ 7</span>
                  <span className="font-medium text-[#1A1A2E]">9:00 - 17:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Chủ nhật</span>
                  <span className="font-medium text-red-500">Nghỉ</span>
                </div>
              </div>
              <p className="mt-4 text-sm text-[#6B7280]">
                Chúng tôi sẽ phản hồi email trong vòng 24 giờ làm việc.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1A2E] text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-white/60 text-sm">
            © 2026 TroMapDana. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </footer>
    </div>
  );
}
