import type { Meta, StoryObj } from '@storybook/react-vite';
import { RadioGroup, Radio } from './Radio';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  args: {
    size: 'md',
    orientation: 'vertical',
    disabled: false,
  },
  render: (args) => (
    <RadioGroup defaultValue="starter" {...args}>
      <Radio
        value="starter"
        label="Starter Plan"
        description="Ideal for hobbyists and individual developers."
      />
      <Radio
        value="pro"
        label="Pro Plan"
        description="Unlimited components, priority support, and team tokens."
      />
      <Radio
        value="enterprise"
        label="Enterprise Plan"
        description="Dedicated SLA, audit logs, and on-premise deployment."
      />
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: (args) => (
    <RadioGroup defaultValue="daily" orientation="horizontal" {...args}>
      <Radio value="daily" label="Daily" />
      <Radio value="weekly" label="Weekly" />
      <Radio value="monthly" label="Monthly" />
    </RadioGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <RadioGroup defaultValue="sm">
        <Radio size="sm" value="sm" label="Small size (16px)" />
      </RadioGroup>
      <RadioGroup defaultValue="md">
        <Radio size="md" value="md" label="Medium size (20px)" />
      </RadioGroup>
      <RadioGroup defaultValue="lg">
        <Radio size="lg" value="lg" label="Large size (24px)" />
      </RadioGroup>
    </div>
  ),
};
