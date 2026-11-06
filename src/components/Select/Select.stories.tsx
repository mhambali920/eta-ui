import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from './Select';

const meta: Meta<typeof SelectTrigger> = {
  title: 'Forms/Select',
  component: SelectTrigger,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['outline', 'filled'],
    },
    isInvalid: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    size: 'md',
    variant: 'outline',
    isInvalid: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof SelectTrigger>;

export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <Select defaultValue="sage">
        <SelectTrigger {...args}>
          <SelectValue placeholder="Select a palette theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Soft Colors</SelectLabel>
            <SelectItem value="sage">Sage Green (Primary)</SelectItem>
            <SelectItem value="dusty">Dusty Blue (Secondary)</SelectItem>
            <SelectItem value="sand">Warm Sand (Surface)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Status Tones</SelectLabel>
            <SelectItem value="mint">Soft Mint (Success)</SelectItem>
            <SelectItem value="amber">Warm Amber (Warning)</SelectItem>
            <SelectItem value="rose">Soft Rose (Error)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const FilledVariant: Story = {
  args: {
    variant: 'filled',
  },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <Select defaultValue="id">
        <SelectTrigger {...args}>
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="id">Bahasa Indonesia</SelectItem>
          <SelectItem value="en">English (US)</SelectItem>
          <SelectItem value="ja">日本語 (Japanese)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
