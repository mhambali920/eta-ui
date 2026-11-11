import type { Meta, StoryObj } from '@storybook/react-vite';
import { Toggle, ToggleGroup, ToggleGroupItem } from './ToggleGroup';

const meta: Meta<typeof ToggleGroup> = {
  title: 'Forms/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['single', 'multiple'] },
    variant: { control: 'select', options: ['segmented', 'soft', 'outline'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    orientation: { control: 'select', options: ['horizontal', 'vertical'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const SegmentedSingle: Story = {
  args: {
    type: 'single',
    defaultValue: 'monthly',
    variant: 'segmented',
    size: 'md',
  },
  render: (args) => (
    <ToggleGroup {...args} aria-label="Billing cycle">
      <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
      <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
      <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
      <ToggleGroupItem value="yearly">Yearly</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const MultipleToolbar: Story = {
  render: () => (
    <ToggleGroup
      type="multiple"
      variant="outline"
      defaultValue={['bold', 'italic']}
      aria-label="Text formatting"
    >
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const StandaloneToggle: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      <Toggle variant="soft" defaultPressed>
        Notifications On
      </Toggle>
      <Toggle variant="outline">Pin to Sidebar</Toggle>
    </div>
  ),
};
