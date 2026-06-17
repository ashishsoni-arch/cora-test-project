import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Overview from './Overview';

// Create a fresh QueryClient just for Storybook
const queryClient = new QueryClient();

const meta: Meta<typeof Overview> = {
  title: 'Pages/Dashboard/Overview',
  component: Overview,
  // Wrap the story in the Provider using decorators
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Overview>;

export const Default: Story = {
  render: () => <Overview />,
};
