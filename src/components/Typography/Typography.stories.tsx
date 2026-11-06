import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading } from './Heading';
import { Text } from './Text';

const meta: Meta<typeof Heading> = {
  title: 'Components/Typography',
  component: Heading,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Headings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Heading as="h1" size="3xl">Heading 1 (3xl)</Heading>
      <Heading as="h2" size="2xl">Heading 2 (2xl)</Heading>
      <Heading as="h3" size="xl">Heading 3 (xl)</Heading>
      <Heading as="h4" size="lg">Heading 4 (lg)</Heading>
      <Heading as="h5" size="md">Heading 5 (md)</Heading>
      <Heading as="h6" size="sm">Heading 6 (sm)</Heading>
    </div>
  ),
};

export const HeadingColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Heading as="h3" color="default">Default Charcoal Ink</Heading>
      <Heading as="h3" color="primary">Sage Green Accent</Heading>
      <Heading as="h3" color="secondary">Dusty Blue Secondary</Heading>
      <Heading as="h3" color="muted">Muted Slate Gray</Heading>
    </div>
  ),
};

export const TextVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '600px' }}>
      <Text variant="lead">
        Lead text: eta-ui is a tranquil, pastel design system crafted for eye comfort and accessibility.
      </Text>
      <Text variant="body">
        Body text: Standard typography designed with soft contrast to prevent visual fatigue during long sessions.
      </Text>
      <Text variant="muted">
        Muted text: Secondary information, timestamps, and subtle hints.
      </Text>
      <Text variant="caption">
        Caption text: Small annotations, footnote references, and legal disclaimers.
      </Text>
    </div>
  ),
};

export const TextColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Text color="default">Default Body Text</Text>
      <Text color="primary">Primary Sage Accent</Text>
      <Text color="secondary">Secondary Dusty Blue</Text>
      <Text color="success">Success Status (#2D6A4F)</Text>
      <Text color="warning">Warning Status (#BC6C25)</Text>
      <Text color="danger">Danger Status (#C1121F)</Text>
    </div>
  ),
};
