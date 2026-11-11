import type { Meta, StoryObj } from '@storybook/react-vite';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard';
import { Avatar } from '../Avatar';
import { Badge } from '../Badge';

const meta: Meta<typeof HoverCardContent> = {
  title: 'Overlay/HoverCard',
  component: HoverCardContent,
  tags: ['autodocs'],
  argTypes: {
    placement: {
      control: 'select',
      options: ['bottom', 'top', 'right', 'left'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    showArrow: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof HoverCardContent>;

export const Default: Story = {
  args: {
    placement: 'bottom',
    size: 'md',
    showArrow: true,
  },
  render: (args) => (
    <div style={{ padding: '3rem', minHeight: '220px' }}>
      <HoverCard openDelay={100}>
        <HoverCardTrigger>
          <span
            style={{
              color: 'var(--eta-color-primary)',
              fontWeight: 600,
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
            }}
          >
            @eta-ui/react
          </span>
        </HoverCardTrigger>
        <HoverCardContent {...args}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <Avatar name="Eta UI" size="md" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <strong style={{ color: 'var(--eta-text-heading)' }}>@eta-ui/react</strong>
                <Badge size="sm" color="success">
                  v1.2.0
                </Badge>
              </div>
              <p style={{ margin: 0, fontSize: '0.8125rem' }}>
                Accessible React UI Kit crafted with a calming pastel color scheme (WCAG AA).
              </p>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};
