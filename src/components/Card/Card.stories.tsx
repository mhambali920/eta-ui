import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
} from './Card';
import { Button } from '../Button';
import { Badge } from '../Badge';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'outline', 'filled'],
    },
    elevation: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    isInteractive: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    variant: 'elevated',
    elevation: 'sm',
    padding: 'md',
    isInteractive: false,
  },
  render: (args) => (
    <Card style={{ maxWidth: '420px' }} {...args}>
      <CardHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <CardTitle>Soft UI Architecture</CardTitle>
          <Badge color="success" size="sm">Stable</Badge>
        </div>
        <CardDescription>
          A balanced, accessible pastel design system for tranquil developer workflows.
        </CardDescription>
      </CardHeader>
      <CardBody>
        <p style={{ margin: 0, fontSize: '0.875rem', lineHeight: 1.5 }}>
          Built with native CSS variables, headless Radix primitives, and WCAG AA compliant contrast ratios.
        </p>
      </CardBody>
      <CardFooter>
        <Button variant="ghost" size="sm">Dismiss</Button>
        <Button variant="solid" size="sm">Explore Docs</Button>
      </CardFooter>
    </Card>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Card variant="elevated" elevation="md" style={{ width: '280px' }}>
        <CardHeader>
          <CardTitle as="h4">Elevated Card</CardTitle>
          <CardDescription>Soft diffused box-shadow</CardDescription>
        </CardHeader>
      </Card>

      <Card variant="outline" style={{ width: '280px' }}>
        <CardHeader>
          <CardTitle as="h4">Outlined Card</CardTitle>
          <CardDescription>Subtle hairline border</CardDescription>
        </CardHeader>
      </Card>

      <Card variant="filled" style={{ width: '280px' }}>
        <CardHeader>
          <CardTitle as="h4">Filled Card</CardTitle>
          <CardDescription>Muted surface background</CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card
      isInteractive
      style={{ maxWidth: '360px' }}
      onClick={() => alert('Card clicked!')}
    >
      <CardHeader>
        <CardTitle as="h4">Clickable Project Card</CardTitle>
        <CardDescription>Hovers with smooth elevation and accent border.</CardDescription>
      </CardHeader>
      <CardBody>
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          Tap or click anywhere on this card to trigger an action.
        </p>
      </CardBody>
    </Card>
  ),
};
