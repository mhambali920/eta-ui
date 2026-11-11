import type { Meta, StoryObj } from '@storybook/react';
import { Alert, Callout, AlertTitle, AlertDescription } from './Alert';
import { Button } from '../Button';

const meta: Meta<typeof Alert> = {
  title: 'Feedback/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['info', 'success', 'warning', 'error', 'danger'],
    },
    variant: {
      control: 'select',
      options: ['soft', 'outline', 'solid'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    title: {
      control: 'text',
    },
    description: {
      control: 'text',
    },
    icon: {
      control: 'boolean',
    },
    isClosable: {
      control: 'boolean',
    },
    closeLabel: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  args: {
    status: 'info',
    variant: 'soft',
    size: 'md',
    title: 'Informational Notice',
    description: 'We have updated our terms of service to better protect your privacy.',
    isClosable: false,
  },
};

export const Statuses: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Alert
        status="info"
        title="Note"
        description="A new software update is available for your device."
      />
      <Alert
        status="success"
        title="Completed Successfully"
        description="Your profile changes have been saved."
      />
      <Alert
        status="warning"
        title="Warning"
        description="Your subscription is expiring in 3 days. Please renew."
      />
      <Alert
        status="error"
        title="Operation Failed"
        description="Could not connect to the remote server. Please retry."
      />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Alert
        variant="soft"
        status="success"
        title="Soft Variant (Default)"
        description="Gentle pastel background with high contrast WCAG AA text."
      />
      <Alert
        variant="outline"
        status="success"
        title="Outline Variant"
        description="Minimalist bordered alert on clean canvas."
      />
      <Alert
        variant="solid"
        status="success"
        title="Solid Variant"
        description="Vibrant background suitable for critical highlights."
      />
    </div>
  ),
};

export const Dismissible: Story = {
  render: () => {
    return (
      <Alert
        status="warning"
        title="Unsaved Changes"
        description="You have unsaved changes that will be lost upon navigating away."
        onClose={() => alert('Closed alert!')}
      />
    );
  },
};

export const WithAction: Story = {
  render: () => (
    <Alert
      status="info"
      title="Storage Almost Full"
      description="You have reached 85% of your total storage capacity."
      action={
        <Button variant="solid" size="sm">
          Upgrade
        </Button>
      }
      onClose={() => console.log('closed')}
    />
  ),
};

export const CalloutAlias: Story = {
  render: () => (
    <Callout status="info">
      <AlertTitle>Callout Component</AlertTitle>
      <AlertDescription>
        `Callout` is an identical semantic alias for `Alert`, providing familiar DX for documentation and inline notes.
      </AlertDescription>
    </Callout>
  ),
};
