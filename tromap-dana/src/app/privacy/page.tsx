import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description: 'Chính sách bảo mật thông tin của TroMapDana. Tìm hiểu cách chúng tôi thu thập, sử dụng và bảo vệ dữ liệu của bạn.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-[#00B4D8] hover:text-[#0096B4] transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="font-bold text-lg">TroMapDana</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-[#00B4D8] to-[#52B788] text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Chính sách bảo mật</h1>
          <p className="text-white/80">Cập nhật lần cuối: 01/08/2026</p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-lg max-w-none">
          {/* Table of Contents */}
          <nav className="mb-8 p-6 bg-gray-50 rounded-xl">
            <h2 className="text-lg font-bold text-[#1A1A2E] mb-3">Mục lục</h2>
            <ol className="list-decimal list-inside space-y-2 text-[#00B4D8]">
              <li><a href="#thu-thap" className="hover:underline">Thông tin chúng tôi thu thập</a></li>
              <li><a href="#su-dung" className="hover:underline">Cách chúng tôi sử dụng thông tin</a></li>
              <li><a href="#chia-se" className="hover:underline">Việc chia sẻ thông tin</a></li>
              <li><a href="#bao-mat" className="hover:underline">Bảo mật dữ liệu</a></li>
              <li><a href="#quyen" className="hover:underline">Quyền của bạn</a></li>
              <li><a href="#cookie" className="hover:underline">Cookie</a></li>
              <li><a href="#thay-doi" className="hover:underline">Thay đổi chính sách</a></li>
              <li><a href="#lien-he" className="hover:underline">Liên hệ</a></li>
            </ol>
          </nav>

          {/* Section 1 */}
          <section id="thu-thap" className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">1. Thông tin chúng tôi thu thập</h2>
            
            <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">1.1. Thông tin bạn cung cấp</h3>
            <ul className="list-disc list-inside space-y-2 text-[#6B7280] mb-4">
              <li>Thông tin liên hệ: họ tên, email, số điện thoại (khi bạn liên hệ với chúng tôi)</li>
              <li>Nội dung tin nhắn khi bạn gửi form liên hệ</li>
              <li>Thông tin chủ trọ: tên, số điện thoại, Zalo, Facebook, email</li>
            </ul>

            <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">1.2. Thông tin thu thập tự động</h3>
            <ul className="list-disc list-inside space-y-2 text-[#6B7280] mb-4">
              <li>Địa chỉ IP</li>
              <li>Loại trình duyệt và phiên bản</li>
              <li>Vị trí địa lý (khi bạn cho phép truy cập)</li>
              <li>Thông tin thiết bị</li>
              <li>Trang bạn truy cập và thời gian truy cập</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section id="su-dung" className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">2. Cách chúng tôi sử dụng thông tin</h2>
            <p className="text-[#6B7280] mb-4">
              Chúng tôi sử dụng thông tin thu thập được để:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#6B7280]">
              <li>Cung cấp và duy trì dịch vụ TroMapDana</li>
              <li>Hiển thị thông tin nhà trọ trên bản đồ</li>
              <li>Liên hệ với bạn khi có yêu cầu hỗ trợ</li>
              <li>Cải thiện trải nghiệm người dùng</li>
              <li>Phân tích xu hướng và thống kê sử dụng</li>
              <li>Ngăn chặn hành vi gian lận hoặc lạm dụng</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="chia-se" className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">3. Việc chia sẻ thông tin</h2>
            <p className="text-[#6B7280] mb-4">
              <strong className="text-[#1A1A2E]">Chúng tôi KHÔNG bán thông tin cá nhân của bạn</strong> cho bên thứ ba. 
              Thông tin có thể được chia sẻ trong các trường hợp sau:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#6B7280]">
              <li><strong>Chủ trọ:</strong> Thông tin liên hệ (Facebook) của chủ trọ được hiển thị công khai để người dùng liên hệ.</li>
              <li><strong>Nhà cung cấp dịch vụ:</strong> Chúng tôi sử dụng Supabase để lưu trữ dữ liệu.</li>
              <li><strong>Yêu cầu pháp lý:</strong> Khi được yêu cầu bởi cơ quan có thẩm quyền.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="bao-mat" className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">4. Bảo mật dữ liệu</h2>
            <p className="text-[#6B7280] mb-4">
              Chúng tôi cam kết bảo vệ thông tin của bạn bằng các biện pháp sau:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#6B7280]">
              <li>Mã hóa dữ liệu khi truyền tải (HTTPS)</li>
              <li>Row Level Security (RLS) trong database</li>
              <li>Giới hạn quyền truy cập dữ liệu nhạy cảm</li>
              <li>Thường xuyên cập nhật hệ thống bảo mật</li>
              <li>Không lưu trữ mật khẩu dưới dạng plain text</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="quyen" className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">5. Quyền của bạn</h2>
            <p className="text-[#6B7280] mb-4">
              Bạn có các quyền sau đối với dữ liệu cá nhân của mình:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#6B7280]">
              <li><strong>Truy cập:</strong> Yêu cầu xem thông tin cá nhân của bạn</li>
              <li><strong>Chỉnh sửa:</strong> Yêu cầu sửa đổi thông tin không chính xác</li>
              <li><strong>Xóa:</strong> Yêu cầu xóa dữ liệu của bạn (trong phạm vi cho phép)</li>
              <li><strong>Phản đối:</strong> Phản đối việc xử lý dữ liệu của bạn</li>
              <li><strong>Di chuyển:</strong> Yêu cầu xuất dữ liệu của bạn</li>
            </ul>
            <p className="text-[#6B7280] mt-4">
              Để thực hiện các quyền trên, vui lòng liên hệ qua email: <a href="mailto:contact@tromapdana.com" className="text-[#00B4D8] hover:underline">contact@tromapdana.com</a>
            </p>
          </section>

          {/* Section 6 */}
          <section id="cookie" className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">6. Cookie</h2>
            <p className="text-[#6B7280] mb-4">
              TroMapDana sử dụng cookie để:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#6B7280]">
              <li>Lưu trữ tùy chọn của bạn (ngôn ngữ, bộ lọc)</li>
              <li>Phân tích lưu lượng truy cập</li>
              <li>Duy trì phiên đăng nhập (nếu có)</li>
            </ul>
            <p className="text-[#6B7280] mt-4">
              Bạn có thể tắt cookie trong cài đặt trình duyệt, tuy nhiên một số tính năng có thể không hoạt động đúng.
            </p>
          </section>

          {/* Section 7 */}
          <section id="thay-doi" className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">7. Thay đổi chính sách</h2>
            <p className="text-[#6B7280]">
              Chúng tôi có thể cập nhật Chính sách bảo mật này theo thời gian. 
              Mọi thay đổi sẽ được thông báo trên trang web và cập nhật ngày "Cập nhật lần cuối" ở đầu trang.
              Chúng tôi khuyến khích bạn thường xuyên xem lại chính sách này.
            </p>
          </section>

          {/* Section 8 */}
          <section id="lien-he" className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">8. Liên hệ</h2>
            <p className="text-[#6B7280]">
              Nếu bạn có câu hỏi về Chính sách bảo mật này, vui lòng liên hệ:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <p className="text-[#1A1A2E] font-medium">TroMapDana</p>
              <p className="text-[#6B7280]">Email: <a href="mailto:contact@tromapdana.com" className="text-[#00B4D8] hover:underline">contact@tromapdana.com</a></p>
              <p className="text-[#6B7280]">Zalo: 0901 234 567</p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1A2E] text-white py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-6 mb-4">
            <Link href="/" className="text-white/60 hover:text-white transition-colors">
              Trang chủ
            </Link>
            <Link href="/about" className="text-white/60 hover:text-white transition-colors">
              Giới thiệu
            </Link>
            <Link href="/contact" className="text-white/60 hover:text-white transition-colors">
              Liên hệ
            </Link>
            <Link href="/terms" className="text-white/60 hover:text-white transition-colors">
              Điều khoản
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
