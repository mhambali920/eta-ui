import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    defaultChecked: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    isInvalid: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Subscribe to newsletter',
    description: 'Receive weekly updates about eta-ui releases and tutorials.',
    size: 'md',
  },
};

export const Checked: Story = {
  args: {
    label: 'Enable notifications',
    defaultChecked: true,
    size: 'md',
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'Select all items',
    checked: 'indeterminate',
    size: 'md',
  },
};

export const Invalid: Story = {
  args: {
    label: 'I accept the terms and conditions',
    description: 'You must accept to proceed.',
    isInvalid: true,
    size: 'md',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled setting',
    description: 'This configuration is locked by admin policy.',
    disabled: true,
    defaultChecked: true,
    size: 'md',
  },
};
