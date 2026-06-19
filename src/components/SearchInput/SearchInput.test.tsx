import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from './SearchInput';

describe('SearchInput Component', () => {
  it('renders with the correct placeholder', () => {
    // 1. Render the component with a dummy function
    render(<SearchInput onSearch={() => {}} />);

    // 2. Verify it appears on the screen
    const inputElement = screen.getByPlaceholderText('Search users...');
    expect(inputElement).toBeInTheDocument();
  });

  it('calls the onSearch callback with the typed value', () => {
    // 1. Create a "spy" function to track calls
    const mockOnSearch = jest.fn();

    // 2. Render the component with our spy
    render(<SearchInput onSearch={mockOnSearch} />);
    const inputElement = screen.getByPlaceholderText('Search users...');

    // 3. Simulate a user typing "admin"
    fireEvent.change(inputElement, { target: { value: 'admin' } });

    // 4. Verify our spy was called exactly once, with the string "admin"
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('admin');
  });
});
