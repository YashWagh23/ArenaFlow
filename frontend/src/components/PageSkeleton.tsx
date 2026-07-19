import React from 'react';

function Shimmer({ width = '100%', height = 24, radius = 8 }: {
  width?: string | number;
  height?: number;
  radius?: number;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        width,
        height,
        borderRadius: radius,
        background: 'rgba(255,255,204,0.05)',
        animation: 'shimmer 1.5s ease-in-out infinite',
      }}
    />
  );
}

/** Full-page skeleton shown during lazy-loaded page suspense */
export function PageSkeleton() {
  return (
    <div
      aria-label="Loading page"
      aria-busy="true"
      style={{
        minHeight: 'calc(100vh - 48px)',
        background: '#1A1A00',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Shimmer width={80} height={10} radius={4} />
          <Shimmer width={240} height={36} radius={8} />
        </div>
        <Shimmer width={140} height={52} radius={14} />
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(255,255,204,0.03)',
              border: '1px solid rgba(255,255,204,0.07)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
            aria-hidden="true"
          >
            <Shimmer width={60} height={9} radius={4} />
            <Shimmer width={100} height={32} radius={6} />
            <Shimmer width={80} height={9} radius={4} />
          </div>
        ))}
      </div>

      {/* Main content area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', flex: 1 }}>
        <div
          style={{
            background: 'rgba(255,255,204,0.03)',
            border: '1px solid rgba(255,255,204,0.07)',
            borderRadius: '20px',
            minHeight: '400px',
          }}
          aria-hidden="true"
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(255,255,204,0.03)',
                border: '1px solid rgba(255,255,204,0.07)',
                borderRadius: '16px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
              aria-hidden="true"
            >
              <Shimmer width={80} height={9} radius={4} />
              <Shimmer width="90%" height={20} radius={6} />
              <Shimmer width="70%" height={14} radius={4} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
