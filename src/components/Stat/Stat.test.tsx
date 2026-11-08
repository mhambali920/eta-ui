import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Stat, StatGroup, StatLabel, StatValue, StatTrend, StatHelpText } from './index';

describe('Stat', () => {
  it('renders KPI label, value, trend badge, and help text via shorthand props', () => {
    render(
      <Stat
        label="Monthly Revenue"
        value="$48,290"
        trend="up"
        trendValue="+14.2%"
        helpText="vs last month"
      />
    );

    expect(screen.getByText('Monthly Revenue')).toBeInTheDocument();
    expect(screen.getByText('$48,290')).toBeInTheDocument();
    expect(screen.getByText('+14.2%')).toBeInTheDocument();
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('supports composable subcomponents inside StatGroup', () => {
    render(
      <StatGroup>
        <Stat variant="outline">
          <StatLabel>Bounce Rate</StatLabel>
          <StatValue>24.8%</StatValue>
          <StatTrend direction="down">-3.1%</StatTrend>
          <StatHelpText>Improved retention</StatHelpText>
        </Stat>
      </StatGroup>
    );

    expect(screen.getByRole('group')).toBeInTheDocument();
    expect(screen.getByText('Bounce Rate')).toBeInTheDocument();
    expect(screen.getByText('24.8%')).toBeInTheDocument();
    expect(screen.getByText('-3.1%').closest('[data-direction]')).toHaveAttribute(
      'data-direction',
      'down'
    );
  });
});
