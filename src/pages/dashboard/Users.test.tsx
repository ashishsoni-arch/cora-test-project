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

  it('filters the data table when a user types in the search input', () => {
    // Set up as an admin just to render the full view
    useAuthStore.setState({
      user: { id: '1', name: 'Admin', email: 'admin@cora.com', role: 'admin' },
    });

    render(<Users />);

    // 1. Verify both mock users render initially
    expect(screen.getByText('Avery Chen')).toBeInTheDocument();
    expect(screen.getByText('Jordan Lee')).toBeInTheDocument();

    // 2. Find the search input (assuming it has a standard textbox role)
    // If your SearchInput has a specific placeholder, you can also use getByPlaceholderText
    const searchInput = screen.getByRole('textbox');

    // 3. Simulate typing 'jordan' into the search box
    fireEvent.change(searchInput, { target: { value: 'jordan' } });

    // 4. Verify 'Jordan Lee' is still visible, but 'Avery Chen' has been filtered out
    expect(screen.getByText('Jordan Lee')).toBeInTheDocument();
    expect(screen.queryByText('Avery Chen')).not.toBeInTheDocument();
  });
});
