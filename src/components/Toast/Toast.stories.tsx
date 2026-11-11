import type { Meta, StoryObj } from '@storybook/react';
import { ToastProvider, useToast, type ToastPosition, type ToastSize, type ToastVariant } from './Toast';
import { Button } from '../Button';

interface ToastStoryArgs {
  position: ToastPosition;
  size: ToastSize;
  variant: ToastVariant;
  duration: number;
}

const meta: Meta<ToastStoryArgs> = {
  title: 'Feedback/Toast',
  tags: ['autodocs'],
  argTypes: {
    position: {
      control: 'select',
      options: ['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center'],
      description: 'Viewport placement of the toast stack',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Toast card padding and typography size',
    },
    variant: {
      control: 'select',
      options: ['surface', 'soft'],
      description: 'Visual style of triggered notifications',
    },
    duration: {
      control: 'number',
      description: 'Auto-dismiss duration in milliseconds',
    },
  },
  args: {
    position: 'bottom-right',
    size: 'md',
    variant: 'surface',
    duration: 4000,
  },
};

export default meta;
type Story = StoryObj<ToastStoryArgs>;

const ToastDemo = ({ variant, duration }: { variant?: ToastVariant; duration?: number }) => {
  const { toast } = useToast();

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <Button
        variant="solid"
        onClick={() =>
          toast.success('Successfully Saved', {
            description: 'Your project settings have been synchronized.',
            variant,
            duration,
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
            variant,
            duration,
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
            variant,
            duration,
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
            variant,
            duration,
          })
        }
      >
        Info Toast
      </Button>
    </div>
  );
};

export const Default: Story = {
  render: (args) => (
    <ToastProvider position={args.position} size={args.size}>
      <ToastDemo variant={args.variant} duration={args.duration} />
    </ToastProvider>
  ),
};

export const TopCenter: Story = {
  args: {
    position: 'top-center',
  },
  render: (args) => (
    <ToastProvider position={args.position} size={args.size}>
      <ToastDemo variant={args.variant} duration={args.duration} />
    </ToastProvider>
  ),
};
