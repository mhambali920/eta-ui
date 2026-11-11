import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timeline, TimelineItem } from './Timeline';

const meta: Meta<typeof Timeline> = {
  title: 'Data Display/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  argTypes: {
    layout: { control: 'select', options: ['left', 'alternate'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
  args: {
    layout: 'left',
    size: 'md',
  },
  render: (args) => (
    <div style={{ maxWidth: '480px' }}>
      <Timeline {...args}>
        <TimelineItem
          title="Deployment Succeeded"
          time="Just now"
          description="Production bundle v1.2.0 is live on edge nodes."
          color="success"
          pointVariant="solid"
        />
        <TimelineItem
          title="Automated Verification Passed"
          time="12 mins ago"
          description="All 47 component suites passed with 0 accessibility violations."
          color="primary"
        />
        <TimelineItem
          title="Pull Request Opened"
          time="1 hour ago"
          description="Added Phase 5 disclosure and data display components."
          color="info"
          hideConnector
        />
      </Timeline>
    </div>
  ),
};
