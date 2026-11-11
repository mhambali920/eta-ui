import type { Meta, StoryObj } from '@storybook/react-vite';
import { PinInput, PinInputGroup, PinInputField, PinInputSeparator } from './PinInput';

const meta: Meta<typeof PinInput> = {
  title: 'Forms/PinInput',
  component: PinInput,
  tags: ['autodocs'],
  argTypes: {
    length: { control: { type: 'number', min: 3, max: 8 } },
    type: { control: 'select', options: ['numeric', 'alphanumeric'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outline', 'filled'] },
    placeholder: { control: 'text' },
    mask: { control: 'boolean' },
    autoFocus: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof PinInput>;

export const Default: Story = {
  args: {
    length: 6,
    type: 'numeric',
    size: 'md',
    variant: 'outline',
    mask: false,
  },
};

export const GroupedWithSeparator: Story = {
  render: () => (
    <PinInput length={6} defaultValue="482">
      <PinInputGroup>
        <PinInputField index={0} />
        <PinInputField index={1} />
        <PinInputField index={2} />
      </PinInputGroup>
      <PinInputSeparator />
      <PinInputGroup>
        <PinInputField index={3} />
        <PinInputField index={4} />
        <PinInputField index={5} />
      </PinInputGroup>
    </PinInput>
  ),
};

export const MaskedAndAlphanumeric: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
          Secret PIN (Masked)
        </p>
        <PinInput length={4} defaultValue="1984" mask />
      </div>
      <div>
        <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 500 }}>
          Invite Code (Alphanumeric + Filled)
        </p>
        <PinInput length={5} type="alphanumeric" variant="filled" defaultValue="ETA26" />
      </div>
    </div>
  ),
};
