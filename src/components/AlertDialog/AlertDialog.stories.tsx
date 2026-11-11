import type { Meta, StoryObj } from '@storybook/react-vite';
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
} from './AlertDialog';
import { Button } from '../Button';

const meta: Meta<typeof AlertDialogContent> = {
  title: 'Overlay/AlertDialog',
  component: AlertDialogContent,
  tags: ['autodocs'],
  argTypes: {
    intent: {
      control: 'select',
      options: ['danger', 'warning', 'info', 'primary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    closeOnOverlayClick: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AlertDialogContent>;

export const DestructiveConfirmation: Story = {
  args: {
    intent: 'danger',
    size: 'md',
    closeOnOverlayClick: false,
  },
  render: (args) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button color="danger" variant="soft">
          Delete Workspace
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent {...args}>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Workspace Permanently?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. All projects, members, and tokens associated with this
            workspace will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete Workspace</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const WarningIntent: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button color="warning" variant="outline">
          Revoke API Key
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent intent="warning">
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke Production API Key?</AlertDialogTitle>
          <AlertDialogDescription>
            Any active services using this key will immediately lose access until updated with a
            new key.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Revoke Key</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
