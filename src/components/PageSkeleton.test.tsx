import { render, screen } from '@testing-library/react';
import PageSkeleton from './PageSkeleton';

describe('PageSkeleton', () => {
  it('renders children content and skeleton markup', () => {
    render(
      <PageSkeleton>
        <div>Child content</div>
      </PageSkeleton>
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });
});
