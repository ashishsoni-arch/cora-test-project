import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '../../test-utils';
import Login from './Login';

describe('Login page', () => {
  it('renders login form and validation errors', async () => {
    renderWithProviders(<Login />);

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
  });

  it('shows auth error when credentials are invalid', async () => {
    renderWithProviders(<Login />);

    fireEvent.change(screen.getByRole('textbox', { name: /email address/i }), {
      target: { value: 'unknown@cora.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'invalidpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/email or password is incorrect/i)).toBeInTheDocument();
  });
});
