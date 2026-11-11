import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from './Container';
import { Divider } from './Divider';

const meta: Meta<typeof Container> = {
  title: 'Layout/Layout',
  component: Container,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl', 'fluid'],
      description: 'Maximum width preset of the container',
    },
    isPadded: {
      control: 'boolean',
      description: 'Add responsive horizontal padding',
    },
    centerContent: {
      control: 'boolean',
      description: 'Center child elements horizontally via flex column',
    },
  },
  args: {
    size: 'md',
    isPadded: true,
    centerContent: false,
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  render: (args) => (
    <Container
      {...args}
      style={{
        backgroundColor: 'var(--eta-bg-surface)',
        paddingTop: '1rem',
        paddingBottom: '1rem',
        borderRadius: '8px',
        border: '1px solid var(--eta-border-subtle)',
      }}
    >
      Interactive Container ({args.size})
    </Container>
  ),
};

export const Containers: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      <Container size="sm" style={{ backgroundColor: 'var(--eta-bg-surface)', padding: '1rem', borderRadius: '8px' }}>
        Container Small (max-width 640px)
      </Container>
      <Container size="md" style={{ backgroundColor: 'var(--eta-bg-surface)', padding: '1rem', borderRadius: '8px' }}>
        Container Medium (max-width 768px)
      </Container>
      <Container size="lg" style={{ backgroundColor: 'var(--eta-bg-surface)', padding: '1rem', borderRadius: '8px' }}>
        Container Large (max-width 1024px)
      </Container>
    </div>
  ),
};

export const InteractiveDivider: StoryObj<typeof Divider> = {
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted'],
    },
    spacing: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    label: {
      control: 'text',
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
  },
  args: {
    orientation: 'horizontal',
    variant: 'solid',
    spacing: 'md',
    size: 'md',
    label: 'OR CONTINUE WITH',
    labelPosition: 'center',
  },
  render: (args) => (
    <div style={{ width: '100%', maxWidth: '500px', minHeight: args.orientation === 'vertical' ? '80px' : undefined, display: args.orientation === 'vertical' ? 'flex' : 'block', alignItems: 'center' }}>
      <span>Section Above / Left</span>
      <Divider {...args} />
      <span>Section Below / Right</span>
    </div>
  ),
};

export const Dividers: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '500px' }}>
      <div>
        <span style={{ fontSize: '0.85rem' }}>Solid Divider:</span>
        <Divider variant="solid" />
      </div>

      <div>
        <span style={{ fontSize: '0.85rem' }}>Dashed Divider:</span>
        <Divider variant="dashed" />
      </div>

      <div>
        <span style={{ fontSize: '0.85rem' }}>Divider with Center Label:</span>
        <Divider label="OR CONTINUE WITH" labelPosition="center" />
      </div>

      <div>
        <span style={{ fontSize: '0.85rem' }}>Divider with Left Label:</span>
        <Divider label="SECTION START" labelPosition="left" />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', height: '24px' }}>
        <span>Option A</span>
        <Divider orientation="vertical" />
        <span>Option B</span>
        <Divider orientation="vertical" />
        <span>Option C</span>
      </div>
    </div>
  ),
};
