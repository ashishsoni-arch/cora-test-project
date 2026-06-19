import type { Meta, StoryObj } from '@storybook/react';
import PageSkeleton from './PageSkeleton';

const meta: Meta<typeof PageSkeleton> = {
  title: 'Components/PageSkeleton',
  component: PageSkeleton,
};

export default meta;

type Story = StoryObj<typeof PageSkeleton>;

export const Default: Story = {
  render: () => <PageSkeleton />,
};
