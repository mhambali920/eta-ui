import type { Meta, StoryObj } from '@storybook/react-vite';
import { EmptyState } from './EmptyState';
import { Button } from '../Button';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['bordered', 'surface', 'default'] },
    hideIcon: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    size: 'md',
    variant: 'bordered',
    title: 'No documents found',
    description: 'Upload a new file or adjust your search filters to find what you need.',
  },
  render: (args) => (
    <div style={{ maxWidth: '520px' }}>
      <EmptyState
        {...args}
        action={
          <>
            <Button variant="outline" size="sm">
              Clear Filters
            </Button>
            <Button variant="solid" size="sm">
              Upload Document
            </Button>
          </>
        }
      />
    </div>
  ),
};
