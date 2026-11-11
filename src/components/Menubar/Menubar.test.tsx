import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarSeparator,
  MenubarShortcut,
} from './Menubar';

describe('Menubar component', () => {
  it('opens menubar content when trigger is clicked and selects item', async () => {
    const user = userEvent.setup();
    const handleNewFile = vi.fn();

    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onSelect={handleNewFile}>
              New Tab
              <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem color="danger">Close Window</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Undo</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );

    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.queryByText('New Tab')).not.toBeInTheDocument();

    await user.click(screen.getByText('File'));

    expect(screen.getByText('New Tab')).toBeInTheDocument();
    expect(screen.getByText('⌘T')).toBeInTheDocument();

    const newItem = screen.getByText('New Tab');
    await user.click(newItem);

    expect(handleNewFile).toHaveBeenCalledTimes(1);
  });

  it('handles checkbox item toggle correctly', async () => {
    const user = userEvent.setup();
    const handleCheckedChange = vi.fn();

    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked={true} onCheckedChange={handleCheckedChange}>
              Always Show Bookmarks
            </MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );

    await user.click(screen.getByText('View'));
    const checkboxItem = screen.getByRole('menuitemcheckbox', {
      name: 'Always Show Bookmarks',
    });
    expect(checkboxItem).toHaveAttribute('aria-checked', 'true');

    await user.click(checkboxItem);
    expect(handleCheckedChange).toHaveBeenCalledWith(false);
  });
});
