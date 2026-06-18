import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import SearchInput from './SearchInput';

const meta = {
  title: 'Components/SearchInput',
  component: SearchInput,
  // This automatically generates documentation for your component!
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  args: {
    // This wires up the onSearch prop to Storybook's Action logger
    onSearch: fn(),
  },
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// The default state of the search bar
export const Default: Story = {};

// You can also create a story showing how it looks inside a specific container width
export const InsideContainer: Story = {
  decorators: [
    (Story) => (
      <div className="w-72 p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50">
        <Story />
      </div>
    ),
  ],
};
