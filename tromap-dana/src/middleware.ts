import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  const securityHeaders = {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://*.tile.openstreetmap.org",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.tile.openstreetmap.org https://*.openstreetmap.org https://*.facebook.com https://*.fbcdn.net",
      "connect-src 'self' https://*.supabase.co https://*.tile.openstreetmap.org",
      "frame-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
    
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  };

  // Apply headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Rate limiting hint (for Vercel Pro plan)
  // In production, use Vercel's edge config or upstash/ratelimit

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and api routes that shouldn't have these headers
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
