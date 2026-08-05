import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create client only if we have the required values
let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key', {
    global: {
      headers: {
        'x-client-info': 'tromap-admin-mock',
      },
    },
  });
}

export { supabase };

// Admin client with service role (server-side only)
export const createAdminClient = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (supabaseUrl && serviceKey) {
    return createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return createClient('https://placeholder.supabase.co', 'placeholder-key');
};

// Auth helpers
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, user: data.user, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Rate limiting check (client-side)
const loginAttempts: { [key: string]: { count: number; resetTime: number } } = {};
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts[ip];

  if (!attempt || now > attempt.resetTime) {
    loginAttempts[ip] = { count: 1, resetTime: now + WINDOW_MS };
    return true;
  }

  if (attempt.count >= MAX_ATTEMPTS) {
    return false;
  }

  attempt.count++;
  return true;
}

export function getRemainingAttempts(ip: string): number {
  const attempt = loginAttempts[ip];
  if (!attempt) return MAX_ATTEMPTS;
  return Math.max(0, MAX_ATTEMPTS - attempt.count);
}

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};
