import type { Meta, StoryObj } from '@storybook/react-vite';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible';

const meta: Meta<typeof Collapsible> = {
  title: 'Components/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
  argTypes: {
    defaultOpen: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  args: {
    defaultOpen: false,
    disabled: false,
  },
  render: (args) => (
    <div style={{ maxWidth: '420px' }}>
      <Collapsible {...args}>
        <CollapsibleTrigger>View 3 starred repositories</CollapsibleTrigger>
        <CollapsibleContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>@eta-ui/react — Soft Pastel UI Kit</div>
            <div>@eta-ui/tokens — CSS Variable Design Tokens</div>
            <div>@eta-ui/icons — Calming Minimal Icons</div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};
