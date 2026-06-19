import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Users from './Users';
import { useAuthStore } from '../../store/auth.store';
import type { AuthState } from '../../types/auth';

// Mock Auth Store
jest.mock('../../store/auth.store', () => ({
  useAuthStore: jest.fn(),
}));

// Mock the SearchInput component so we can easily trigger the onSearch prop
jest.mock('../../components/SearchInput/SearchInput', () => ({
  __esModule: true,
  default: ({ onSearch }: { onSearch: (val: string) => void }) => (
    <input
      data-testid="mock-search"
      onChange={(e) => onSearch(e.target.value)}
      placeholder="Search..."
    />
  ),
}));

describe('Users Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Simulate an Admin user so the Add/Edit/Delete buttons render
    (useAuthStore as unknown as jest.Mock).mockImplementation(
      (selector: (state: AuthState) => unknown) =>
        selector({
          user: { id: '99', name: 'Super Admin', role: 'admin', email: 'admin@cora.com' },
        } as AuthState)
    );
    // Mock window.confirm to always return true (simulating the user clicking "OK")
    window.confirm = jest.fn(() => true);
  });

  it('allows an admin to add a new user', async () => {
    render(<Users />);

    // Open the Add User modal
    fireEvent.click(screen.getByText('+ Add User'));
    expect(screen.getByText('Add New User')).toBeInTheDocument();

    // Fill out the React Hook Form
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Employee' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'new@cora.com' } });
    fireEvent.change(screen.getByLabelText(/Role/i), { target: { value: 'user' } });

    // Submit
    fireEvent.click(screen.getByText('Save User'));

    // Wait for the modal to close and the new user to appear in the table
    await waitFor(() => {
      expect(screen.queryByText('Add New User')).not.toBeInTheDocument();
    });
    expect(screen.getByText('New Employee')).toBeInTheDocument();
    expect(screen.getByText('new@cora.com')).toBeInTheDocument();
  });

  it('allows an admin to edit an existing user', async () => {
    render(<Users />);

    // Find all Edit buttons and click the first one (Avery Chen)
    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    // Ensure the modal opened with pre-filled data
    expect(screen.getByText(/Edit User: Avery Chen/i)).toBeInTheDocument();

    // Change the name
    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: 'Avery Modified' } });

    // Submit
    fireEvent.click(screen.getByText('Save User'));

    // Wait for modal to close and table to update
    await waitFor(() => {
      expect(screen.queryByText(/Edit User:/i)).not.toBeInTheDocument();
    });
    expect(screen.getByText('Avery Modified')).toBeInTheDocument();
  });

  it('allows an admin to delete a user', () => {
    render(<Users />);

    // Find all Delete buttons and click the first one (Avery Chen)
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // Verify window.confirm was called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this user?');

    // Verify Avery was removed from the DOM
    expect(screen.queryByText('Avery Chen')).not.toBeInTheDocument();
  });

  it('filters the data table when a search term is entered', async () => {
    render(<Users />);

    // Verify both initial mock users are present
    expect(screen.getByText('Avery Chen')).toBeInTheDocument();
    expect(screen.getByText('Jordan Lee')).toBeInTheDocument();

    // Type into the mocked search input
    const searchInput = screen.getByTestId('mock-search');
    fireEvent.change(searchInput, { target: { value: 'Jordan' } });

    // Verify Avery disappears and Jordan remains
    await waitFor(() => {
      expect(screen.getByText('Jordan Lee')).toBeInTheDocument();
      expect(screen.queryByText('Avery Chen')).not.toBeInTheDocument();
    });
  });
});
