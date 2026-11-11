import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from './AspectRatio';

const meta: Meta<typeof AspectRatio> = {
  title: 'Layout/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs'],
  argTypes: {
    ratio: {
      control: { type: 'number', min: 0.2, max: 4, step: 0.1 },
      description: 'The desired aspect ratio (e.g. 16/9 = 1.777, 4/3 = 1.333, 1/1 = 1)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AspectRatio>;

export const Default: Story = {
  args: {
    ratio: 16 / 9,
  },
  render: (args) => (
    <div style={{ width: '100%', maxWidth: 500 }}>
      <AspectRatio {...args}>
        <img
          src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&auto=format&fit=crop&q=80"
          alt="Abstract gradient landscape"
        />
      </AspectRatio>
    </div>
  ),
};

export const Square1x1: Story = {
  args: {
    ratio: 1,
  },
  render: (args) => (
    <div style={{ width: 260 }}>
      <AspectRatio {...args}>
        <img
          src="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80"
          alt="Atmospheric aurora"
        />
      </AspectRatio>
    </div>
  ),
};

export const CustomRatioWithContent: Story = {
  args: {
    ratio: 4 / 3,
  },
  render: (args) => (
    <div style={{ width: 360 }}>
      <AspectRatio
        {...args}
        style={{
          backgroundColor: 'var(--eta-bg-subtle)',
          border: '1px solid var(--eta-border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--eta-text-muted)',
          fontSize: '0.875rem',
        }}
      >
        <div style={{ padding: 20, textAlign: 'center' }}>
          <strong>4:3 Container</strong>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.8125rem' }}>
            Perfect for legacy aspect media or slide previews
          </p>
        </div>
      </AspectRatio>
    </div>
  ),
};
