import { Component, type ErrorInfo, type PropsWithChildren, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<PropsWithChildren<ErrorBoundaryProps>, ErrorBoundaryState> {
  constructor(props: PropsWithChildren<ErrorBoundaryProps>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Integrate with external logging here if needed.
    // eslint-disable-next-line no-console
    console.error('Uncaught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export function withErrorBoundary<TProps extends object>(
  ComponentToWrap: React.ComponentType<TProps>,
  fallback: ReactNode
) {
  const WrappedComponent = (props: TProps) => (
    <ErrorBoundary fallback={fallback}>
      <ComponentToWrap {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${ComponentToWrap.displayName ?? ComponentToWrap.name ?? 'Component'})`;

  return WrappedComponent;
}
