import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Forms/Textarea',
  component: Textarea,
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
    resize: {
      control: 'select',
      options: ['none', 'vertical', 'horizontal', 'both'],
    },
    placeholder: {
      control: 'text',
    },
    rows: {
      control: 'number',
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
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    variant: 'outline',
    placeholder: 'Write your notes or comments...',
    size: 'md',
    resize: 'vertical',
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    placeholder: 'Filled textarea with subtle background...',
    size: 'md',
    resize: 'none',
  },
};

export const Invalid: Story = {
  args: {
    variant: 'outline',
    isInvalid: true,
    defaultValue: 'This textarea contains invalid content',
    size: 'md',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'This textarea is disabled',
    size: 'md',
  },
};
