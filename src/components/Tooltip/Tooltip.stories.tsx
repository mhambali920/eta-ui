import type { Meta, StoryObj } from '@storybook/react';
import { TooltipProvider, Tooltip } from './Tooltip';
import { Button } from '../Button';

const meta: Meta<typeof Tooltip> = {
  title: 'Overlay/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['dark', 'soft'],
    },
    side: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
    hasArrow: {
      control: 'boolean',
    },
  },
  args: {
    variant: 'dark',
    side: 'top',
    hasArrow: true,
  },
  decorators: [
    (Story) => (
      <TooltipProvider delayDuration={150}>
        <div style={{ padding: 48, display: 'flex', gap: 16 }}>
          <Story />
        </div>
      </TooltipProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  args: {
    content: 'Edit project configuration',
  },
  render: (args) => (
    <Tooltip {...args}>
      <Button variant="solid">Hover Me</Button>
    </Tooltip>
  ),
};

export const Variants: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 20 }}>
      <Tooltip content="Dark contrast tooltip (Default)" variant="dark" side="top">
        <Button variant="solid">Dark Variant</Button>
      </Tooltip>
      <Tooltip content="Soft surface styled tooltip" variant="soft" side="bottom">
        <Button variant="soft">Soft Variant</Button>
      </Tooltip>
    </div>
  ),
};

export const Placements: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 24 }}>
      <Tooltip content="Tooltip on Top" side="top">
        <Button variant="outline">Top</Button>
      </Tooltip>
      <Tooltip content="Tooltip on Right" side="right">
        <Button variant="outline">Right</Button>
      </Tooltip>
      <Tooltip content="Tooltip on Bottom" side="bottom">
        <Button variant="outline">Bottom</Button>
      </Tooltip>
      <Tooltip content="Tooltip on Left" side="left">
        <Button variant="outline">Left</Button>
      </Tooltip>
    </div>
  ),
};
