import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandShortcut,
} from './index';

describe('Command', () => {
  it('filters command items by search input and triggers onSelect on click or Enter', () => {
    const onSelect = vi.fn();
    render(
      <Command>
        <CommandInput placeholder="Search commands..." />
        <CommandList>
          <CommandGroup heading="Suggestions">
            <CommandItem value="Search Documentation" onSelect={onSelect}>
              Search Documentation
              <CommandShortcut>⌘D</CommandShortcut>
            </CommandItem>
            <CommandItem value="Toggle Dark Mode" onSelect={onSelect}>
              Toggle Dark Mode
              <CommandShortcut>⌘T</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );

    const input = screen.getByRole('combobox');
    expect(screen.getAllByRole('option')).toHaveLength(2);

    fireEvent.change(input, { target: { value: 'dark' } });
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(1);
    expect(options[0]).toHaveTextContent('Toggle Dark Mode');

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledWith('Toggle Dark Mode');
  });

  it('opens CommandDialog via Ctrl+K / Meta+K shortcut when enableShortcut is true', () => {
    render(
      <CommandDialog enableShortcut>
        <CommandInput placeholder="Spotlight search..." />
        <CommandList>
          <CommandItem value="Go to Dashboard">Go to Dashboard</CommandItem>
        </CommandList>
      </CommandDialog>
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
  });
});
