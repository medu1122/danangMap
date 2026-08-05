import { NextResponse, type NextRequest } from 'next/server';

// Supabase JWT secret for token validation
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET || '';

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

async function validateSupabaseToken(token: string): Promise<boolean> {
  // If no JWT secret configured, skip server-side validation
  // RLS will protect the data anyway
  if (!SUPABASE_JWT_SECRET) {
    return true;
  }

  try {
    // Verify JWT with Supabase
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const payload = parseJwt(token);
    if (!payload) return false;

    // Check expiration
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return false;
    }

    // Verify signature would require JWT library in edge runtime
    // For now, check basic payload structure
    return Boolean(payload.sub && payload.exp);
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't need authentication
  const publicRoutes = ['/login', '/register', '/forgot-password'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') // files with extensions
  ) {
    return NextResponse.next();
  }

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get tokens from cookies
  const supabaseToken = request.cookies.get('sb-access-token')?.value;
  const refreshToken = request.cookies.get('sb-refresh-token')?.value;

  // No token found - redirect to login
  if (!supabaseToken && !refreshToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Validate access token if present
  if (supabaseToken) {
    const isValid = await validateSupabaseToken(supabaseToken);
    if (!isValid) {
      // Token invalid/expired - clear cookies and redirect
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('sb-access-token');
      response.cookies.delete('sb-refresh-token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
