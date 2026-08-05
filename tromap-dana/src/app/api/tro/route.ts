import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

// Cache for 60 seconds, serve stale while revalidating
export const revalidate = 60;

export async function GET() {
  try {
    const supabase = createAdminClient();
    
    // Fetch all active listings with owner info
    const { data: nhaTro, error: nhaTroError } = await supabase
      .from('nha_tro')
      .select(`
        *,
        chu_tro (
          id,
          ten,
          sdt,
          zalo,
          facebook_url
        )
      `)
      .eq('trang_thai', 'active')
      .order('ngay_tao', { ascending: false });

    if (nhaTroError) throw nhaTroError;

    // Fetch active ads
    const { data: ads, error: adsError } = await supabase
      .from('quang_cao')
      .select('*')
      .eq('trang_thai', 'active')
      .or(`ngay_bat_dau.is.null,ngay_bat_dau.lte.${new Date().toISOString().split('T')[0]}`)
      .or(`ngay_ket_thuc.is.null,ngay_ket_thuc.gte.${new Date().toISOString().split('T')[0]}`)
      .limit(10);

    if (adsError) console.error('Ads error:', adsError);

    return NextResponse.json(
      {
        nha_tro: nhaTro || [],
        quang_cao: ads || [],
        cached_at: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data', nha_tro: [], quang_cao: [] },
      { status: 500 }
    );
  }
}
