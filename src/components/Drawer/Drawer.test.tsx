import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from './Drawer';

describe('Drawer / Sheet component', () => {
  it('opens and closes drawer when trigger and close button are clicked', async () => {
    const user = userEvent.setup();

    render(
      <Drawer>
        <DrawerTrigger asChild>
          <button>Open Drawer</button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Navigation Menu</DrawerTitle>
            <DrawerDescription>Drawer quick links</DrawerDescription>
          </DrawerHeader>
          <DrawerBody>Drawer body list</DrawerBody>
          <DrawerFooter>
            <DrawerClose asChild>
              <button>Done</button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );

    expect(screen.queryByText('Navigation Menu')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open Drawer' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Navigation Menu')).toBeInTheDocument();
    expect(screen.getByText('Drawer quick links')).toBeInTheDocument();
    expect(screen.getByText('Drawer body list')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: 'Close drawer' });
    await user.click(closeBtn);

    expect(screen.queryByText('Navigation Menu')).not.toBeInTheDocument();
  });

  it('renders different sides (right, left, top, bottom)', () => {
    const { rerender } = render(
      <Drawer open>
        <DrawerContent side="left" data-testid="drawer">
          <DrawerTitle>Left</DrawerTitle>
        </DrawerContent>
      </Drawer>
    );
    let el = screen.getByTestId('drawer');
    expect(el.className).toContain('side-left');

    rerender(
      <Drawer open>
        <DrawerContent side="bottom" data-testid="drawer">
          <DrawerTitle>Bottom</DrawerTitle>
        </DrawerContent>
      </Drawer>
    );
    el = screen.getByTestId('drawer');
    expect(el.className).toContain('side-bottom');
  });

  it('renders sizes properly', () => {
    render(
      <Drawer open>
        <DrawerContent size="lg" data-testid="drawer">
          <DrawerTitle>Large</DrawerTitle>
        </DrawerContent>
      </Drawer>
    );
    const el = screen.getByTestId('drawer');
    expect(el.className).toContain('size-lg');
  });

  it('works with Sheet semantic alias', async () => {
    const user = userEvent.setup();

    render(
      <Sheet>
        <SheetTrigger asChild>
          <button>Open Sheet</button>
        </SheetTrigger>
        <SheetContent>
          <SheetTitle>Sheet Panel Title</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByRole('button', { name: 'Open Sheet' }));
    expect(screen.getByText('Sheet Panel Title')).toBeInTheDocument();
  });
});
