import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stat, StatGroup } from './Stat';

const meta: Meta<typeof Stat> = {
  title: 'Components/Stat',
  component: Stat,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['surface', 'outline', 'subtle', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    value: { control: 'text' },
    trend: { control: 'select', options: ['up', 'down', 'neutral'] },
    trendValue: { control: 'text' },
    helpText: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Stat>;

export const Default: Story = {
  args: {
    variant: 'surface',
    size: 'md',
    label: 'Active Subscribers',
    value: '12,840',
    trend: 'up',
    trendValue: '+18.4%',
    helpText: 'compared to previous 30 days',
  },
  render: (args) => (
    <div style={{ maxWidth: '300px' }}>
      <Stat {...args} />
    </div>
  ),
};

export const DashboardGrid: Story = {
  render: () => (
    <StatGroup>
      <Stat
        label="Total Revenue"
        value="$128,430"
        trend="up"
        trendValue="+12.5%"
        helpText="vs last quarter"
      />
      <Stat
        label="Avg. Response Time"
        value="142ms"
        trend="down"
        trendValue="-24ms"
        helpText="99.98% uptime"
      />
      <Stat
        label="NPM Downloads"
        value="84.2K"
        trend="up"
        trendValue="+31%"
        helpText="@eta-ui/react"
      />
    </StatGroup>
  ),
};
