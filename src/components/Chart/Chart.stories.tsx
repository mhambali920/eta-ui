import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AreaChart,
  BarChart,
  DonutChart,
  LineChart,
  Sparkline,
} from './Chart';
import { Stat, StatGroup } from '../Stat';

const meta: Meta<typeof AreaChart> = {
  title: 'Data Display/Chart',
  component: AreaChart,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['surface', 'outline', 'ghost'],
      description: 'Container card style',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Header and container padding scale',
    },
    curve: {
      control: 'radio',
      options: ['smooth', 'linear'],
      description: 'Interpolation mode for line and area paths',
    },
    height: {
      control: { type: 'number', min: 160, max: 420, step: 20 },
      description: 'Height of the SVG plot in pixels',
    },
    showGrid: {
      control: 'boolean',
      description: 'Display dashed reference grid lines',
    },
    showDots: {
      control: 'boolean',
      description: 'Render circle markers on each data point',
    },
    showLegend: {
      control: 'boolean',
      description: 'Display interactive series legend',
    },
    showTooltip: {
      control: 'boolean',
      description: 'Display floating tooltip on hover or arrow keys',
    },
    isLoading: {
      control: 'boolean',
      description: 'Show loading skeleton state',
    },
  },
  args: {
    variant: 'surface',
    size: 'md',
    curve: 'smooth',
    height: 260,
    showGrid: true,
    showDots: true,
    showLegend: true,
    showTooltip: true,
    isLoading: false,
  },
};

export default meta;
type Story = StoryObj<typeof AreaChart>;

const weeklyLatencyData = [
  { day: 'Mon', p50: 42, p95: 118 },
  { day: 'Tue', p50: 39, p95: 109 },
  { day: 'Wed', p50: 46, p95: 134 },
  { day: 'Thu', p50: 41, p95: 112 },
  { day: 'Fri', p50: 44, p95: 121 },
  { day: 'Sat', p50: 35, p95: 94 },
  { day: 'Sun', p50: 33, p95: 89 },
];

const deploymentData = [
  { month: 'Jan', succeeded: 38, rolledBack: 3 },
  { month: 'Feb', succeeded: 44, rolledBack: 2 },
  { month: 'Mar', succeeded: 51, rolledBack: 4 },
  { month: 'Apr', succeeded: 49, rolledBack: 1 },
  { month: 'May', succeeded: 58, rolledBack: 2 },
  { month: 'Jun', succeeded: 63, rolledBack: 2 },
];

export const Default: Story = {
  decorators: [
    (StoryFn) => (
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <StoryFn />
      </div>
    ),
  ],
  render: (args) => (
    <AreaChart
      {...args}
      title="API response latency over the last 7 days (ms)"
      description="Click legend items to filter series or use Left/Right arrow keys to inspect points."
      data={weeklyLatencyData}
      indexKey="day"
      series={[
        { key: 'p95', label: 'p95 Latency', color: 'chart-2' },
        { key: 'p50', label: 'Median (p50)', color: 'chart-1' },
      ]}
      valueFormatter={(v) => `${v} ms`}
    />
  ),
};

export const GroupedAndStackedBarChart: Story = {
  render: () => (
    <div style={{ maxWidth: 680, margin: '0 auto', display: 'grid', gap: 20 }}>
      <BarChart
        title="Monthly production deployments vs rollbacks"
        description="Grouped vertical comparison across the first half of the year"
        data={deploymentData}
        indexKey="month"
        series={[
          { key: 'succeeded', label: 'Succeeded', color: 'chart-1' },
          { key: 'rolledBack', label: 'Rolled Back', color: 'chart-3' },
        ]}
      />

      <BarChart
        title="Build duration by pipeline stage (seconds)"
        orientation="horizontal"
        height={220}
        data={[
          { stage: 'Install', seconds: 19 },
          { stage: 'Typecheck', seconds: 14 },
          { stage: 'Unit Tests', seconds: 27 },
          { stage: 'Bundle ESM/CJS', seconds: 11 },
        ]}
        indexKey="stage"
        series={[{ key: 'seconds', label: 'Duration', color: 'chart-4' }]}
        valueFormatter={(v) => `${v}s`}
      />
    </div>
  ),
};

