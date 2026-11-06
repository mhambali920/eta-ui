import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'soft', 'outline', 'ghost'],
      description: 'Visual style variant with soft pastel aesthetics',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info'],
      description: 'Semantic color intent',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    isLoading: {
      control: 'boolean',
      description: 'Display an accessible loading spinner',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable user interaction',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Solid: Story = {
  args: {
    variant: 'solid',
    children: 'Solid Button',
    size: 'md',
  },
};

export const Soft: Story = {
  args: {
    variant: 'soft',
    children: 'Soft Pastel Button',
    size: 'md',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
    size: 'md',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
    size: 'md',
  },
};

export const Loading: Story = {
  args: {
    variant: 'solid',
    isLoading: true,
    children: 'Saving Changes',
    size: 'md',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'soft',
    disabled: true,
    children: 'Disabled Button',
    size: 'md',
  },
};

export const Success: Story = {
  args: {
    color: 'success',
    variant: 'soft',
    children: 'Success / Confirm Action',
    size: 'md',
  },
};

export const Warning: Story = {
  args: {
    color: 'warning',
    variant: 'soft',
    children: 'Warning / Attention',
    size: 'md',
  },
};

export const Danger: Story = {
  args: {
    color: 'danger',
    variant: 'solid',
    children: 'Danger / Delete Item',
    size: 'md',
  },
};

export const Info: Story = {
  args: {
    color: 'info',
    variant: 'outline',
    children: 'Info / More Details',
    size: 'md',
  },
};
