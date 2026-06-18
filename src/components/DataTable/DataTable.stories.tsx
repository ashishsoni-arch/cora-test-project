import type { Meta, StoryObj } from '@storybook/react';
import DataTable from './DataTable';
import type { Person } from '../../types/datatable';

const meta: Meta<typeof DataTable> = {
  title: 'Components/DataTable',
  component: DataTable,
};

export default meta;

type Story = StoryObj<typeof DataTable<Person>>;

const mockData: Person[] = [
  { id: '1', name: 'Avery Chen', email: 'avery@cora.com', role: 'Admin' },
  { id: '2', name: 'Jordan Lee', email: 'jordan@cora.com', role: 'Manager' },
];

export const Default: Story = {
  args: {
    data: mockData,
    rowKey: (row: Person) => row.id,
    columns: [
      { header: 'Name', accessor: 'name', width: 'w-2/5' },
      { header: 'Email', accessor: 'email', width: 'w-2/5' },
      { header: 'Role', accessor: 'role', width: 'w-1/5' },
    ],
  },
};

// NEW: Show off the custom functional accessors
export const WithCustomActions: Story = {
  args: {
    data: mockData,
    rowKey: (row: Person) => row.id,
    columns: [
      { header: 'Name', accessor: 'name', width: 'w-1/3' },
      { header: 'Email', accessor: 'email', width: 'w-1/3' },
      {
        header: 'Actions',
        width: 'w-1/3',
        accessor: () => (
          <div className="flex gap-3">
            <button className="text-sky-600 font-semibold hover:underline">Edit</button>
            <button className="text-rose-600 font-semibold hover:underline">Delete</button>
          </div>
        ),
      },
    ],
  },
};
