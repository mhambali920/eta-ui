import type { Meta, StoryObj } from '@storybook/react-vite';
import { Combobox } from './Combobox';

const COUNTRIES = [
  { value: 'id', label: 'Indonesia' },
  { value: 'jp', label: 'Japan' },
  { value: 'sg', label: 'Singapore' },
  { value: 'ch', label: 'Switzerland' },
  { value: 'no', label: 'Norway' },
  { value: 'nz', label: 'New Zealand' },
];

const meta: Meta<typeof Combobox> = {
  title: 'Forms/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outline', 'filled'] },
    placeholder: { control: 'text' },
    emptyMessage: { control: 'text' },
    multiple: { control: 'boolean' },
    isClearable: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Default: Story = {
  args: {
    options: COUNTRIES,
    placeholder: 'Select a country...',
    size: 'md',
    variant: 'outline',
    isClearable: true,
  },
  render: (args) => (
    <div style={{ maxWidth: '320px', minHeight: '220px' }}>
      <Combobox {...args} aria-label="Country" />
    </div>
  ),
};

export const MultipleSelection: Story = {
  render: () => (
    <div style={{ maxWidth: '360px', minHeight: '220px' }}>
      <Combobox
        options={COUNTRIES}
        multiple
        defaultValue={['id', 'jp']}
        placeholder="Add destinations..."
        aria-label="Destinations"
      />
    </div>
  ),
};
