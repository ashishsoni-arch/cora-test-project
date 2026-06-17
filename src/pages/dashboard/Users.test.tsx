import { render, screen, fireEvent } from '@testing-library/react';
import { useAuthStore } from '../../store/auth.store';
import Users from './Users';

describe('Users Component', () => {
  beforeEach(() => {
    // Clear the store before each test
    useAuthStore.setState({ user: null });
  });

  it('hides the Add User button and Action columns for non-admins', () => {
    useAuthStore.setState({
      user: { id: '2', name: 'User', email: 'user@cora.com', role: 'user' },
    });

    render(<Users />);

    expect(screen.queryByText('+ Add User')).not.toBeInTheDocument();
    expect(screen.queryByText('Actions')).not.toBeInTheDocument();
  });

  it('shows the Add User button for admins and opens the modal', () => {
    useAuthStore.setState({
      user: { id: '1', name: 'Admin', email: 'admin@cora.com', role: 'admin' },
    });

    render(<Users />);

    const addButton = screen.getByText('+ Add User');
    expect(addButton).toBeInTheDocument();

    // Click it to open the modal
    fireEvent.click(addButton);

    // Verify modal elements render
    expect(screen.getByRole('heading', { name: 'Add New User' })).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save User' })).toBeInTheDocument();
  });
});
