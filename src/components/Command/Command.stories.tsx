import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from './Command';
import { Button } from '../Button';

const meta: Meta<typeof Command> = {
  title: 'Components/Command',
  component: Command,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Command>;

export const InlineCommandPalette: Story = {
  render: () => (
    <div style={{ maxWidth: '460px' }}>
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandGroup heading="Quick Actions">
            <CommandItem value="Create New Component">
              <span>Create New Component</span>
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandItem value="Switch Theme">
              <span>Switch Theme (Light / Dark)</span>
              <CommandShortcut>⌘J</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Navigation">
            <CommandItem value="Documentation">
              <span>Documentation</span>
              <CommandShortcut>⌘D</CommandShortcut>
            </CommandItem>
            <CommandItem value="Design Tokens">
              <span>Design Tokens</span>
              <CommandShortcut>⌘T</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
};

export const SpotlightModal: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button variant="soft" onClick={() => setOpen(true)}>
          Open Command Palette (⌘K)
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen} enableShortcut>
          <CommandInput placeholder="Search actions, pages, or themes..." />
          <CommandList>
            <CommandGroup heading="Workspace">
              <CommandItem value="New Project" onSelect={() => setOpen(false)}>
                <span>New Project</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem value="Invite Collaborators" onSelect={() => setOpen(false)}>
                <span>Invite Collaborators</span>
                <CommandShortcut>⌘I</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
    );
  },
};
