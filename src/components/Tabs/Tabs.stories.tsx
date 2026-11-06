import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
import { Card, CardBody } from '../Card';

const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['soft', 'underline', 'outline'],
      description: 'Visual style of the tabs',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the tab triggers and content',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Layout orientation of the tabs',
    },
  },
  args: {
    variant: 'soft',
    size: 'md',
    orientation: 'horizontal',
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: {
    defaultValue: 'account',
  },
  render: (args) => (
    <Tabs {...args} style={{ maxWidth: args.orientation === 'vertical' ? 600 : 440 }}>
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardBody>
            <h4 style={{ margin: '0 0 8px 0' }}>Account Settings</h4>
            <p style={{ margin: 0 }}>
              Update your public profile, email preferences, and personal details.
            </p>
          </CardBody>
        </Card>
      </TabsContent>
      <TabsContent value="security">
        <Card>
          <CardBody>
            <h4 style={{ margin: '0 0 8px 0' }}>Security</h4>
            <p style={{ margin: 0 }}>
              Manage multi-factor authentication, active sessions, and API tokens.
            </p>
          </CardBody>
        </Card>
      </TabsContent>
      <TabsContent value="billing">
        <Card>
          <CardBody>
            <h4 style={{ margin: '0 0 8px 0' }}>Billing</h4>
            <p style={{ margin: 0 }}>
              Review your monthly invoices, payment methods, and current plan tier.
            </p>
          </CardBody>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};

export const Underline: Story = {
  args: {
    variant: 'underline',
    defaultValue: 'overview',
  },
  render: (args) => (
    <Tabs {...args} style={{ maxWidth: 440 }}>
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <p>Overview dashboard metrics and recent team activity feed.</p>
      </TabsContent>
      <TabsContent value="analytics">
        <p>Real-time analytics graphs, conversion funnel, and performance metrics.</p>
      </TabsContent>
      <TabsContent value="reports">
        <p>Exportable monthly audit, usage breakdown, and compliance reports.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    defaultValue: 'first',
  },
  render: (args) => (
    <Tabs {...args} style={{ maxWidth: 440 }}>
      <TabsList>
        <TabsTrigger value="first">First</TabsTrigger>
        <TabsTrigger value="second">Second</TabsTrigger>
        <TabsTrigger value="third">Third</TabsTrigger>
      </TabsList>
      <TabsContent value="first">
        <p>Outline tabs provide explicit rounded borders and crisp separation.</p>
      </TabsContent>
      <TabsContent value="second">
        <p>Second panel content with soft typography and neutral tones.</p>
      </TabsContent>
      <TabsContent value="third">
        <p>Third panel content ready for complex interactive widgets.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const Vertical: Story = {
  args: {
    variant: 'soft',
    orientation: 'vertical',
    defaultValue: 'general',
  },
  render: (args) => (
    <Tabs {...args} style={{ maxWidth: 560 }}>
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <Card>
          <CardBody>
            <h4 style={{ margin: '0 0 8px 0' }}>General Configuration</h4>
            <p style={{ margin: 0 }}>Configure workspace name, timezone, and language.</p>
          </CardBody>
        </Card>
      </TabsContent>
      <TabsContent value="appearance">
        <Card>
          <CardBody>
            <h4 style={{ margin: '0 0 8px 0' }}>Appearance</h4>
            <p style={{ margin: 0 }}>Customize theme, accent color, and interface density.</p>
          </CardBody>
        </Card>
      </TabsContent>
      <TabsContent value="notifications">
        <Card>
          <CardBody>
            <h4 style={{ margin: '0 0 8px 0' }}>Notifications</h4>
            <p style={{ margin: 0 }}>Control email digests and in-app alerts.</p>
          </CardBody>
        </Card>
      </TabsContent>
    </Tabs>
  ),
};
