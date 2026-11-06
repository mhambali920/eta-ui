import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './DropdownMenu';
import { Button } from '../Button';

const meta: Meta<typeof DropdownMenuContent> = {
  title: 'Overlay/DropdownMenu',
  component: DropdownMenuContent,
  tags: ['autodocs'],
  argTypes: {
    sideOffset: {
      control: 'number',
      description: 'The distance in pixels from the trigger.',
    },
  },
};

export default meta;

type Story = StoryObj<typeof DropdownMenuContent>;

export const Default: Story = {
  args: {
    sideOffset: 6,
  },
  render: (args) => (
    <div style={{ padding: 80, display: 'flex', justifyContent: 'center' }}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="solid">Options Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent {...args}>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Keyboard shortcuts
            <DropdownMenuShortcut>?</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem color="danger">
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ),
};

export const WithCheckboxes: Story = {
  args: {
    sideOffset: 6,
  },
  render: (args) => {
    const CheckboxDemo = () => {
      const [showStatusbar, setShowStatusbar] = useState(true);
      const [showActivityBar, setShowActivityBar] = useState(false);
      const [showPanel, setShowPanel] = useState(false);

      return (
        <div style={{ padding: 80, display: 'flex', justifyContent: 'center' }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">View Options</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent {...args}>
              <DropdownMenuLabel>Appearance</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={showStatusbar}
                onCheckedChange={setShowStatusbar}
              >
                Status Bar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showActivityBar}
                onCheckedChange={setShowActivityBar}
              >
                Activity Bar
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showPanel}
                onCheckedChange={setShowPanel}
              >
                Bottom Panel
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    };

    return <CheckboxDemo />;
  },
};

export const WithSubmenuAndRadio: Story = {
  args: {
    sideOffset: 6,
  },
  render: (args) => {
    const SubmenuDemo = () => {
      const [position, setPosition] = useState('bottom');

      return (
        <div style={{ padding: 80, display: 'flex', justifyContent: 'center' }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="soft">More Actions</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent {...args}>
              <DropdownMenuItem>New Tab</DropdownMenuItem>
              <DropdownMenuItem>New Window</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Email link</DropdownMenuItem>
                  <DropdownMenuItem>Messages</DropdownMenuItem>
                  <DropdownMenuItem>Notes</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
                <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    };

    return <SubmenuDemo />;
  },
};
