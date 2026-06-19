import { render, screen } from '@testing-library/react';
import StatusChip from './StatusChip';

describe('StatusChip', () => {
  it.each([
    ['pending', 'bg-amber-100', 'text-amber-700'],
    ['completed', 'bg-emerald-100', 'text-emerald-700'],
    ['review', 'bg-sky-100', 'text-sky-700'],
  ] as const)('renders %s status with the expected styles', (status, bgClass, textClass) => {
    render(<StatusChip status={status} />);

    const chip = screen.getByText(status);
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveClass(bgClass);
    expect(chip).toHaveClass(textClass);
  });
});
