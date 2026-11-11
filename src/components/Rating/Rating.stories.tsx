import type { Meta, StoryObj } from '@storybook/react';
import { Rating } from './Rating';

const meta: Meta<typeof Rating> = {
  title: 'Components/Rating',
  component: Rating,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'number', min: 0, max: 10, step: 0.5 },
      description: 'Controlled rating value',
    },
    defaultValue: {
      control: { type: 'number', min: 0, max: 10, step: 0.5 },
      description: 'Initial uncontrolled rating value',
    },
    max: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'Maximum number of stars',
    },
    precision: {
      control: 'select',
      options: [1, 0.5],
      description: 'Minimum increment for star selection (full star or half star)',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of star icons',
    },
    color: {
      control: 'select',
      options: ['warning', 'primary', 'danger'],
      description: 'Visual accent color of active stars',
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether the rating is read-only (display only)',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
  args: {
    defaultValue: 3,
    max: 5,
    precision: 1,
    size: 'md',
    color: 'warning',
    readOnly: false,
    disabled: false,
  },
  render: (args) => <Rating {...args} />,
};

export const HalfStarPrecision: Story = {
  args: {
    defaultValue: 3.5,
    precision: 0.5,
    max: 5,
    size: 'md',
    color: 'warning',
  },
  render: (args) => <Rating {...args} />,
};

export const ReadOnly: Story = {
  args: {
    value: 4.5,
    precision: 0.5,
    max: 5,
    readOnly: true,
  },
  render: (args) => <Rating {...args} />,
};
