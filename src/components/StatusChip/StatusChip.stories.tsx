import type { Meta, StoryObj } from '@storybook/react';
import StatusChip from './StatusChip';

const meta: Meta<typeof StatusChip> = {
  title: 'Components/StatusChip',
  component: StatusChip,
};

export default meta;

type Story = StoryObj<typeof StatusChip>;

export const Pending: Story = { args: { status: 'pending' } };
export const Completed: Story = { args: { status: 'completed' } };
export const Review: Story = { args: { status: 'review' } };
