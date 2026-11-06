import type { Meta, StoryObj } from '@storybook/react-vite';
import { Container } from './Container';
import { Divider } from './Divider';

const meta: Meta<typeof Container> = {
  title: 'Components/Layout',
  component: Container,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Container>;

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