export const MultiSeriesLineChart: Story = {
  render: () => (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>
      <LineChart
        title="Cache hit vs miss requests per hour"
        description="Smooth monotone interpolation without curve overshoot"
        data={[
          { hour: '08:00', hits: 420, misses: 65 },
          { hour: '10:00', hits: 610, misses: 82 },
          { hour: '12:00', hits: 740, misses: 94 },
          { hour: '14:00', hits: 690, misses: 71 },
          { hour: '16:00', hits: 780, misses: 68 },
          { hour: '18:00', hits: 530, misses: 49 },
        ]}
        indexKey="hour"
        series={[
          { key: 'hits', label: 'Cache Hits', color: 'chart-1' },
          { key: 'misses', label: 'Origin Fetches', color: 'chart-5' },
        ]}
      />
    </div>
  ),
};

export const DonutAllocation: Story = {
  render: () => (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      <DonutChart
        title="Bucket storage allocation by artifact category"
        description="Toggle legend labels to recalculate relative share"
        centerValue="128 GB"
        centerLabel="Total Used"
        data={[
          { label: 'Container Images', value: 54, color: 'chart-1' },
          { label: 'Build Caches', value: 36, color: 'chart-2' },
          { label: 'Test Snapshots', value: 22, color: 'chart-4' },
          { label: 'Audit Logs', value: 16, color: 'chart-3' },
        ]}
        valueFormatter={(v) => `${v} GB`}
      />
    </div>
  ),
};

export const StatCardsWithSparklines: Story = {
  render: () => (
    <div style={{ maxWidth: 780, margin: '0 auto' }}>
      <StatGroup>
        <Stat
          label="Successful Builds (7d)"
          value="184"
          trend="up"
          trendValue="+12%"
          helpText="vs prior 7 days"
        >
          <div style={{ marginTop: 10 }}>
            <Sparkline
              data={[21, 24, 22, 27, 26, 31, 33]}
              color="chart-1"
              showEndDot
              label="7-day successful builds trend"
            />
          </div>
        </Stat>

        <Stat
          label="Median Bundle Time"
          value="1.89s"
          trend="down"
          trendValue="-0.24s"
          helpText="after tree-shaking"
        >
          <div style={{ marginTop: 10 }}>
            <Sparkline
              data={[2.3, 2.2, 2.15, 2.05, 1.98, 1.92, 1.89]}
              variant="line"
              color="chart-2"
              showEndDot
              label="7-day bundle duration trend"
            />
          </div>
        </Stat>

        <Stat
          label="Queued Jobs"
          value="9"
          trend="neutral"
          trendValue="0%"
          helpText="sampled hourly"
        >
          <div style={{ marginTop: 10 }}>
            <Sparkline
              data={[6, 11, 8, 14, 7, 10, 9]}
              variant="bars"
              color="chart-4"
              label="Hourly queued jobs"
            />
          </div>
        </Stat>
      </StatGroup>
    </div>
  ),
};

export const UIStates: Story = {
  render: () => (
    <div style={{ maxWidth: 640, margin: '0 auto', display: 'grid', gap: 20 }}>
      <BarChart
        title="Webhook deliveries (Empty)"
        data={[]}
        indexKey="day"
        series={[{ key: 'count', label: 'Deliveries' }]}
        emptyState="No webhook deliveries recorded in this date range. Configure an endpoint to start collecting events."
      />

      <LineChart
        title="Worker memory usage (Loading)"
        data={[]}
        indexKey="day"
        series={[{ key: 'mb', label: 'Memory' }]}
        isLoading
        loadingLabel="Loading worker telemetry..."
        height={160}
      />

      <DonutChart
        title="Region distribution (Error)"
        data={[]}
        error="Metrics query failed (HTTP 503). Retry once the metrics collector is reachable."
      />
    </div>
  ),
};
