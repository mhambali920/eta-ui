import type { Meta, StoryObj } from '@storybook/react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverBody,
  PopoverFooter,
  PopoverClose,
} from './Popover';
import { Button } from '../Button';
import { Input } from '../Input';

const meta: Meta<typeof PopoverContent> = {
  title: 'Overlay/Popover',
  component: PopoverContent,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'auto'],
    },
    side: {
      control: 'select',
      options: ['bottom', 'top', 'right', 'left'],
    },
    align: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
    sideOffset: {
      control: 'number',
    },
    hasArrow: {
      control: 'boolean',
    },
    showCloseButton: {
      control: 'boolean',
    },
    closeLabel: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof PopoverContent>;

export const Default: Story = {
  args: {
    size: 'md',
    side: 'bottom',
    align: 'center',
    sideOffset: 8,
    hasArrow: true,
    showCloseButton: true,
    closeLabel: 'Close popover',
  },
  render: (args) => (
    <div style={{ padding: 60, display: 'flex', justifyContent: 'center' }}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="solid">Popover Settings</Button>
        </PopoverTrigger>
        <PopoverContent {...args}>
          <PopoverHeader>
            <PopoverTitle>Display Settings</PopoverTitle>
            <PopoverDescription>Adjust your view preferences.</PopoverDescription>
          </PopoverHeader>
          <PopoverBody style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', marginBottom: 4 }}>
                Density
              </label>
              <Input size="sm" defaultValue="Compact" />
            </div>
          </PopoverBody>
          <PopoverFooter>
            <PopoverClose asChild>
              <Button size="sm" variant="ghost">Close</Button>
            </PopoverClose>
            <Button size="sm" variant="solid">Save</Button>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
