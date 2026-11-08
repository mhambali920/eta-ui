import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField, FormLabel, FormHelperText, FormErrorMessage } from './FormField';
import { Input } from '../Input';
import { Textarea } from '../Textarea';

const meta: Meta<typeof FormField> = {
  title: 'Components/FormField',
  component: FormField,
  tags: ['autodocs'],
  argTypes: {
    isRequired: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {
  args: {
    isRequired: false,
    isInvalid: false,
    isDisabled: false,
  },
  render: (args) => (
    <div style={{ maxWidth: '380px' }}>
      <FormField {...args}>
        <FormLabel optionalText="(Optional)">Full Name</FormLabel>
        <Input placeholder="Jane Doe" />
        <FormHelperText>Use your official name as it appears on documents.</FormHelperText>
        <FormErrorMessage>Please enter a valid full name.</FormErrorMessage>
      </FormField>
    </div>
  ),
};

export const RequiredAndInvalid: Story = {
  render: () => (
    <div style={{ maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <FormField isRequired isInvalid>
        <FormLabel>Work Email</FormLabel>
        <Input defaultValue="invalid-email@" />
        <FormHelperText>We send workspace invites to this address.</FormHelperText>
        <FormErrorMessage>Please enter a valid email address.</FormErrorMessage>
      </FormField>

      <FormField
        label="Project Notes"
        optionalText="(Optional)"
        helperText="Briefly describe your goals."
      >
        <Textarea placeholder="Write notes here..." rows={3} />
      </FormField>
    </div>
  ),
};

export const DisabledField: Story = {
  render: () => (
    <div style={{ maxWidth: '380px' }}>
      <FormField isDisabled label="Organization ID" helperText="Managed by your administrator.">
        <Input defaultValue="org_94827104" />
      </FormField>
    </div>
  ),
};
