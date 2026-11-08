import type { Meta, StoryObj } from '@storybook/react-vite';
import { Progress, CircularProgress } from './Progress';

const meta: Meta<typeof Progress> = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info'],
    },
    isIndeterminate: { control: 'boolean' },
    hasStripe: { control: 'boolean' },
    isAnimated: { control: 'boolean' },
    showValueLabel: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: {
    value: 64,
    size: 'md',
    color: 'primary',
    label: 'Storage Capacity',
    showValueLabel: true,
  },
};

export const SemanticColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '420px' }}>
      <Progress value={40} color="primary" label="Primary" showValueLabel />
      <Progress value={55} color="secondary" label="Secondary" showValueLabel />
      <Progress value={100} color="success" label="Completed" showValueLabel />
      <Progress value={75} color="warning" label="Approaching Limit" showValueLabel />
      <Progress value={92} color="danger" label="Critical Usage" showValueLabel />
      <Progress value={30} color="info" label="Syncing" showValueLabel />
    </div>
  ),
};

export const StripedAndIndeterminate: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '420px' }}>
      <Progress value={68} hasStripe isAnimated size="lg" label="Animated Striped Progress" showValueLabel />
      <Progress isIndeterminate color="primary" size="md" label="Indeterminate Loading..." />
    </div>
  ),
};

export const CircularVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
      <CircularProgress value={25} size="sm" color="secondary" />
      <CircularProgress value={65} size="md" color="primary" showValueLabel />
      <CircularProgress value={88} size="lg" color="success" showValueLabel />
      <CircularProgress value={42} size="xl" color="warning" showValueLabel />
      <CircularProgress isIndeterminate size="lg" color="primary" />
    </div>
  ),
};
