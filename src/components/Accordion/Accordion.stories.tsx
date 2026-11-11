import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'Navigation/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Allow one or multiple items open at once',
    },
    variant: {
      control: 'select',
      options: ['bordered', 'flush', 'soft'],
      description: 'Visual container styling',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Trigger padding and text sizing',
    },
    collapsible: {
      control: 'boolean',
      description: 'When type is single, allow closing the active item',
    },
  },
  args: {
    variant: 'bordered',
    size: 'md',
    type: 'single',
    collapsible: true,
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    defaultValue: 'item-1',
  },
  render: (args) => (
    <Accordion {...args} style={{ maxWidth: 500 }}>
      <AccordionItem value="item-1">
        <AccordionTrigger>What makes eta-ui unique?</AccordionTrigger>
        <AccordionContent>
          eta-ui features a soft pastel aesthetic designed to minimize visual eye strain, avoiding pure whites (#fff) and blacks (#000), while guaranteeing full WCAG AA contrast compliance.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is Dark Mode supported out of the box?</AccordionTrigger>
        <AccordionContent>
          Yes! All tokens seamlessly adapt between light and dark palettes via CSS variables without runtime JavaScript bundle overhead.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Which headless library does eta-ui use?</AccordionTrigger>
        <AccordionContent>
          eta-ui relies on accessible Radix UI primitives for keyboard navigation, focus management, and screen-reader accessibility.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Flush: Story = {
  args: {
    variant: 'flush',
    type: 'multiple',
    defaultValue: ['q1'],
  },
  render: (args) => (
    <Accordion {...args} style={{ maxWidth: 500 }}>
      <AccordionItem value="q1">
        <AccordionTrigger>Account Billing Questions</AccordionTrigger>
        <AccordionContent>
          Invoices are automatically sent to your registered billing email at the end of each billing cycle.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="q2">
        <AccordionTrigger>Cancellation Policy</AccordionTrigger>
        <AccordionContent>
          You can cancel your subscription at any time directly through your dashboard settings.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Soft: Story = {
  args: {
    variant: 'soft',
    type: 'single',
    collapsible: true,
    defaultValue: 's1',
  },
  render: (args) => (
    <Accordion {...args} style={{ maxWidth: 500 }}>
      <AccordionItem value="s1">
        <AccordionTrigger>Soft Variant Styling</AccordionTrigger>
        <AccordionContent>
          The soft variant uses subtle tinted container backgrounds for an elevated, harmonious layout.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="s2">
        <AccordionTrigger>Additional Details</AccordionTrigger>
        <AccordionContent>
          Content is gently padded and animates with smooth height expansion.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
