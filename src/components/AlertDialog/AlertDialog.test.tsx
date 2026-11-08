import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from './index';

describe('AlertDialog', () => {
  it('opens alertdialog on trigger click and displays title and description', () => {
    render(
      <AlertDialog>
        <AlertDialogTrigger>Delete Account</AlertDialogTrigger>
        <AlertDialogContent intent="danger">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone and will permanently delete your data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Yes, delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete Account' }));

    const dialog = screen.getByRole('alertdialog');
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText('Are you absolutely sure?')).toBeInTheDocument();
    expect(
      screen.getByText('This action cannot be undone and will permanently delete your data.')
    ).toBeInTheDocument();
  });

  it('closes when Cancel or Action button is clicked', () => {
    const onConfirm = vi.fn();
    render(
      <AlertDialog defaultOpen>
        <AlertDialogContent intent="warning">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Workspace</AlertDialogTitle>
            <AlertDialogDescription>All unsaved drafts will be discarded.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>Reset now</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Reset now' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });
});
