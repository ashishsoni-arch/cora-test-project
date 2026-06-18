import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header'; // Adjust the import path as needed

describe('Header Component', () => {
  // Helper function to render the component with Router context
  const renderHeader = (showTopBanner: boolean = false) => {
    return render(
      <MemoryRouter>
        <Header showTopBanner={showTopBanner} />
      </MemoryRouter>
    );
  };

  it('renders the header correctly without the top banner by default', () => {
    renderHeader();

    // Verify the banner text is NOT present
    expect(screen.queryByText(/From new grads to seasoned pros/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Explore CORA Careers/i)).not.toBeInTheDocument();

    // Verify the main brand text is present
    expect(screen.getByText(/CORA Physical Therapy/i)).toBeInTheDocument();

    // Verify phone number is present
    expect(screen.getByText('1.866.443.2672')).toBeInTheDocument();
  });

  it('renders the top banner when showTopBanner is true', () => {
    renderHeader(true);

    // Verify the banner text IS present
    expect(screen.getByText(/From new grads to seasoned pros/i)).toBeInTheDocument();

    // Verify the career link in the banner is present and has the correct href
    const careerLink = screen.getByRole('link', { name: /Explore CORA Careers/i });
    expect(careerLink).toBeInTheDocument();
    expect(careerLink).toHaveAttribute('href', '/contact');
  });

  it('renders all main navigation links with correct routes', () => {
    renderHeader();

    // Check Home logo link
    const homeLink = screen.getByRole('link', { name: /C CORA Physical Therapy/i });
    expect(homeLink).toHaveAttribute('href', '/');

    // Check About link
    const aboutLink = screen.getByRole('link', { name: /About/i });
    expect(aboutLink).toHaveAttribute('href', '/about');

    // Check Login link
    const loginLink = screen.getByRole('link', { name: /Login/i });
    expect(loginLink).toHaveAttribute('href', '/login');

    // Check primary Contact button/link
    const contactLink = screen.getByRole('link', { name: /^Contact$/i });
    expect(contactLink).toHaveAttribute('href', '/contact');
  });
});
