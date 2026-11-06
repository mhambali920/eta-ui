import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, useToast } from './Toast';
import { Button } from '../Button';

const meta: Meta = {
  title: 'Feedback/Toast',
  tags: ['autodocs'],
};

export default meta;

const ToastDemo = () => {
  const { toast } = useToast();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Button
        variant="solid"
        onClick={() =>
          toast.success('Successfully Saved', {
            description: 'Your project settings have been synchronized.',
          })
        }
      >
        Success Toast
      </Button>

      <Button
        variant="outline"
        color="danger"
        onClick={() =>
          toast.error('Network Error', {
            description: 'Could not reach the server. Please verify your connection.',
          })
        }
      >
        Error Toast
      </Button>

      <Button
        variant="outline"
        color="warning"
        onClick={() =>
          toast.warning('Storage Warning', {
            description: 'You are using 90% of your account quota.',
          })
        }
      >
        Warning Toast
      </Button>

      <Button
        variant="soft"
        color="info"
        onClick={() =>
          toast.info('New Version Available', {
            description: 'Version 0.2.0 is ready for deployment.',
          })
        }
      >
        Info Toast
      </Button>
    </div>
  );
};

export const Default: StoryObj = {
  render: () => (
    <ToastProvider position="bottom-right">
      <ToastDemo />
    </ToastProvider>
  ),
};

export const TopCenter: StoryObj = {
  render: () => (
    <ToastProvider position="top-center">
      <ToastDemo />
    </ToastProvider>
  ),
};
