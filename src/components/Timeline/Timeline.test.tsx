import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Timeline,
  TimelineItem,
  TimelinePoint,
  TimelineContent,
  TimelineTitle,
} from './index';

describe('Timeline', () => {
  it('renders chronological items using shorthand props', () => {
    render(
      <Timeline>
        <TimelineItem
          title="Release v1.0.0"
          time="2 hours ago"
          description="Published @eta-ui/react to NPM"
          color="success"
        />
        <TimelineItem
          title="Design Review"
          time="Yesterday"
          description="Approved WCAG AA pastel palette"
          color="primary"
          hideConnector
        />
      </Timeline>
    );

    expect(screen.getByText('Release v1.0.0')).toBeInTheDocument();
    expect(screen.getByText('2 hours ago')).toBeInTheDocument();
    expect(screen.getByText('Published @eta-ui/react to NPM')).toBeInTheDocument();
    expect(screen.getByText('Design Review')).toBeInTheDocument();
  });

  it('supports composable subcomponents and alternate layout', () => {
    render(
      <Timeline layout="alternate">
        <TimelineItem>
          <TimelinePoint color="info" variant="solid" />
          <TimelineContent>
            <TimelineTitle>Custom Event</TimelineTitle>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    );

    const list = screen.getByRole('list', { name: 'Timeline' });
    expect(list).toHaveAttribute('data-layout', 'alternate');
    expect(screen.getByText('Custom Event')).toBeInTheDocument();
  });
});
