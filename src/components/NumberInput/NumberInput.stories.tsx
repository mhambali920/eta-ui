import type { Meta, StoryObj } from '@storybook/react-vite';
import { NumberInput } from './NumberInput';

const meta: Meta<typeof NumberInput> = {
  title: 'Forms/NumberInput',
  component: NumberInput,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outline', 'filled'] },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    precision: { control: 'number' },
    placeholder: { control: 'text' },
    allowMouseWheel: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof NumberInput>;

export const Default: Story = {
  args: {
    defaultValue: 10,
    min: 0,
    max: 100,
    step: 1,
    size: 'md',
    variant: 'outline',
  },
  render: (args) => (
    <div style={{ maxWidth: '240px' }}>
      <NumberInput {...args} aria-label="Quantity" />
    </div>
  ),
};

export const DecimalPrecisionAndStep: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '240px' }}>
      <NumberInput defaultValue={2.5} min={0} max={10} step={0.25} precision={2} aria-label="Decimal value" />
      <NumberInput defaultValue={50} min={0} max={500} step={10} variant="filled" aria-label="Step by 10" />
    </div>
  ),
};

export const SizesAndStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '240px' }}>
      <NumberInput size="sm" defaultValue={1} aria-label="Small" />
      <NumberInput size="md" defaultValue={2} aria-label="Medium" />
      <NumberInput size="lg" defaultValue={3} aria-label="Large" />
      <NumberInput isInvalid defaultValue={99} aria-label="Invalid" />
      <NumberInput disabled defaultValue={42} aria-label="Disabled" />
    </div>
  ),
};
