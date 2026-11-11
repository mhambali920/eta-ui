import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '../../theme';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Feedback/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider defaultTheme="light">
        <div style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: 'select',
      options: ['icon', 'segmented'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showSystem: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const IconButton: Story = {
  args: {
    variant: 'icon',
    size: 'md',
    showSystem: true,
  },
};

export const Segmented: Story = {
  args: {
    variant: 'segmented',
    size: 'md',
    showSystem: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <ThemeToggle size="sm" />
      <ThemeToggle size="md" />
      <ThemeToggle size="lg" />
    </div>
  ),
};

export const SegmentedSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ThemeToggle variant="segmented" size="sm" />
      <ThemeToggle variant="segmented" size="md" />
      <ThemeToggle variant="segmented" size="lg" />
    </div>
  ),
};
