import type { Meta, StoryObj } from '@storybook/react';
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
} from './Drawer';
import { Button } from '../Button';

const meta: Meta<typeof DrawerContent> = {
  title: 'Overlay/Drawer',
  component: DrawerContent,
  tags: ['autodocs'],
  argTypes: {
    side: {
      control: 'select',
      options: ['right', 'left', 'top', 'bottom'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'full'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof DrawerContent>;

export const RightSideDefault: Story = {
  args: {
    side: 'right',
    size: 'md',
    showCloseButton: true,
  },
  render: (args) => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="solid">Open Right Drawer</Button>
      </DrawerTrigger>
      <DrawerContent {...args}>
        <DrawerHeader>
          <DrawerTitle>Notification Settings</DrawerTitle>
          <DrawerDescription>Manage your workspace alert preferences.</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p>Configure which alerts you receive via email, push notification, and SMS.</p>
        </DrawerBody>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DrawerClose>
          <Button variant="solid">Save Preferences</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const LeftNavigationDrawer: StoryObj = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="soft">Open Left Navigation</Button>
      </DrawerTrigger>
      <DrawerContent side="left" size="sm">
        <DrawerHeader>
          <DrawerTitle>Workspace Menu</DrawerTitle>
          <DrawerDescription>Quick navigation</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>Dashboard</Button>
            <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>Analytics</Button>
            <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>Settings</Button>
          </nav>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
};

export const BottomSheet: StoryObj = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Bottom Sheet</Button>
      </DrawerTrigger>
      <DrawerContent side="bottom" size="md">
        <DrawerHeader>
          <DrawerTitle>Share Resource</DrawerTitle>
          <DrawerDescription>Share this document with teammates</DrawerDescription>
        </DrawerHeader>
        <DrawerBody>
          <p>Copy the link or invite colleagues directly via email.</p>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  ),
};
