"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  context?: string;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error caught by boundary:", error);
      console.error("Error info:", errorInfo);
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-red-600 dark:text-red-400 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                {this.props.context ? `Error in ${this.props.context}` : "Something went wrong"}
              </h3>
              <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                {this.state.error?.message || "An unexpected error occurred"}
              </p>
              
              {this.props.showDetails && process.env.NODE_ENV === "development" && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs text-red-600 dark:text-red-400 hover:underline">
                    Show error details
                  </summary>
                  <pre className="mt-2 text-xs text-red-600 dark:text-red-400 whitespace-pre-wrap bg-red-100 dark:bg-red-900 p-2 rounded">
                    {this.state.error?.stack}
                  </pre>
                </details>
              )}
              
              <button
                onClick={this.handleReset}
                className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-500 dark:hover:bg-red-600"
              >
                <RefreshCw className="size-3" />
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook-based error boundary for simpler use cases
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error("Error caught:", error);
    if (errorInfo) {
      console.error("Error info:", errorInfo);
    }
  };
}

// Specific error boundary for MDX content
export function MDXErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      context="MDX Content"
      showDetails={true}
      fallback={
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-950">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Content Error
              </h3>
              <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                There was an error rendering this content. The content may contain invalid markup or components.
              </p>
            </div>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

// Media-specific error boundary
export function MediaErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      context="Media Content"
      fallback={
        <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8 dark:border-gray-800 dark:bg-gray-950">
          <div className="text-center">
            <AlertTriangle className="mx-auto size-8 text-gray-400 dark:text-gray-600" />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Media content failed to load
            </p>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}