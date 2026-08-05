import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f9ff',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Background gradient */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, #00B4D8 0%, #52B788 100%)',
              opacity: 0.1,
            }}
          />

          {/* Logo/Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 120,
              height: 120,
              borderRadius: 24,
              backgroundColor: '#00B4D8',
              marginBottom: 32,
              boxShadow: '0 8px 32px rgba(0, 180, 216, 0.3)',
            }}
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>

          {/* Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <h1
              style={{
                fontSize: 56,
                fontWeight: 700,
                color: '#1A1A2E',
                margin: 0,
                letterSpacing: '-0.02em',
              }}
            >
              TroMapDana
            </h1>
            <p
              style={{
                fontSize: 28,
                color: '#00B4D8',
                margin: '8px 0 0 0',
                fontWeight: 500,
              }}
            >
              Bản Đồ Nhà Trọ Đà Nẵng
            </p>
          </div>

          {/* Tagline */}
          <p
            style={{
              fontSize: 20,
              color: '#6B7280',
              margin: 0,
              maxWidth: 500,
              textAlign: 'center',
            }}
          >
            Tìm nhà trọ nhanh chóng - Hỗ trợ sinh viên tìm trọ dễ dàng
          </p>

          {/* Stats badges */}
          <div
            style={{
              display: 'flex',
              gap: 24,
              marginTop: 40,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 24px',
                backgroundColor: 'white',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <span style={{ fontSize: 28, fontWeight: 700, color: '#52B788' }}>
                500+
              </span>
              <span style={{ fontSize: 14, color: '#6B7280' }}>Nhà trọ</span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 24px',
                backgroundColor: 'white',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <span style={{ fontSize: 28, fontWeight: 700, color: '#00B4D8' }}>
                Miễn phí
              </span>
              <span style={{ fontSize: 14, color: '#6B7280' }}>Sử dụng</span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '12px 24px',
                backgroundColor: 'white',
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <span style={{ fontSize: 28, fontWeight: 700, color: '#F59E0B' }}>
                24/7
              </span>
              <span style={{ fontSize: 14, color: '#6B7280' }}>Hỗ trợ</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error('OG Image generation error:', e);
    return new Response(`Failed to generate image: ${e.message}`, {
      status: 500,
    });
  }
}
