import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by AmarBazaar ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-stone-50">
          <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-stone-200 shadow-sm text-center">
            <div className="w-14 h-14 mx-auto bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-5">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Something Went Wrong</h1>
            <p className="mt-2.5 text-stone-600 text-sm leading-relaxed">
              We encountered an unexpected application glitch. Your saved items and cart have been preserved.
            </p>
            {this.state.error && (
              <div className="mt-4 p-3 bg-stone-100 rounded-lg text-left text-xs font-mono text-stone-700 max-h-32 overflow-auto">
                {this.state.error.message}
              </div>
            )}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => this.setState({ hasError: false })}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition"
              >
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.hash = '#home';
                  window.location.reload();
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-sm font-medium transition cursor-pointer"
              >
                <Home className="w-4 h-4" /> Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
