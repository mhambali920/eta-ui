import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
  title: 'Forms/Slider',
  component: Slider,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger'],
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    size: 'md',
    color: 'primary',
    disabled: false,
    defaultValue: [45],
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 360, padding: '20px 0' }}>
      <Slider {...args} />
    </div>
  ),
};

export const RangeSlider: Story = {
  args: {
    defaultValue: [25, 75],
  },
  render: (args) => (
    <div style={{ maxWidth: 360, padding: '20px 0' }}>
      <Slider {...args} />
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 360, padding: '20px 0' }}>
      <Slider color="primary" defaultValue={[20]} />
      <Slider color="secondary" defaultValue={[40]} />
      <Slider color="success" defaultValue={[60]} />
      <Slider color="warning" defaultValue={[80]} />
      <Slider color="danger" defaultValue={[95]} />
    </div>
  ),
};
