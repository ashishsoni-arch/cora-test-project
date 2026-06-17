import { render, screen } from '@testing-library/react';
import { withErrorBoundary } from './withErrorBoundary';

const NormalComponent = () => <div>Normal content</div>;
const ErrorComponent = () => {
  throw new Error('Render failure');
};

describe('withErrorBoundary', () => {
  it('renders wrapped component content when no error occurs', () => {
    const Wrapped = withErrorBoundary(NormalComponent, <div>Fallback</div>);

    render(<Wrapped />);

    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('renders fallback content when the wrapped component throws', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const errorEventHandler = (event: ErrorEvent) => {
      event.preventDefault();
    };
    window.addEventListener('error', errorEventHandler);

    const Wrapped = withErrorBoundary(ErrorComponent, <div>Fallback</div>);

    render(<Wrapped />);

    expect(screen.getByText('Fallback')).toBeInTheDocument();

    window.removeEventListener('error', errorEventHandler);
    consoleErrorSpy.mockRestore();
  });
});
