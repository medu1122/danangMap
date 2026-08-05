import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng',
  description: 'Điều khoản và điều kiện sử dụng dịch vụ TroMapDana. Vui lòng đọc kỹ trước khi sử dụng.',
};

export default function TermsPage() {
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Điều khoản sử dụng</h1>
          <p className="text-white/80">Cập nhật lần cuối: 01/08/2026</p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-lg max-w-none">
          {/* Table of Contents */}
          <nav className="mb-8 p-6 bg-gray-50 rounded-xl">
            <h2 className="text-lg font-bold text-[#1A1A2E] mb-3">Mục lục</h2>
            <ol className="list-decimal list-inside space-y-2 text-[#00B4D8]">
              <li><a href="#chap-nhan" className="hover:underline">Chấp nhận điều khoản</a></li>
              <li><a href="#dich-vu" className="hover:underline">Mô tả dịch vụ</a></li>
              <li><a href="#nguoi-dung" className="hover:underline">Người dùng</a></li>
              <li><a href="#chu-tro" className="hover:underline">Chủ trọ</a></li>
              <li><a href="#noi-dung" className="hover:underline">Nội dung được phép</a></li>
              <li><a href="#han-che" className="hover:underline">Hạn chế sử dụng</a></li>
              <li><a href="#so-huu" className="hover:underline">Sở hữu trí tuệ</a></li>
              <li><a href="#gioi-han" className="hover:underline">Giới hạn trách nhiệm</a></li>
              <li><a href="#thay-doi" className="hover:underline">Thay đổi điều khoản</a></li>
              <li><a href="#lien-he" className="hover:underline">Liên hệ</a></li>
            </ol>
          </nav>

          {/* Section 1 */}
          <section id="chap-nhan" className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">1. Chấp nhận điều khoản</h2>
            <p className="text-[#6B7280] mb-4">
              Bằng việc truy cập và sử dụng TroMapDana, bạn xác nhận rằng bạn đã đọc, hiểu và đồng ý 
              với các Điều khoản sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản, 
              vui lòng không sử dụng dịch vụ của chúng tôi.
            </p>
          </section>

          {/* Section 2 */}
          <section id="dich-vu" className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">2. Mô tả dịch vụ</h2>
            <p className="text-[#6B7280] mb-4">
              TroMapDana là nền tảng trực tuyến giúp người dùng tìm kiếm và xem thông tin nhà trọ tại Đà Nẵng. 
              Dịch vụ bao gồm:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#6B7280]">
              <li>Bản đồ tương tác hiển thị vị trí nhà trọ</li>
              <li>Thông tin cơ bản về nhà trọ (giá, diện tích, địa chỉ)</li>
              <li>Liên kết đến Facebook của chủ trọ</li>
              <li>Bộ lọc và tìm kiếm theo tiêu chí</li>
              <li>Hỗ trợ định vị người dùng</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="nguoi-dung" className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">3. Người dùng</h2>
            <p className="text-[#6B7280] mb-4">
              Khi sử dụng TroMapDana với tư cách người dùng, bạn đồng ý:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#6B7280]">
              <li>Sử dụng dịch vụ cho mục đích hợp pháp</li>
              <li>Không sử dụng robot, spider, hoặc các công cụ tự động khác</li>
              <li>Không cố gắng truy cập trái phép vào hệ thống</li>
              <li>Tuân thủ các quy định pháp luật hiện hành</li>
              <li>Chịu trách nhiệm với thông tin tài khoản của mình</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="chu-tro" className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">4. Chủ trọ</h2>
            <p className="text-[#6B7280] mb-4">
              Nếu bạn là chủ trọ đăng thông tin trên TroMapDana, bạn đồng ý thêm:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#6B7280]">
              <li>Cung cấp thông tin chính xác và cập nhật</li>
              <li>Đảm bảo có quyền cho thuê nhà/phòng trọ</li>
              <li>Chịu trách nhiệm về tính chính xác của thông tin</li>
              <li>Đồng ý với việc hiển thị thông tin liên hệ công khai</li>
              <li>Thanh toán phí dịch vụ đúng hạn (nếu có)</li>
              <li>Chịu trách nhiệm xử lý các thắc mắc từ người thuê</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="noi-dung" className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">5. Nội dung được phép</h2>
            <p className="text-[#6B7280] mb-4">
              Các nội dung được phép đăng tải trên TroMapDana:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#6B7280]">
              <li>Thông tin nhà trọ hợp pháp</li>
              <li>Hình ảnh thật của nhà trọ (nếu có)</li>
              <li>Link Facebook cá nhân hoặc Fanpage hợp lệ</li>
              <li>Thông tin liên hệ chính xác</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section id="han-che" className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">6. Hạn chế sử dụng</h2>
            <p className="text-[#6B7280] mb-4">
              Nghiêm cấm các hành vi sau:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#6B7280]">
              <li>Đăng thông tin giả, lừa đảo hoặc gây hiểu lầm</li>
              <li>Đăng nội dung vi phạm pháp luật Việt Nam</li>
              <li>Sử dụng hình ảnh không có quyền sử dụng</li>
              <li>Spam, quảng cáo không liên quan</li>
              <li>Thực hiện tấn công DDoS hoặc các hoạt động bất hợp pháp</li>
              <li>Cố gắng thu thập thông tin người dùng khác</li>
              <li>Sử dụng cho mục đích thương mại trái phép</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section id="so-huu" className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">7. Sở hữu trí tuệ</h2>
            <p className="text-[#6B7280] mb-4">
              Tất cả nội dung, thiết kế, logo, và code của TroMapDana được bảo vệ bản quyền. 
              Bạn không được phép:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#6B7280]">
              <li>Sao chép, phân phối lại nội dung</li>
              <li>Sử dụng logo hoặc thương hiệu TroMapDana</li>
              <li>Tái tạo thiết kế hoặc giao diện</li>
              <li>Reverse engineer phần mềm</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section id="gioi-han" className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">8. Giới hạn trách nhiệm</h2>
            <p className="text-[#6B7280] mb-4">
              <strong className="text-[#1A1A2E]">TroMapDana KHÔNG chịu trách nhiệm về:</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 text-[#6B7280]">
              <li>Tính chính xác của thông tin do chủ trọ cung cấp</li>
              <li>Chất lượng, an toàn của nhà trọ</li>
              <li>Kết quả giao dịch giữa người thuê và chủ trọ</li>
              <li>Thiệt hại phát sinh từ việc sử dụng dịch vụ</li>
              <li>Gián đoạn dịch vụ do lỗi kỹ thuật</li>
            </ul>
            <p className="text-[#6B7280] mt-4">
              Thông tin trên TroMapDana chỉ mang tính chất tham khảo. Người dùng nên kiểm tra trực tiếp 
              với chủ trọ trước khi đưa ra quyết định thuê.
            </p>
          </section>

          {/* Section 9 */}
          <section id="thay-doi" className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">9. Thay đổi điều khoản</h2>
            <p className="text-[#6B7280]">
              Chúng tôi có quyền thay đổi các Điều khoản sử dụng này bất cứ lúc nào. 
              Các thay đổi sẽ có hiệu lực ngay khi được đăng tải. 
              Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận 
              các điều khoản mới.
            </p>
          </section>

          {/* Section 10 */}
          <section id="lien-he" className="mb-8">
            <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">10. Liên hệ</h2>
            <p className="text-[#6B7280]">
              Nếu bạn có câu hỏi về Điều khoản sử dụng này, vui lòng liên hệ:
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
            <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">
              Chính sách bảo mật
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
