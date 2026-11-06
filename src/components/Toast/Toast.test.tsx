import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  useToast,
} from './Toast';

const TestApp = () => {
  const { toast, dismiss } = useToast();

  return (
    <div>
      <button onClick={() => toast({ title: 'Default Toast', description: 'This is a description' })}>
        Trigger Toast
      </button>
      <button onClick={() => toast.success('Operation Successful', { description: 'Item has been saved' })}>
        Trigger Success
      </button>
      <button onClick={() => toast.error('Error Occurred')}>
        Trigger Error
      </button>
      <button onClick={() => dismiss()}>Dismiss All</button>
    </div>
  );
};

describe('Toast component & useToast hook', () => {
  it('renders low-level primitive toast', () => {
    render(
      <ToastProvider>
        <Toast open>
          <ToastTitle>Low Level Title</ToastTitle>
          <ToastDescription>Low Level Description</ToastDescription>
        </Toast>
      </ToastProvider>
    );

    expect(screen.getByText('Low Level Title')).toBeInTheDocument();
    expect(screen.getByText('Low Level Description')).toBeInTheDocument();
  });

  it('triggers toast imperatively using useToast hook', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestApp />
      </ToastProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Trigger Toast' }));

    expect(await screen.findByText('Default Toast')).toBeInTheDocument();
    expect(screen.getByText('This is a description')).toBeInTheDocument();
  });

  it('triggers semantic toasts (success, error)', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestApp />
      </ToastProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Trigger Success' }));
    expect(await screen.findByText('Operation Successful')).toBeInTheDocument();
    expect(screen.getByText('Item has been saved')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Trigger Error' }));
    expect(await screen.findByText('Error Occurred')).toBeInTheDocument();
  });

  it('dismisses all toasts when dismiss() is called', async () => {
    const user = userEvent.setup();
    render(
      <ToastProvider>
        <TestApp />
      </ToastProvider>
    );

    await user.click(screen.getByRole('button', { name: 'Trigger Toast' }));
    expect(await screen.findByText('Default Toast')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Dismiss All' }));
    expect(screen.queryByText('Default Toast')).not.toBeInTheDocument();
  });

  it('throws an error if useToast is used outside of ToastProvider', () => {
    const ConsumerOutside = () => {
      useToast();
      return null;
    };

    expect(() => render(<ConsumerOutside />)).toThrow(
      'useToast must be used within a ToastProvider'
    );
  });
});
