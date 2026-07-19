import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches render-time errors and displays a diagnostic recovery UI.
 * Prevents blank screens — shows actionable error info instead.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    console.error('[ArenaFlow] Uncaught render error:', error, info.componentStack);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  private handleDismiss = (): void => {
    this.setState({ hasError: false, error: null });
  };

  override render(): React.ReactNode {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    const { error } = this.state;

    return (
      <div
        role="alert"
        aria-live="assertive"
        style={{
          minHeight: '100vh',
          background: '#080C0A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,68,68,0.20)',
            borderRadius: '20px',
            padding: '40px 36px',
            textAlign: 'center',
          }}
        >
          <span
            className="material-symbols-outlined"
            aria-hidden="true"
            style={{ fontSize: '36px', color: '#FF4444', display: 'block', marginBottom: '16px' }}
          >
            warning
          </span>

          <h2
            style={{
              fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif",
              fontWeight: 800,
              fontSize: '20px',
              color: '#F0F0EE',
              marginBottom: '8px',
              letterSpacing: '-0.025em',
            }}
          >
            Telemetry temporarily unavailable
          </h2>

          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '14px',
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.65,
              marginBottom: '24px',
            }}
          >
            A rendering error occurred in the dashboard. You can try reloading the page or
            dismissing this message to recover.
          </p>

          {error && (
            <details
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                color: 'rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '8px',
                padding: '10px 14px',
                textAlign: 'left',
                marginBottom: '24px',
                wordBreak: 'break-all',
              }}
            >
              <summary style={{ cursor: 'pointer', marginBottom: '6px' }}>Diagnostics</summary>
              <p style={{ margin: 0 }}>{error.name}: {error.message}</p>
            </details>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={this.handleDismiss}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '10px',
                color: 'rgba(255,255,255,0.50)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
              aria-label="Dismiss error and try to continue"
            >
              Dismiss
            </button>
            <button
              onClick={this.handleReload}
              style={{
                padding: '10px 20px',
                background: 'rgba(0,212,106,0.10)',
                border: '1px solid rgba(0,212,106,0.25)',
                borderRadius: '10px',
                color: '#00D46A',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
              aria-label="Reload the page"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
    );
  }
}
