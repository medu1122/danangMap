'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, Eye, EyeOff, AlertCircle, Shield, Loader2 } from 'lucide-react';
import { supabase, signIn } from '@/lib/supabase';

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return {
    question: `${num1} + ${num2} = ?`,
    answer: num1 + num2,
  };
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/dashboard');
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaValue, setCaptchaValue] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check localStorage for attempts on mount
  useEffect(() => {
    const storedAttempts = localStorage.getItem('login_attempts');
    const storedLockUntil = localStorage.getItem('login_locked_until');
    
    if (storedAttempts) {
      setAttempts(parseInt(storedAttempts, 10));
    }
    
    if (storedLockUntil) {
      const lockTime = parseInt(storedLockUntil, 10);
      if (lockTime > Date.now()) {
        setLockedUntil(lockTime);
      } else {
        localStorage.removeItem('login_locked_until');
        localStorage.removeItem('login_attempts');
        setAttempts(0);
      }
    }
  }, []);

  useEffect(() => {
    const redirect = searchParams.get('redirect');
    if (redirect && redirect.startsWith('/dashboard')) {
      setRedirectPath(redirect);
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard');
      }
    });
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCaptchaError('');

    // Check if locked out
    if (lockedUntil && lockedUntil > Date.now()) {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000 / 60);
      setError(`Tài khoản tạm khóa. Vui lòng thử lại sau ${remaining} phút.`);
      return;
    }

    // Validate CAPTCHA
    if (attempts >= 3 && parseInt(captchaValue, 10) !== captcha.answer) {
      setCaptchaError('Mã xác minh không đúng');
      setCaptcha(generateCaptcha());
      setCaptchaValue('');
      return;
    }

    setLoading(true);

    try {
      const { data: authData, error: authError } = await signIn(email, password);

      if (authError) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem('login_attempts', newAttempts.toString());

        // Lock after MAX_ATTEMPTS
        if (newAttempts >= MAX_ATTEMPTS) {
          const lockTime = Date.now() + LOCKOUT_DURATION;
          setLockedUntil(lockTime);
          localStorage.setItem('login_locked_until', lockTime.toString());
          setError(`Quá nhiều lần đăng nhập thất bại. Tài khoản tạm khóa 15 phút.`);
        } else {
          setError(`Email hoặc mật khẩu không đúng (${MAX_ATTEMPTS - newAttempts} lần thử còn lại)`);
        }
        
        setCaptcha(generateCaptcha());
        setCaptchaValue('');
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError('Đăng nhập thất bại');
        setLoading(false);
        return;
      }

      // Verify user is an admin
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_users')
        .select('id')
        .eq('id', authData.user.id)
        .single();

      if (adminError || !adminUser) {
        await supabase.auth.signOut();
        setError('Bạn không có quyền truy cập trang quản trị');
        setLoading(false);
        return;
      }

      // Reset attempts on success
      localStorage.removeItem('login_attempts');
      localStorage.removeItem('login_locked_until');
      
      router.push(redirectPath);
    } catch (err) {
      console.error('Login error:', err);
      setError('Đã xảy ra lỗi. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00B4D8] via-[#0096B4] to-[#52B788] p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-[#FFB703]/20 rounded-full blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00B4D8] to-[#52B788] px-8 py-6 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">TroMapDana Admin</h1>
            <p className="text-white/80 text-sm mt-1">Đăng nhập để quản lý hệ thống</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1A1A2E] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00B4D8] focus:outline-none transition-colors"
                placeholder="admin@tromapdana.com"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1A1A2E] mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00B4D8] focus:outline-none transition-colors pr-12"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* CAPTCHA - Show after 3 failed attempts */}
            {attempts >= 3 && (
              <div>
                <label htmlFor="captcha" className="block text-sm font-medium text-[#1A1A2E] mb-2">
                  Mã xác minh <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3">
                  <div className="flex-1 bg-[#F0F9FF] border-2 border-[#00B4D8]/20 rounded-xl px-4 py-3 font-mono text-lg text-[#00B4D8] font-bold">
                    {captcha.question}
                  </div>
                  <input
                    id="captcha"
                    type="text"
                    value={captchaValue}
                    onChange={(e) => setCaptchaValue(e.target.value)}
                    required
                    className="w-24 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#00B4D8] focus:outline-none transition-colors text-center"
                    placeholder="?"
                  />
                  <button
                    type="button"
                    onClick={() => setCaptcha(generateCaptcha())}
                    className="px-3 py-2 text-gray-400 hover:text-gray-600"
                    aria-label="Đổi mã"
                  >
                    <Loader2 className="w-5 h-5" />
                  </button>
                </div>
                {captchaError && (
                  <p className="mt-1 text-sm text-red-500">{captchaError}</p>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 text-[#EF4444] text-sm bg-red-50 px-4 py-3 rounded-xl"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || (lockedUntil !== null && lockedUntil > Date.now())}
              className="w-full py-4 bg-gradient-to-r from-[#00B4D8] to-[#52B788] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Đăng nhập</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 py-4 bg-gray-50 text-center">
            <p className="text-xs text-[#6B7280]">
              Truy cập trái phép sẽ bị ghi log và khóa tài khoản
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00B4D8] to-[#52B788]">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
