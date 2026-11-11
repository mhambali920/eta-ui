import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from './ContextMenu';

describe('ContextMenu component', () => {
  it('opens context menu on right-click and triggers item selection', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();

    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="target-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>Actions</ContextMenuLabel>
          <ContextMenuSeparator />
          <ContextMenuItem onSelect={handleSelect}>
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem color="danger">Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    expect(screen.queryByText('Actions')).not.toBeInTheDocument();

    const triggerArea = screen.getByTestId('target-area');
    fireEvent.contextMenu(triggerArea);

    expect(screen.getByRole('menu')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    expect(screen.getByText('Copy')).toBeInTheDocument();
    expect(screen.getByText('⌘C')).toBeInTheDocument();

    const copyItem = screen.getByText('Copy');
    await user.click(copyItem);

    expect(handleSelect).toHaveBeenCalledTimes(1);
  });

  it('renders danger variant item with danger class', () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="target-area">Right click</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem color="danger">Delete Forever</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    fireEvent.contextMenu(screen.getByTestId('target-area'));
    const deleteItem = screen.getByRole('menuitem', { name: 'Delete Forever' });
    expect(deleteItem.className).toContain('danger');
  });

  it('supports checkbox items with toggled state', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = vi.fn();

    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="target-area">Settings Target</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuCheckboxItem checked={true} onCheckedChange={handleCheckedChange}>
            Show Grid
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    fireEvent.contextMenu(screen.getByTestId('target-area'));
    const checkboxItem = screen.getByRole('menuitemcheckbox', { name: 'Show Grid' });
    expect(checkboxItem).toHaveAttribute('aria-checked', 'true');

    await user.click(checkboxItem);
    expect(handleCheckedChange).toHaveBeenCalledWith(false);
  });
});
