import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, Home, AlertTriangle } from 'lucide-react';

export interface NavigationErrorBoundaryProps {
  children: ReactNode;
  onReset?: () => void;
}

export interface NavigationErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class NavigationErrorBoundary extends React.Component<NavigationErrorBoundaryProps, NavigationErrorBoundaryState> {
  constructor(props: NavigationErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): NavigationErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('NavigationErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-900 text-slate-100 min-h-[400px]">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center mb-4 text-amber-400">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white mb-2">
            Không thể hiển thị sơ đồ chỉ đường
          </h2>
          
          <p className="text-slate-300 text-sm sm:text-base max-w-md mb-6 leading-relaxed">
            Bác có thể thử lại hoặc quay về chọn nơi đến để bắt đầu lại lộ trình.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
            <button
              type="button"
              onClick={this.handleRetry}
              className="flex-1 min-h-[48px] px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-base flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Thử lại</span>
            </button>

            {this.props.onReset && (
              <button
                type="button"
                onClick={this.props.onReset}
                className="flex-1 min-h-[48px] px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 font-bold text-base flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <Home className="w-5 h-5" />
                <span>Về trang chủ</span>
              </button>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
