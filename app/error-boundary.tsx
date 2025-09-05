import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { error: Error | null; }

export class GlobalErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('GlobalErrorBoundary', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="flex items-center justify-center h-screen bg-red-50 text-red-800">
          <div>
            <h1 className="text-3xl font-bold mb-4">Algo salió mal</h1>
            <p>{this.state.error.message}</p>
            <button
              className="mt-6 px-4 py-2 bg-red-600 text-white rounded"
              onClick={() => location.reload()}
            >
              Recargar página
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
