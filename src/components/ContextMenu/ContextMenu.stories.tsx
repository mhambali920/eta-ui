import type { Meta, StoryObj } from '@storybook/react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from './ContextMenu';

const meta: Meta<typeof ContextMenuContent> = {
  title: 'Overlay/ContextMenu',
  component: ContextMenuContent,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the context menu items and typography',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ContextMenuContent>;

export const Default: Story = {
  args: {
    size: 'md',
  },
  render: (args) => (
    <ContextMenu size={args.size}>
      <ContextMenuTrigger>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 220,
            width: '100%',
            maxWidth: 420,
            border: '2px dashed var(--eta-border-default)',
            borderRadius: 'var(--eta-radius-lg)',
            backgroundColor: 'var(--eta-bg-subtle)',
            color: 'var(--eta-text-muted)',
            fontSize: '0.875rem',
            userSelect: 'none',
            margin: '20px auto',
          }}
        >
          Right-click inside this zone
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent {...args}>
        <ContextMenuLabel>Actions</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Developer Tools</ContextMenuItem>
            <ContextMenuItem>Task Manager</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuCheckboxItem checked>Show Bookmarks</ContextMenuCheckboxItem>
        <ContextMenuSeparator />
        <ContextMenuItem color="danger">Delete Page</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
};
