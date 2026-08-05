import { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Users, Shield, Heart, Zap, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Giới thiệu về TroMapDana',
  description: 'Tìm hiểu về TroMapDana - Bản đồ nhà trọ Đà Nẵng. Sứ mệnh của chúng tôi là giúp sinh viên tìm nhà trọ dễ dàng và nhanh chóng.',
};

export default function AboutPage() {
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
      <section className="bg-gradient-to-r from-[#00B4D8] to-[#52B788] text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-white/20 rounded-2xl mx-auto mb-6 flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Về TroMapDana
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Sứ mệnh của chúng tôi là giúp sinh viên tìm nhà trọ tại Đà Nẵng một cách dễ dàng và nhanh chóng nhất
          </p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Mission */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1A1A2E] mb-4">Sứ mệnh của chúng tôi</h2>
            <p className="text-[#6B7280] text-lg max-w-3xl mx-auto">
              TroMapDana được tạo ra với mục tiêu giải quyết bài toán khó khăn của sinh viên khi tìm nhà trọ tại Đà Nẵng - 
              một thành phố với hàng trăm nghìn sinh viên từ khắp cả nước đến học tập.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-[#00B4D8]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-[#00B4D8]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">Tìm kiếm thông minh</h3>
              <p className="text-[#6B7280]">
                Bản đồ trực quan giúp bạn xem vị trí, giá cả và thông tin chi tiết của từng nhà trọ một cách nhanh chóng.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-[#52B788]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-[#52B788]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">Kết nối dễ dàng</h3>
              <p className="text-[#6B7280]">
                Liên hệ trực tiếp với chủ trọ qua Facebook mà không cần qua trung gian, tiết kiệm thời gian và công sức.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-[#F59E0B]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-[#F59E0B]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">Thông tin đáng tin cậy</h3>
              <p className="text-[#6B7280]">
                Tất cả thông tin được kiểm duyệt và cập nhật thường xuyên, đảm bảo tính chính xác cho người dùng.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-20 bg-gradient-to-br from-[#1A1A2E] to-[#2D2D44] rounded-3xl p-12 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">TroMapDana trong con số</h2>
            <p className="text-white/70">Những con số ấn tượng của chúng tôi</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#00B4D8] mb-2">500+</div>
              <p className="text-white/70">Nhà trọ</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#52B788] mb-2">10K+</div>
              <p className="text-white/70">Sinh viên</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#F59E0B] mb-2">50K+</div>
              <p className="text-white/70">Lượt truy cập</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">4.8</div>
              <p className="text-white/70">Đánh giá</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1A1A2E] mb-4">Cách hoạt động</h2>
            <p className="text-[#6B7280] text-lg">Tìm nhà trọ chỉ trong 3 bước đơn giản</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="w-12 h-12 bg-[#00B4D8] text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">Mở bản đồ</h3>
                <p className="text-[#6B7280]">
                  Truy cập TroMapDana và khám phá bản đồ các nhà trọ trên khắp Đà Nẵng.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="w-12 h-12 bg-[#52B788] text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">Lọc & Tìm kiếm</h3>
                <p className="text-[#6B7280]">
                  Sử dụng bộ lọc để tìm nhà trọ phù hợp với nhu cầu: giá cả, diện tích, vị trí.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="w-12 h-12 bg-[#F59E0B] text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">Liên hệ ngay</h3>
                <p className="text-[#6B7280]">
                  Nhấn vào nút &quot;Xem chi tiết&quot; để liên hệ trực tiếp với chủ trọ qua Facebook.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1A1A2E] mb-4">Giá trị cốt lõi</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#00B4D8]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-[#00B4D8]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-1">Người dùng là trung tâm</h3>
                <p className="text-[#6B7280]">
                  Mọi quyết định của chúng tôi đều xoay quanh việc mang lại trải nghiệm tốt nhất cho sinh viên.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#52B788]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-[#52B788]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-1">Tốc độ và hiệu quả</h3>
                <p className="text-[#6B7280]">
                  Chúng tôi tối ưu hóa mọi quy trình để bạn có thể tìm được nhà trọ trong thời gian ngắn nhất.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#F59E0B]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-1">Bảo mật thông tin</h3>
                <p className="text-[#6B7280]">
                  Thông tin cá nhân của bạn được bảo vệ an toàn. Chúng tôi không chia sẻ dữ liệu cho bên thứ ba.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-1">Cam kết cộng đồng</h3>
                <p className="text-[#6B7280]">
                  TroMapDana hoạt động vì cộng đồng sinh viên Đà Nẵng, không vì lợi nhuận.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-[#00B4D8] to-[#52B788] rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Sẵn sàng tìm nhà trọ?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Khám phá bản đồ ngay hôm nay và tìm cho mình một chỗ ở ưng ý tại Đà Nẵng.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#00B4D8] font-bold rounded-xl hover:bg-gray-100 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Mở bản đồ ngay
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1A2E] text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-4">
            <Link href="/" className="text-white/60 hover:text-white transition-colors">
              Trang chủ
            </Link>
            <Link href="/contact" className="text-white/60 hover:text-white transition-colors">
              Liên hệ
            </Link>
            <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="/terms" className="text-white/60 hover:text-white transition-colors">
              Điều khoản sử dụng
            </Link>
          </div>
          <p className="text-white/60 text-sm">
            © 2026 TroMapDana. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </footer>
    </div>
  );
}
