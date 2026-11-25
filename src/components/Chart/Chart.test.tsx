import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  BarChart,
  LineChart,
  AreaChart,
  DonutChart,
  Sparkline,
  computeNiceScale,
  resolveChartColor,
} from './index';

const trafficData = [
  { day: 'Mon', requests: 120, errors: 4 },
  { day: 'Tue', requests: 180, errors: 6 },
  { day: 'Wed', requests: 150, errors: 3 },
  { day: 'Thu', requests: 210, errors: 5 },
];

const trafficSeries = [
  { key: 'requests', label: 'Total Requests', color: 'chart-1' as const },
  { key: 'errors', label: 'Failed Retries', color: 'chart-3' as const },
];

describe('Chart scale and color utilities', () => {
  it('computes rounded human-readable axis ticks via computeNiceScale', () => {
    const scale = computeNiceScale(0, 210, 5);
    expect(scale.min).toBe(0);
    expect(scale.max).toBeGreaterThanOrEqual(210);
    expect(scale.ticks[0]).toBe(0);
    expect(scale.ticks[scale.ticks.length - 1]).toBe(scale.max);
  });

  it('resolves semantic chart tokens to CSS variables', () => {
    expect(resolveChartColor('chart-2')).toContain('--eta-chart-2');
    expect(resolveChartColor('primary')).toBe('var(--eta-color-primary)');
    expect(resolveChartColor('#4A7C9B')).toBe('#4A7C9B');
  });
});

describe('BarChart', () => {
  it('renders bars, title, legend, and accessible screen-reader data table', () => {
    const { container } = render(
      <BarChart
        title="Daily request volume"
        description="Comparison of total requests and retries"
        data={trafficData}
        indexKey="day"
        series={trafficSeries}
      />
    );

    expect(screen.getByRole('heading', { name: 'Daily request volume' })).toBeInTheDocument();
    expect(container.querySelectorAll('[data-chart-bar="requests"]')).toHaveLength(4);
    expect(container.querySelectorAll('[data-chart-bar="errors"]')).toHaveLength(4);
    expect(screen.getByRole('table', { name: 'Daily request volume' })).toBeInTheDocument();
  });

  it('toggles series visibility via interactive legend buttons and prevents hiding the last series', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <BarChart
        title="Traffic breakdown"
        data={trafficData}
        indexKey="day"
        series={trafficSeries}
      />
    );

    const reqBtn = screen.getByRole('button', { name: 'Total Requests' });
    const errBtn = screen.getByRole('button', { name: 'Failed Retries' });

    await user.click(errBtn);
    expect(errBtn).toHaveAttribute('aria-pressed', 'false');
    expect(container.querySelectorAll('[data-chart-bar="errors"]')).toHaveLength(0);
    expect(container.querySelectorAll('[data-chart-bar="requests"]')).toHaveLength(4);

    // Clicking the last remaining visible series keeps it active
    await user.click(reqBtn);
    expect(reqBtn).toHaveAttribute('aria-pressed', 'true');
    expect(container.querySelectorAll('[data-chart-bar="requests"]')).toHaveLength(4);
  });

  it('displays tooltip on keyboard arrow navigation and dismisses on Escape', () => {
    render(
      <BarChart
        title="Keyboard inspectable bar chart"
        data={trafficData}
        indexKey="day"
        series={trafficSeries}
        valueFormatter={(v) => `${v} req`}
      />
    );

    const plot = screen.getByRole('group', { name: /Keyboard inspectable bar chart/i });
    fireEvent.keyDown(plot, { key: 'ArrowRight' });

    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Mon');
    expect(tooltip).toHaveTextContent('120 req');

    fireEvent.keyDown(plot, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('renders empty, loading, and error states cleanly', () => {
    const { rerender } = render(
      <BarChart
        title="Empty chart"
        data={[]}
        indexKey="day"
        series={trafficSeries}
        emptyState="No metrics recorded yet."
      />
    );
    expect(screen.getByText('No metrics recorded yet.')).toBeInTheDocument();

    rerender(
      <BarChart
        title="Loading chart"
        data={[]}
        indexKey="day"
        series={trafficSeries}
        isLoading
        loadingLabel="Fetching telemetry..."
      />
    );
    expect(screen.getByRole('status', { name: 'Fetching telemetry...' })).toBeInTheDocument();

    rerender(
      <BarChart
        title="Error chart"
        data={[]}
        indexKey="day"
        series={trafficSeries}
        error="Telemetry endpoint timed out."
      />
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Telemetry endpoint timed out.');
  });
});

describe('LineChart, AreaChart, DonutChart, and Sparkline', () => {
  it('renders AreaChart and LineChart SVG series paths', () => {
    const { container, rerender } = render(
      <AreaChart
        title="Latency trend"
        data={trafficData}
        indexKey="day"
        series={[{ key: 'requests', label: 'Requests' }]}
      />
    );

    expect(container.querySelector('[data-chart-series="requests"] path')).toBeInTheDocument();

    rerender(
      <LineChart
        title="Latency trend"
        curve="linear"
        data={trafficData}
        indexKey="day"
        series={[{ key: 'requests', label: 'Requests' }]}
      />
    );
    expect(container.querySelector('[data-chart-series="requests"] path')).toBeInTheDocument();
  });

  it('renders DonutChart segments, center KPI, and keyboard slice tooltip', () => {
    const slices = [
      { label: 'Database', value: 48 },
      { label: 'Object Storage', value: 32 },
      { label: 'Logs', value: 20 },
    ];

    const { container } = render(
      <DonutChart
        title="Storage share"
        data={slices}
        centerValue="100 GB"
        centerLabel="Allocated"
      />
    );

    expect(container.querySelectorAll('[data-chart-slice]')).toHaveLength(3);
    expect(screen.getByText('100 GB')).toBeInTheDocument();
    expect(screen.getByText('Allocated')).toBeInTheDocument();

    const stage = screen.getByRole('group', { name: /Storage share/i });
    fireEvent.keyDown(stage, { key: 'ArrowRight' });
    expect(screen.getByRole('tooltip')).toHaveTextContent('Database');
    expect(screen.getByRole('tooltip')).toHaveTextContent('48.0%');
  });

  it('renders Sparkline in area and bars variants', () => {
    const { rerender } = render(
      <Sparkline data={[12, 18, 15, 24, 22, 30]} label="7-day throughput" showEndDot />
    );
    expect(screen.getByRole('img', { name: '7-day throughput' })).toBeInTheDocument();

    rerender(<Sparkline data={[12, 18, 15, 24]} variant="bars" label="Bar sparkline" />);
    expect(screen.getByRole('img', { name: 'Bar sparkline' }).querySelectorAll('rect')).toHaveLength(
      4
    );
  });
});
