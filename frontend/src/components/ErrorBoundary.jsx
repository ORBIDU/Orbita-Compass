import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('UI ErrorBoundary caught an exception:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8 max-w-md text-center space-y-4">
            <span className="text-4xl">⚠️</span>
            <h2 className="text-xl font-bold text-slate-800">Terjadi Kesalahan Aplikasi</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sistem mendeteksi kendala pada tampilan ({this.state.error?.message || 'Uncaught Error'}). Sesi Anda tetap aman.
            </p>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.href = '/'; }}
              className="bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-blue-700 transition-all cursor-pointer"
            >
              🔄 Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
