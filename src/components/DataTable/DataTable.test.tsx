import { render, screen } from '@testing-library/react';
import DataTable from './DataTable';
import type { Person } from '../../types/datatable';

describe('DataTable', () => {
  it('renders an empty state when no rows exist', () => {
    render(
      <DataTable<Person>
        columns={[{ header: 'Name', accessor: 'name' }]}
        data={[]}
        rowKey={(row) => row.id}
      />
    );

    expect(screen.getByText('No records found.')).toBeInTheDocument();
  });

  it('renders table rows for provided data using string accessors', () => {
    const data = [{ id: '1', name: 'Avery Chen', email: 'avery@cora.com', role: 'Admin' }];

    render(
      <DataTable<Person>
        columns={[
          { header: 'Name', accessor: 'name' },
          { header: 'Email', accessor: 'email' },
          { header: 'Role', accessor: 'role' },
        ]}
        data={data}
        rowKey={(row) => row.id}
      />
    );

    expect(screen.getByText('Avery Chen')).toBeInTheDocument();
    expect(screen.getByText('avery@cora.com')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  // NEW: Test our functional accessor feature!
  it('renders React nodes when the accessor is a custom function', () => {
    const data = [{ id: '1', name: 'Avery Chen', email: 'avery@cora.com', role: 'Admin' }];

    render(
      <DataTable<Person>
        columns={[
          { header: 'Name', accessor: 'name' },
          {
            header: 'Actions',
            accessor: (row) => <button data-testid={`action-${row.id}`}>Edit {row.name}</button>,
          },
        ]}
        data={data}
        rowKey={(row) => row.id}
      />
    );

    expect(screen.getByTestId('action-1')).toHaveTextContent('Edit Avery Chen');
  });
});
