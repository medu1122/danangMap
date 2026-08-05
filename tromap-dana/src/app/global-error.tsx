'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="vi">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Đã xảy ra lỗi nghiêm trọng
            </h1>
            
            <p className="text-gray-600 mb-6">
              Ứng dụng gặp sự cố không thể khôi phục. Vui lòng thử tải lại trang.
            </p>

            {process.env.NODE_ENV === 'development' && (
              <details className="text-left mb-6 p-4 bg-gray-100 rounded-xl text-sm">
                <summary className="font-medium text-gray-700 cursor-pointer mb-2">
                  Chi tiết lỗi (Development only)
                </summary>
                <pre className="overflow-auto text-red-600 text-xs">
                  {error.message}
                  {'\n\n'}
                  {error.stack}
                  {error.digest && `\n\nDigest: ${error.digest}`}
                </pre>
              </details>
            )}

            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00B4D8] text-white rounded-xl hover:bg-[#0096B4] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Tải lại trang</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
