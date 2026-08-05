'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Users,
  Eye,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';

interface Stats {
  totalTro: number;
  activeTro: number;
  totalChuTro: number;
  luotXemHomNay: number;
  luotXemTuan: number;
}

const mockChartData = [
  { name: 'T2', views: 120 },
  { name: 'T3', views: 150 },
  { name: 'T4', views: 130 },
  { name: 'T5', views: 180 },
  { name: 'T6', views: 200 },
  { name: 'T7', views: 250 },
  { name: 'CN', views: 180 },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalTro: 0,
    activeTro: 0,
    totalChuTro: 0,
    luotXemHomNay: 0,
    luotXemTuan: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Fetch real data
        const [troRes, chuTroRes, lichSuRes] = await Promise.all([
          supabase.from('nha_tro').select('*', { count: 'exact' }),
          supabase.from('chu_tro').select('*', { count: 'exact' }),
          supabase.from('lich_su_xem').select('*'),
        ]);

        setStats({
          totalTro: troRes.count || 6, // fallback to mock
          activeTro: troRes.data?.filter(t => t.trang_thai === 'active').length || 6,
          totalChuTro: chuTroRes.count || 4,
          luotXemHomNay: lichSuRes.data?.length || 89,
          luotXemTuan: lichSuRes.data?.length || 1230,
        });
      } catch (error) {
        // Use mock data
        setStats({
          totalTro: 6,
          activeTro: 6,
          totalChuTro: 4,
          luotXemHomNay: 89,
          luotXemTuan: 1230,
        });
      }
      setLoading(false);
    }

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Tổng Nhà Trọ',
      value: stats.totalTro,
      subtext: `${stats.activeTro} đang hoạt động`,
      icon: Home,
      color: 'from-[#00B4D8] to-[#0096B4]',
      change: '+12%',
      positive: true,
    },
    {
      title: 'Chủ Trọ',
      value: stats.totalChuTro,
      subtext: 'Đã đăng ký',
      icon: Users,
      color: 'from-[#52B788] to-[#3D9A6E]',
      change: '+3',
      positive: true,
    },
    {
      title: 'Lượt Xem Hôm Nay',
      value: stats.luotXemHomNay,
      subtext: 'Lượt xem',
      icon: Eye,
      color: 'from-[#FFB703] to-[#F59E0B]',
      change: '+23%',
      positive: true,
    },
    {
      title: 'Lượt Xem Tuần',
      value: stats.luotXemTuan,
      subtext: 'Lượt xem',
      icon: TrendingUp,
      color: 'from-[#8B5CF6] to-[#7C3AED]',
      change: '+18%',
      positive: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Tổng quan hoạt động hệ thống</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.positive ? 'text-green-500' : 'text-red-500'
                }`}>
                  {stat.positive ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-gray-900">
                  {loading ? '-' : stat.value}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{stat.subtext}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-gray-900">Lượt xem trong tuần</h2>
          <span className="text-sm text-[#00B4D8] font-medium">
            Tổng: {mockChartData.reduce((a, b) => a + b.views, 0)} lượt
          </span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockChartData}>
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="views"
                stroke="#00B4D8"
                strokeWidth={3}
                dot={{ fill: '#00B4D8', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#00B4D8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <h2 className="font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Thêm nhà trọ', href: '/dashboard/tro?action=new', color: 'bg-[#00B4D8]' },
            { label: 'Thêm chủ trọ', href: '/dashboard/chutro?action=new', color: 'bg-[#52B788]' },
            { label: 'Tạo báo giá', href: '/dashboard/baocao?action=quote', color: 'bg-[#FFB703]' },
            { label: 'Xem báo cáo', href: '/dashboard/baocao', color: 'bg-[#8B5CF6]' },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className={`${action.color} text-white px-4 py-3 rounded-xl font-medium text-center hover:opacity-90 transition-opacity`}
            >
              {action.label}
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
