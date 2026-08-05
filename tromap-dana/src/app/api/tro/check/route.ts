import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

// Lightweight endpoint for polling - only returns count and latest timestamp
// Much faster than full data fetch
export async function GET() {
  try {
    const supabase = createAdminClient();
    
    // Get count and latest update time
    const { data, error } = await supabase
      .from('nha_tro')
      .select('ngay_cap_nhat', { count: 'exact', head: true })
      .eq('trang_thai', 'active')
      .order('ngay_cap_nhat', { ascending: false })
      .limit(1);

    if (error) throw error;

    const latestTro = data && data.length > 0 ? data[0] : null;

    return NextResponse.json(
      {
        count: 0, // Supabase count from header
        latest_update: latestTro?.ngay_cap_nhat || null,
        timestamp: Date.now(),
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Check endpoint error:', error);
    return NextResponse.json(
      { count: 0, latest_update: null, timestamp: Date.now() },
      { status: 200 } // Return 200 even on error to not break polling
    );
  }
}
