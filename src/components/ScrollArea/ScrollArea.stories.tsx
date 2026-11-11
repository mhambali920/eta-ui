import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea } from './ScrollArea';

const meta: Meta<typeof ScrollArea> = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal', 'both'],
      description: 'Scrollbar orientation',
    },
    scrollHideDelay: {
      control: 'number',
      description: 'Delay in milliseconds before scrollbars hide',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

const tags = Array.from({ length: 40 }).map((_, i) => `v1.2.0-beta.${40 - i}`);

export const Default: Story = {
  args: {
    orientation: 'vertical',
    scrollHideDelay: 600,
  },
  render: (args) => (
    <ScrollArea
      {...args}
      style={{
        height: 240,
        width: 260,
        borderRadius: 'var(--eta-radius-md)',
        border: '1px solid var(--eta-border-default)',
        padding: '12px',
      }}
    >
      <div style={{ paddingRight: 12 }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '0.875rem', fontWeight: 600 }}>
          Tags / Releases
        </h4>
        {tags.map((tag) => (
          <div
            key={tag}
            style={{
              padding: '6px 0',
              borderBottom: '1px solid var(--eta-border-subtle)',
              fontSize: '0.8125rem',
              color: 'var(--eta-text-body)',
            }}
          >
            {tag}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => (
    <ScrollArea
      {...args}
      style={{
        width: 360,
        whiteSpace: 'nowrap',
        borderRadius: 'var(--eta-radius-md)',
        border: '1px solid var(--eta-border-default)',
        padding: '12px',
      }}
    >
      <div style={{ display: 'flex', gap: 12, paddingBottom: 8 }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: 110,
              height: 75,
              borderRadius: 'var(--eta-radius-sm)',
              backgroundColor: 'var(--eta-bg-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem',
            }}
          >
            Item {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};
