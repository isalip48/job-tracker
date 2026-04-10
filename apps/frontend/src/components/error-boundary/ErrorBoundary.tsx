// components/error-boundary/ErrorBoundary.tsx
//
// React error boundaries MUST be class components (hooks can't catch
// render errors). Wrap sections of your UI with this so one broken
// component doesn't crash the whole page.
//
// Usage:
//   <ErrorBoundary fallback={<p>Something went wrong.</p>}>
//     <ApplicationTable />
//   </ErrorBoundary>

"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production you'd send this to Sentry / Datadog etc.
    console.error("[ErrorBoundary] Caught error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            <p className="font-semibold">Something went wrong.</p>
            {process.env.NODE_ENV === "development" && (
              <pre className="mt-2 text-xs opacity-75 whitespace-pre-wrap">
                {this.state.error?.message}
              </pre>
            )}
          </div>
        )
      );
    }

    return this.props.children;
  }
}