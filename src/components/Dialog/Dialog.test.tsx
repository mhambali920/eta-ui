import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
  Modal,
  ModalTrigger,
  ModalContent,
  ModalTitle,
} from './Dialog';

describe('Dialog / Modal component', () => {
  it('opens and closes dialog when trigger and close button are clicked', async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger asChild>
          <button>Open Dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Heading</DialogTitle>
            <DialogDescription>Dialog details and instructions</DialogDescription>
          </DialogHeader>
          <DialogBody>Main dialog body content</DialogBody>
          <DialogFooter>
            <DialogClose asChild>
              <button>Cancel</button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    expect(screen.queryByText('Dialog Heading')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Dialog Heading')).toBeInTheDocument();
    expect(screen.getByText('Dialog details and instructions')).toBeInTheDocument();
    expect(screen.getByText('Main dialog body content')).toBeInTheDocument();

    // Click close button
    const closeBtn = screen.getByRole('button', { name: 'Close dialog' });
    await user.click(closeBtn);

    expect(screen.queryByText('Dialog Heading')).not.toBeInTheDocument();
  });

  it('renders different size classes', () => {
    render(
      <Dialog open>
        <DialogContent size="lg" data-testid="dialog-content">
          <DialogTitle>Large Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    const content = screen.getByTestId('dialog-content');
    expect(content.className).toContain('size-lg');
  });

  it('hides close button when showCloseButton={false}', () => {
    render(
      <Dialog open>
        <DialogContent showCloseButton={false}>
          <DialogTitle>No Close Button</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    expect(screen.queryByRole('button', { name: 'Close dialog' })).not.toBeInTheDocument();
  });

  it('works seamlessly with Modal semantic aliases', async () => {
    const user = userEvent.setup();

    render(
      <Modal>
        <ModalTrigger asChild>
          <button>Open Modal</button>
        </ModalTrigger>
        <ModalContent>
          <ModalTitle>Modal Title Content</ModalTitle>
        </ModalContent>
      </Modal>
    );

    await user.click(screen.getByRole('button', { name: 'Open Modal' }));
    expect(screen.getByText('Modal Title Content')).toBeInTheDocument();
  });
});
