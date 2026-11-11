import type { Meta, StoryObj } from '@storybook/react';
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
} from './Dialog';
import { Button } from '../Button';
import { Input } from '../Input';

const meta: Meta<typeof DialogContent> = {
  title: 'Overlay/Dialog',
  component: DialogContent,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    showCloseButton: {
      control: 'boolean',
    },
    closeLabel: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof DialogContent>;

export const Default: Story = {
  args: {
    size: 'md',
    showCloseButton: true,
    closeLabel: 'Close dialog',
  },
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="solid">Open Confirmation Dialog</Button>
      </DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>Confirm Project Deletion</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this project? This action cannot be reversed.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <p style={{ margin: 0 }}>
            All connected resources, deployed endpoints, and associated metrics will be permanently archived.
          </p>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button variant="solid" color="danger">
            Delete Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const FormDialog: StoryObj = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="soft">Edit User Profile</Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your personal information below.</DialogDescription>
        </DialogHeader>
        <DialogBody style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.875rem', fontWeight: 500 }}>
              Full Name
            </label>
            <Input defaultValue="Jane Doe" />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.875rem', fontWeight: 500 }}>
              Email Address
            </label>
            <Input defaultValue="jane.doe@example.com" type="email" />
          </div>
        </DialogBody>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button variant="solid" color="primary">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
