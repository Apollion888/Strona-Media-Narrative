import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Update state with error details
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="error-boundary">
          <div className="container">
            <div className="error-boundary-content">
              <h1>Coś poszło nie tak</h1>
              <p>
                Wystąpił nieoczekiwany błąd w aplikacji. Spróbuj odświeżyć stronę 
                lub wróć do strony głównej.
              </p>
              
              <div className="error-boundary-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Odśwież stronę
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => window.location.href = '/'}
                >
                  Wróć do strony głównej
                </button>
              </div>

              {/* Show error details in development */}
              {process.env.NODE_ENV === 'development' && (
                <details className="error-boundary-details">
                  <summary>Szczegóły błędu (development)</summary>
                  <pre className="error-boundary-stack">
                    {this.state.error && this.state.error.toString()}
                    <br />
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    // If no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
