import { ImageResponse } from 'next/og';
import { SITE_NAME } from '@/lib/seo';

export const runtime = 'edge';
export const alt = `${SITE_NAME} - Free Online Developer Tools`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 24 }}>
          <span style={{ fontSize: 72, fontWeight: 800, color: '#f8fafc' }}>Dev</span>
          <span style={{ fontSize: 72, fontWeight: 800, color: '#10b981' }}>Tool</span>
          <span style={{ fontSize: 72, fontWeight: 800, color: '#f8fafc' }}>Kit</span>
        </div>
        <p style={{ fontSize: 32, color: '#94a3b8', maxWidth: 800, textAlign: 'center', lineHeight: 1.4 }}>
          Free, fast, and privacy-friendly developer tools. Converters, generators, formatters, and utilities.
        </p>
        <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
          {['Converters', 'Generators', 'Formatters', 'Utilities'].map((cat) => (
            <span
              key={cat}
              style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                padding: '8px 20px',
                borderRadius: 8,
                fontSize: 20,
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
