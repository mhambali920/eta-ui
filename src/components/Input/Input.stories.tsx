import type { Meta, StoryObj } from '@storybook/react-vite';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['outline', 'filled', 'unstyled'],
    },
    placeholder: {
      control: 'text',
    },
    isInvalid: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    readOnly: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Outline: Story = {
  args: {
    variant: 'outline',
    placeholder: 'Enter your email...',
    size: 'md',
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    placeholder: 'Search documentation...',
    size: 'md',
  },
};

export const Invalid: Story = {
  args: {
    variant: 'outline',
    isInvalid: true,
    defaultValue: 'invalid@address',
    size: 'md',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'Readonly / Disabled value',
    size: 'md',
  },
};
