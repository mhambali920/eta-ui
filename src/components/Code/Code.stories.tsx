import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd, Code, CodeBlock } from './Code';

const meta: Meta<typeof Code> = {
  title: 'Data Display/Code',
  component: Code,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['soft', 'outline', 'solid'],
      description: 'Visual style of the inline <Code> badge',
    },
    color: {
      control: 'select',
      options: ['neutral', 'primary', 'secondary', 'success', 'warning', 'danger'],
      description: 'Semantic color palette of the inline <Code> badge',
    },
    children: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Code>;

export const Default: Story = {
  args: {
    children: 'npm install @eta-ui/react',
    variant: 'soft',
    color: 'primary',
  },
};

export const InlineCodeAndKbd: Story = {
  args: {
    variant: 'soft',
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Code variant={args.variant} color="neutral">
          neutral
        </Code>
        <Code variant={args.variant} color="primary">
          primary
        </Code>
        <Code variant={args.variant} color="secondary">
          secondary
        </Code>
        <Code variant={args.variant} color="success">
          success
        </Code>
        <Code variant={args.variant} color="warning">
          warning
        </Code>
        <Code variant={args.variant} color="danger">
          danger
        </Code>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
        <span>Press</span>
        <Kbd>⌘</Kbd>
        <span>+</span>
        <Kbd>K</Kbd>
        <span>to open Command Palette</span>
      </div>
    </div>
  ),
};

export const MultiLineCodeBlock: StoryObj<typeof CodeBlock> = {
  args: {
    filename: 'src/App.tsx',
    language: 'tsx',
    size: 'md',
    showLineNumbers: true,
    copyable: true,
    code: `import { ThemeProvider, Button, Card } from '@eta-ui/react';
import '@eta-ui/react/styles.css';

export function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Card>
        <Button variant="soft">Welcome to eta-ui</Button>
      </Card>
    </ThemeProvider>
  );
}`,
  },
  argTypes: {
    filename: { control: 'text' },
    language: { control: 'text' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    showLineNumbers: { control: 'boolean' },
    copyable: { control: 'boolean' },
  },
  render: (args) => (
    <div style={{ maxWidth: '560px' }}>
      <CodeBlock {...args} />
    </div>
  ),
};
