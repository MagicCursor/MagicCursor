import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            color: '#fff',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div
            style={{
              maxWidth: '600px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '16px',
              padding: '40px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            <h1 style={{ marginTop: 0, fontSize: '32px', marginBottom: '16px' }}>
              ⚠️ Something went wrong
            </h1>
            <p style={{ fontSize: '16px', opacity: 0.8, marginBottom: '24px' }}>
              The application encountered an unexpected error.
            </p>

            {this.state.error && (
              <div
                style={{
                  background: 'rgba(255, 0, 0, 0.1)',
                  border: '1px solid rgba(255, 0, 0, 0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '24px',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  overflow: 'auto',
                  maxHeight: '200px',
                }}
              >
                <strong>Error:</strong> {this.state.error.message}
                {this.state.error.stack && (
                  <pre
                    style={{
                      marginTop: '8px',
                      fontSize: '12px',
                      opacity: 0.7,
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Reload Application
              </button>

              <button
                onClick={this.handleReset}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
