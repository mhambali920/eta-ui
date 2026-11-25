import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cn } from '../../utils/cn';
import styles from './Chart.module.css';

export type ChartVariant = 'surface' | 'outline' | 'ghost';
export type ChartSize = 'sm' | 'md' | 'lg';
export type ChartCurve = 'smooth' | 'linear';
export type ChartColorToken =
  | 'chart-1'
  | 'chart-2'
  | 'chart-3'
  | 'chart-4'
  | 'chart-5'
  | 'chart-6'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | (string & {});

export type ChartDatum = Record<string, string | number>;
export type ChartValueFormatter = (value: number, seriesKey?: string) => string;

export interface ChartSeries {
  key: string;
  label: string;
  color?: ChartColorToken;
}

export interface DonutChartDatum {
  id?: string;
  label: string;
  value: number;
  color?: ChartColorToken;
}

const TOKEN_COLOR_MAP: Record<string, string> = {
  'chart-1': 'var(--eta-chart-1, var(--eta-color-primary))',
  'chart-2': 'var(--eta-chart-2, #4A7C9B)',
  'chart-3': 'var(--eta-chart-3, #B5654D)',
  'chart-4': 'var(--eta-chart-4, #7A639E)',
  'chart-5': 'var(--eta-chart-5, #9E6F21)',
  'chart-6': 'var(--eta-chart-6, #9E4765)',
  primary: 'var(--eta-color-primary)',
  secondary: 'var(--eta-color-secondary)',
  success: 'var(--eta-status-success-solid)',
  warning: 'var(--eta-status-warning-solid)',
  danger: 'var(--eta-status-error-solid)',
  info: 'var(--eta-status-info-solid)',
};

export function resolveChartColor(color: ChartColorToken | undefined, index = 0): string {
  if (!color) {
    const slot = (index % 6) + 1;
    return TOKEN_COLOR_MAP[`chart-${slot}`];
  }
  return TOKEN_COLOR_MAP[color] ?? color;
}

function defaultFormatNumber(value: number): string {
  if (!Number.isFinite(value)) return '0';
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `${+(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 10_000) return `${+(value / 1_000).toFixed(1)}k`;
  return Number.isInteger(value) ? value.toLocaleString('en-US') : +value.toFixed(2) + '';
}

function toNumber(raw: string | number | undefined): number {
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : 0;
  if (typeof raw === 'string') {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as React.MutableRefObject<T>).current = value;
}

interface NiceScale {
  min: number;
  max: number;
  ticks: number[];
}

export function computeNiceScale(minVal: number, maxVal: number, tickCount = 5): NiceScale {
  const safeMin = Math.min(0, Number.isFinite(minVal) ? minVal : 0);
  const safeMax = Math.max(0, Number.isFinite(maxVal) ? maxVal : 0);

  if (safeMax === 0 && safeMin === 0) {
    return { min: 0, max: 100, ticks: [0, 25, 50, 75, 100] };
  }

  const rawRange = safeMax - safeMin || Math.abs(safeMax) || 1;
  const roughStep = rawRange / Math.max(1, tickCount - 1);
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const residual = roughStep / magnitude;

  let niceFraction = 10;
  if (residual <= 1) niceFraction = 1;
  else if (residual <= 2) niceFraction = 2;
  else if (residual <= 2.5) niceFraction = 2.5;
  else if (residual <= 5) niceFraction = 5;

  const step = niceFraction * magnitude;
  const niceMin = Math.floor(safeMin / step) * step;
  const niceMax = Math.ceil(safeMax / step) * step;

  const ticks: number[] = [];
  for (let v = niceMin; v <= niceMax + step * 0.001; v += step) {
    ticks.push(+v.toFixed(8));
  }

  return { min: niceMin, max: niceMax === niceMin ? niceMin + step : niceMax, ticks };
}

interface Point2D {
  x: number;
  y: number;
}

function buildLinearPath(points: Point2D[]): string {
  if (points.length === 0) return '';
  return points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${+p.x.toFixed(2)} ${+p.y.toFixed(2)}`)
    .join(' ');
}

// Fritsch-Carlson monotone cubic spline prevents overshooting past local extrema.
function buildSmoothPath(points: Point2D[]): string {
  if (points.length <= 2) return buildLinearPath(points);

  const n = points.length;
  const dx: number[] = [];
  const dy: number[] = [];
  const slopes: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    const deltaX = points[i + 1].x - points[i].x || 1;
    const deltaY = points[i + 1].y - points[i].y;
    dx.push(deltaX);
    dy.push(deltaY);
    slopes.push(deltaY / deltaX);
  }

  const tangents: number[] = new Array(n).fill(0);
  tangents[0] = slopes[0];
  tangents[n - 1] = slopes[n - 2];

  for (let i = 1; i < n - 1; i++) {
    if (slopes[i - 1] * slopes[i] <= 0) {
      tangents[i] = 0;
    } else {
      tangents[i] = (slopes[i - 1] + slopes[i]) / 2;
    }
  }

  for (let i = 0; i < n - 1; i++) {
    if (slopes[i] === 0) {
      tangents[i] = 0;
      tangents[i + 1] = 0;
    } else {
      const alpha = tangents[i] / slopes[i];
      const beta = tangents[i + 1] / slopes[i];
      const distSq = alpha * alpha + beta * beta;
      if (distSq > 9) {
        const tau = 3 / Math.sqrt(distSq);
        tangents[i] = tau * alpha * slopes[i];
        tangents[i + 1] = tau * beta * slopes[i];
      }
    }
  }

  let path = `M ${+points[0].x.toFixed(2)} ${+points[0].y.toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const seg = dx[i] / 3;
    const cp1x = p0.x + seg;
    const cp1y = p0.y + tangents[i] * seg;
    const cp2x = p1.x - seg;
    const cp2y = p1.y - tangents[i + 1] * seg;
    path += ` C ${+cp1x.toFixed(2)} ${+cp1y.toFixed(2)}, ${+cp2x.toFixed(2)} ${+cp2y.toFixed(2)}, ${+p1.x.toFixed(2)} ${+p1.y.toFixed(2)}`;
  }

  return path;
}

function useMeasuredWidth(defaultWidth = 600) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(defaultWidth);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.clientWidth > 0) {
      setWidth(el.clientWidth);
    }
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const nextWidth = entry.contentRect.width || el.clientWidth;
        if (nextWidth > 0) setWidth(Math.round(nextWidth));
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

export interface ChartLegendItem {
  key: string;
  label: string;
  color: string;
  value?: string;
}

export interface ChartLegendProps extends React.HTMLAttributes<HTMLUListElement> {
  items: readonly ChartLegendItem[];
  hiddenKeys?: ReadonlySet<string>;
  onToggleKey?: (key: string) => void;
  direction?: 'horizontal' | 'vertical';
}

export const ChartLegend = forwardRef<HTMLUListElement, ChartLegendProps>(function ChartLegend(
  { items, hiddenKeys, onToggleKey, direction = 'horizontal', className, ...props },
  ref
) {
  if (items.length === 0) return null;

  return (
    <ul
      ref={ref}
      aria-label="Chart legend"
      className={cn(
        styles.legend,
        direction === 'vertical' && styles.legendVertical,
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const isMuted = Boolean(hiddenKeys?.has(item.key));
        return (
          <li key={item.key} className={styles.legendItem}>
            {onToggleKey ? (
              <button
                type="button"
                aria-pressed={!isMuted}
                className={cn(styles.legendButton, isMuted && styles.legendButtonMuted)}
                onClick={() => onToggleKey(item.key)}
              >
                <span
                  className={styles.legendSwatch}
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
                {item.value !== undefined && (
                  <span className={styles.legendValue}>{item.value}</span>
                )}
              </button>
            ) : (
              <>
                <span
                  className={styles.legendSwatch}
                  style={{ backgroundColor: item.color }}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
                {item.value !== undefined && (
                  <span className={styles.legendValue}>{item.value}</span>
                )}
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
});

ChartLegend.displayName = 'ChartLegend';

export interface ChartContainerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: ChartVariant;
  size?: ChartSize;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  height?: number;
  isLoading?: boolean;
  loadingLabel?: string;
  error?: React.ReactNode;
  isEmpty?: boolean;
  emptyState?: React.ReactNode;
  legend?: React.ReactNode;
}

export const ChartContainer = forwardRef<HTMLDivElement, ChartContainerProps>(
  function ChartContainer(
    {
      variant = 'surface',
      size = 'md',
      title,
      description,
      action,
      height = 240,
      isLoading = false,
      loadingLabel = 'Loading chart data...',
      error,
      isEmpty = false,
      emptyState = 'No chart data recorded for this period.',
      legend,
      className,
      children,
      ...props
    },
    ref
  ) {
    const hasHeader = Boolean(title || description || action);

    return (
      <div
        ref={ref}
        className={cn(
          styles.container,
          styles[`variant-${variant}`],
          styles[`size-${size}`],
          className
        )}
        {...props}
      >
        {hasHeader && (
          <div className={styles.header}>
            <div className={styles.headerText}>
              {title && <h3 className={styles.title}>{title}</h3>}
              {description && <p className={styles.description}>{description}</p>}
            </div>
            {action && <div className={styles.action}>{action}</div>}
          </div>
        )}

        {error ? (
          <div role="alert" className={styles.errorState}>
            {error}
          </div>
        ) : isLoading ? (
          <div
            role="status"
            aria-live="polite"
            aria-label={loadingLabel}
            className={styles.loadingState}
          >
            <p className={styles.loadingLabel}>{loadingLabel}</p>
            <div className={styles.skeletonPlot} style={{ height }} aria-hidden="true">
              {[45, 72, 58, 88, 64, 78].map((pct, i) => (
                <div key={i} className={styles.skeletonBar} style={{ height: `${pct}%` }} />
              ))}
            </div>
          </div>
        ) : isEmpty ? (
          <div className={styles.emptyState} style={{ minHeight: Math.min(height, 160) }}>
            {emptyState}
          </div>
        ) : (
          <>
            {children}
            {legend}
          </>
        )}
      </div>
    );
  }
);

ChartContainer.displayName = 'ChartContainer';

interface TooltipEntry {
  key: string;
  label: string;
  color: string;
  formattedValue: string;
}

function ChartTooltipBox({
  title,
  entries,
  xPct,
  topPx,
}: {
  title: string;
  entries: TooltipEntry[];
  xPct: number;
  topPx: number;
}) {
  const alignRight = xPct > 62;
  return (
    <div
      role="tooltip"
      className={styles.tooltip}
      style={{
        top: Math.max(4, topPx),
        ...(alignRight
          ? { right: `${Math.max(2, 100 - xPct)}%` }
          : { left: `${Math.max(2, xPct)}%` }),
      }}
    >
      <p className={styles.tooltipTitle}>{title}</p>
      <div className={styles.tooltipList}>
        {entries.map((entry) => (
          <div key={entry.key} className={styles.tooltipRow}>
            <span className={styles.tooltipSeries}>
              <span
                className={styles.tooltipSwatch}
                style={{ backgroundColor: entry.color }}
                aria-hidden="true"
              />
              <span>{entry.label}</span>
            </span>
            <span className={styles.tooltipValue}>{entry.formattedValue}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function useInteractiveSeries(series: readonly ChartSeries[], interactive: boolean) {
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(() => new Set());

  const toggleKey = useCallback(
    (key: string) => {
      if (!interactive) return;
      setHiddenKeys((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          const visibleCount = series.filter((s) => !next.has(s.key)).length;
          if (visibleCount <= 1) return prev;
          next.add(key);
        }
        return next;
      });
    },
    [interactive, series]
  );

  const visibleSeries = useMemo(
    () => series.filter((s) => !hiddenKeys.has(s.key)),
    [series, hiddenKeys]
  );

  return { hiddenKeys, toggleKey, visibleSeries };
}

export interface BaseCartesianChartProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  data: readonly ChartDatum[];
  indexKey: string;
  series: readonly ChartSeries[];
  height?: number;
  variant?: ChartVariant;
  size?: ChartSize;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  showGrid?: boolean;
  showLegend?: boolean;
  interactiveLegend?: boolean;
  showTooltip?: boolean;
  valueFormatter?: ChartValueFormatter;
  isLoading?: boolean;
  loadingLabel?: string;
  error?: React.ReactNode;
  emptyState?: React.ReactNode;
  ariaLabel?: string;
}

export interface BarChartProps extends BaseCartesianChartProps {
  orientation?: 'vertical' | 'horizontal';
  stacked?: boolean;
}

export const BarChart = forwardRef<HTMLDivElement, BarChartProps>(function BarChart(
  {
    data,
    indexKey,
    series,
    orientation = 'vertical',
    stacked = false,
    height = 260,
    variant = 'surface',
    size = 'md',
    title,
    description,
    action,
    showGrid = true,
    showLegend,
    interactiveLegend = true,
    showTooltip = true,
    valueFormatter,
    isLoading = false,
    loadingLabel,
    error,
    emptyState,
    ariaLabel,
    ...props
  },
  ref
) {
  const { ref: plotRef, width } = useMeasuredWidth(600);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const canToggleLegend = interactiveLegend && series.length > 1;
  const { hiddenKeys, toggleKey, visibleSeries } = useInteractiveSeries(series, canToggleLegend);

  const formatVal = useCallback(
    (v: number, key?: string) => (valueFormatter ? valueFormatter(v, key) : defaultFormatNumber(v)),
    [valueFormatter]
  );

  const legendItems = useMemo<ChartLegendItem[]>(
    () =>
      series.map((s, idx) => ({
        key: s.key,
        label: s.label,
        color: resolveChartColor(s.color, idx),
      })),
    [series]
  );

  const seriesColorMap = useMemo(() => {
    const map = new Map<string, string>();
    series.forEach((s, idx) => map.set(s.key, resolveChartColor(s.color, idx)));
    return map;
  }, [series]);

  const scale = useMemo(() => {
    let min = 0;
    let max = 0;
    for (const row of data) {
      if (stacked) {
        let posSum = 0;
        let negSum = 0;
        for (const s of visibleSeries) {
          const val = toNumber(row[s.key]);
          if (val >= 0) posSum += val;
          else negSum += val;
        }
        if (posSum > max) max = posSum;
        if (negSum < min) min = negSum;
      } else {
        for (const s of visibleSeries) {
          const val = toNumber(row[s.key]);
          if (val > max) max = val;
          if (val < min) min = val;
        }
      }
    }
    return computeNiceScale(min, max, 5);
  }, [data, stacked, visibleSeries]);

  const isEmpty = data.length === 0 || series.length === 0;
  const shouldShowLegend = showLegend ?? series.length > 1;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (data.length === 0) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((cur) => (cur === null ? 0 : Math.min(data.length - 1, cur + 1)));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((cur) => (cur === null ? data.length - 1 : Math.max(0, cur - 1)));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(data.length - 1);
    } else if (e.key === 'Escape') {
      setActiveIndex(null);
    }
  };

  const margin =
    orientation === 'horizontal'
      ? { top: 10, right: 20, bottom: 28, left: 88 }
      : { top: 12, right: 12, bottom: 30, left: 48 };
  const plotW = Math.max(120, width - margin.left - margin.right);
  const plotH = Math.max(80, height - margin.top - margin.bottom);
  const range = scale.max - scale.min || 1;

  const chartLabel =
    ariaLabel ??
    (typeof title === 'string'
      ? title
      : `Bar chart with ${data.length} categories and ${visibleSeries.length} series`);

  const activeRow = activeIndex !== null ? data[activeIndex] : undefined;
  const tooltipEntries: TooltipEntry[] = activeRow
    ? visibleSeries.map((s) => ({
        key: s.key,
        label: s.label,
        color: seriesColorMap.get(s.key) ?? TOKEN_COLOR_MAP['chart-1'],
        formattedValue: formatVal(toNumber(activeRow[s.key]), s.key),
      }))
    : [];

  const tooltipXPct =
    activeIndex !== null && data.length > 0
      ? orientation === 'horizontal'
        ? 55
        : ((margin.left + ((activeIndex + 0.5) / data.length) * plotW) / width) * 100
      : 50;

  return (
    <ChartContainer
      ref={ref}
      variant={variant}
      size={size}
      title={title}
      description={description}
      action={action}
      height={height}
      isLoading={isLoading}
      loadingLabel={loadingLabel}
      error={error}
      isEmpty={isEmpty}
      emptyState={emptyState}
      legend={
        shouldShowLegend ? (
          <ChartLegend
            items={legendItems}
            hiddenKeys={hiddenKeys}
            onToggleKey={canToggleLegend ? toggleKey : undefined}
          />
        ) : undefined
      }
      {...props}
    >
      <div
        ref={plotRef}
        tabIndex={0}
        role="group"
        aria-label={`${chartLabel}. Use arrow keys to inspect values.`}
        className={styles.plotWrapper}
        style={{ height }}
        onKeyDown={handleKeyDown}
        onMouseLeave={() => setActiveIndex(null)}
        onBlur={() => setActiveIndex(null)}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={chartLabel}
          className={styles.svg}
        >
          {orientation === 'vertical' ? (
            <>
              {scale.ticks.map((tick) => {
                const y = margin.top + plotH - ((tick - scale.min) / range) * plotH;
                return (
                  <g key={tick}>
                    {showGrid && (
                      <line
                        x1={margin.left}
                        x2={width - margin.right}
                        y1={y}
                        y2={y}
                        className={tick === 0 ? styles.axisBaseline : styles.gridLine}
                      />
                    )}
                    <text
                      x={margin.left - 8}
                      y={y + 4}
                      textAnchor="end"
                      className={styles.axisLabel}
                    >
                      {formatVal(tick)}
                    </text>
                  </g>
                );
              })}

              {data.map((row, rowIdx) => {
                const slotW = plotW / data.length;
                const groupX = margin.left + rowIdx * slotW;
                const groupPad = Math.max(4, slotW * 0.18);
                const innerW = Math.max(6, slotW - groupPad * 2);
                const zeroY = margin.top + plotH - ((0 - scale.min) / range) * plotH;
                const isRowActive = activeIndex === rowIdx;
                const anyActive = activeIndex !== null;

                let posStackY = zeroY;
                let negStackY = zeroY;

                return (
                  <g
                    key={`${String(row[indexKey])}-${rowIdx}`}
                    onMouseEnter={() => setActiveIndex(rowIdx)}
                  >
                    {isRowActive && (
                      <rect
                        x={groupX + 2}
                        y={margin.top}
                        width={Math.max(0, slotW - 4)}
                        height={plotH}
                        rx={4}
                        className={styles.hoverBand}
                      />
                    )}

                    {visibleSeries.map((s, sIdx) => {
                      const val = toNumber(row[s.key]);
                      const color = seriesColorMap.get(s.key) ?? TOKEN_COLOR_MAP['chart-1'];
                      const barMag = (Math.abs(val) / range) * plotH;

                      if (stacked) {
                        const y = val >= 0 ? posStackY - barMag : negStackY;
                        if (val >= 0) posStackY -= barMag;
                        else negStackY += barMag;

                        return (
                          <rect
                            key={s.key}
                            x={groupX + groupPad}
                            y={y}
                            width={innerW}
                            height={Math.max(0, barMag)}
                            rx={3}
                            fill={color}
                            data-chart-bar={s.key}
                            className={cn(
                              styles.bar,
                              anyActive && !isRowActive && styles.barDimmed
                            )}
                          />
                        );
                      }

                      const subGap = visibleSeries.length > 1 ? 3 : 0;
                      const barW = Math.max(
                        3,
                        (innerW - subGap * (visibleSeries.length - 1)) / visibleSeries.length
                      );
                      const bx = groupX + groupPad + sIdx * (barW + subGap);
                      const by = val >= 0 ? zeroY - barMag : zeroY;

                      return (
                        <rect
                          key={s.key}
                          x={bx}
                          y={by}
                          width={barW}
                          height={Math.max(0, barMag)}
                          rx={Math.min(4, barW / 2)}
                          fill={color}
                          data-chart-bar={s.key}
                          className={cn(
                            styles.bar,
                            anyActive && !isRowActive && styles.barDimmed
                          )}
                        />
                      );
                    })}

                    <text
                      x={groupX + slotW / 2}
                      y={height - 8}
                      textAnchor="middle"
                      className={styles.axisLabel}
                    >
                      {String(row[indexKey])}
                    </text>

                    <rect
                      x={groupX}
                      y={margin.top}
                      width={slotW}
                      height={plotH}
                      className={styles.hitColumn}
                    />
                  </g>
                );
              })}
            </>
          ) : (
            <>
              {scale.ticks.map((tick) => {
                const x = margin.left + ((tick - scale.min) / range) * plotW;
                return (
                  <g key={tick}>
                    {showGrid && (
                      <line
                        x1={x}
                        x2={x}
                        y1={margin.top}
                        y2={margin.top + plotH}
                        className={tick === 0 ? styles.axisBaseline : styles.gridLine}
                      />
                    )}
                    <text x={x} y={height - 8} textAnchor="middle" className={styles.axisLabel}>
                      {formatVal(tick)}
                    </text>
                  </g>
                );
              })}

              {data.map((row, rowIdx) => {
                const slotH = plotH / data.length;
                const groupY = margin.top + rowIdx * slotH;
                const groupPad = Math.max(3, slotH * 0.18);
                const innerH = Math.max(6, slotH - groupPad * 2);
                const zeroX = margin.left + ((0 - scale.min) / range) * plotW;
                const isRowActive = activeIndex === rowIdx;
                const anyActive = activeIndex !== null;

                let posStackX = zeroX;

                return (
                  <g
                    key={`${String(row[indexKey])}-${rowIdx}`}
                    onMouseEnter={() => setActiveIndex(rowIdx)}
                  >
                    {isRowActive && (
                      <rect
                        x={margin.left}
                        y={groupY + 1}
                        width={plotW}
                        height={Math.max(0, slotH - 2)}
                        rx={4}
                        className={styles.hoverBand}
                      />
                    )}

                    {visibleSeries.map((s, sIdx) => {
                      const val = Math.max(0, toNumber(row[s.key]));
                      const color = seriesColorMap.get(s.key) ?? TOKEN_COLOR_MAP['chart-1'];
                      const barLen = (val / range) * plotW;

                      if (stacked) {
                        const x = posStackX;
                        posStackX += barLen;
                        return (
                          <rect
                            key={s.key}
                            x={x}
                            y={groupY + groupPad}
                            width={Math.max(0, barLen)}
                            height={innerH}
                            rx={3}
                            fill={color}
                            data-chart-bar={s.key}
                            className={cn(
                              styles.bar,
                              anyActive && !isRowActive && styles.barDimmed
                            )}
                          />
                        );
                      }

                      const subGap = visibleSeries.length > 1 ? 2 : 0;
                      const barH = Math.max(
                        3,
                        (innerH - subGap * (visibleSeries.length - 1)) / visibleSeries.length
                      );
                      const by = groupY + groupPad + sIdx * (barH + subGap);

                      return (
                        <rect
                          key={s.key}
                          x={zeroX}
                          y={by}
                          width={Math.max(0, barLen)}
                          height={barH}
                          rx={Math.min(4, barH / 2)}
                          fill={color}
                          data-chart-bar={s.key}
                          className={cn(
                            styles.bar,
                            anyActive && !isRowActive && styles.barDimmed
                          )}
                        />
                      );
                    })}

                    <text
                      x={margin.left - 8}
                      y={groupY + slotH / 2 + 4}
                      textAnchor="end"
                      className={styles.axisLabel}
                    >
                      {String(row[indexKey])}
                    </text>

                    <rect
                      x={margin.left}
                      y={groupY}
                      width={plotW}
                      height={slotH}
                      className={styles.hitColumn}
                    />
                  </g>
                );
              })}
            </>
          )}
        </svg>

        {showTooltip && activeRow && tooltipEntries.length > 0 && (
          <ChartTooltipBox
            title={String(activeRow[indexKey])}
            entries={tooltipEntries}
            xPct={tooltipXPct}
            topPx={8}
          />
        )}

        <table className={styles.srOnly}>
          <caption>{chartLabel}</caption>
          <thead>
            <tr>
              <th scope="col">{indexKey}</th>
              {visibleSeries.map((s) => (
                <th key={s.key} scope="col">
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <th scope="row">{String(row[indexKey])}</th>
                {visibleSeries.map((s) => (
                  <td key={s.key}>{formatVal(toNumber(row[s.key]), s.key)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartContainer>
  );
});

BarChart.displayName = 'BarChart';

export interface LineChartProps extends BaseCartesianChartProps {
  curve?: ChartCurve;
  showDots?: boolean;
  showArea?: boolean;
}

export const LineChart = forwardRef<HTMLDivElement, LineChartProps>(function LineChart(
  {
    data,
    indexKey,
    series,
    curve = 'smooth',
    showDots = true,
    showArea = false,
    height = 260,
    variant = 'surface',
    size = 'md',
    title,
    description,
    action,
    showGrid = true,
    showLegend,
    interactiveLegend = true,
    showTooltip = true,
    valueFormatter,
    isLoading = false,
    loadingLabel,
    error,
    emptyState,
    ariaLabel,
    ...props
  },
  ref
) {
  const gradientPrefix = useId().replace(/:/g, '');
  const { ref: plotRef, width } = useMeasuredWidth(600);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const canToggleLegend = interactiveLegend && series.length > 1;
  const { hiddenKeys, toggleKey, visibleSeries } = useInteractiveSeries(series, canToggleLegend);

  const formatVal = useCallback(
    (v: number, key?: string) => (valueFormatter ? valueFormatter(v, key) : defaultFormatNumber(v)),
    [valueFormatter]
  );

  const legendItems = useMemo<ChartLegendItem[]>(
    () =>
      series.map((s, idx) => ({
        key: s.key,
        label: s.label,
        color: resolveChartColor(s.color, idx),
      })),
    [series]
  );

  const seriesColorMap = useMemo(() => {
    const map = new Map<string, string>();
    series.forEach((s, idx) => map.set(s.key, resolveChartColor(s.color, idx)));
    return map;
  }, [series]);

  const scale = useMemo(() => {
    let min = 0;
    let max = 0;
    for (const row of data) {
      for (const s of visibleSeries) {
        const val = toNumber(row[s.key]);
        if (val > max) max = val;
        if (val < min) min = val;
      }
    }
    return computeNiceScale(min, max, 5);
  }, [data, visibleSeries]);

  const isEmpty = data.length === 0 || series.length === 0;
  const shouldShowLegend = showLegend ?? series.length > 1;

  const margin = { top: 14, right: 18, bottom: 30, left: 48 };
  const plotW = Math.max(120, width - margin.left - margin.right);
  const plotH = Math.max(80, height - margin.top - margin.bottom);
  const range = scale.max - scale.min || 1;
  const baselineY = margin.top + plotH - ((Math.max(0, scale.min) - scale.min) / range) * plotH;

  const getX = (idx: number) =>
    data.length <= 1 ? margin.left + plotW / 2 : margin.left + (idx / (data.length - 1)) * plotW;

  const getY = (val: number) => margin.top + plotH - ((val - scale.min) / range) * plotH;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (data.length === 0) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((cur) => (cur === null ? 0 : Math.min(data.length - 1, cur + 1)));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((cur) => (cur === null ? data.length - 1 : Math.max(0, cur - 1)));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(data.length - 1);
    } else if (e.key === 'Escape') {
      setActiveIndex(null);
    }
  };

  const chartLabel =
    ariaLabel ??
    (typeof title === 'string'
      ? title
      : `${showArea ? 'Area' : 'Line'} chart with ${data.length} points`);

  const labelStep = Math.max(1, Math.ceil(data.length / 7));
  const activeRow = activeIndex !== null ? data[activeIndex] : undefined;
  const activeX = activeIndex !== null ? getX(activeIndex) : 0;
  const tooltipXPct = activeIndex !== null ? (activeX / width) * 100 : 50;

  const tooltipEntries: TooltipEntry[] = activeRow
    ? visibleSeries.map((s) => ({
        key: s.key,
        label: s.label,
        color: seriesColorMap.get(s.key) ?? TOKEN_COLOR_MAP['chart-1'],
        formattedValue: formatVal(toNumber(activeRow[s.key]), s.key),
      }))
    : [];

  return (
    <ChartContainer
      ref={ref}
      variant={variant}
      size={size}
      title={title}
      description={description}
      action={action}
      height={height}
      isLoading={isLoading}
      loadingLabel={loadingLabel}
      error={error}
      isEmpty={isEmpty}
      emptyState={emptyState}
      legend={
        shouldShowLegend ? (
          <ChartLegend
            items={legendItems}
            hiddenKeys={hiddenKeys}
            onToggleKey={canToggleLegend ? toggleKey : undefined}
          />
        ) : undefined
      }
      {...props}
    >
      <div
        ref={plotRef}
        tabIndex={0}
        role="group"
        aria-label={`${chartLabel}. Use arrow keys to inspect values.`}
        className={styles.plotWrapper}
        style={{ height }}
        onKeyDown={handleKeyDown}
        onMouseLeave={() => setActiveIndex(null)}
        onBlur={() => setActiveIndex(null)}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={chartLabel}
          className={styles.svg}
        >
          {showArea && (
            <defs>
              {visibleSeries.map((s) => {
                const color = seriesColorMap.get(s.key) ?? TOKEN_COLOR_MAP['chart-1'];
                return (
                  <linearGradient
                    key={s.key}
                    id={`${gradientPrefix}-${s.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={color} stopOpacity={0.26} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.02} />
                  </linearGradient>
                );
              })}
            </defs>
          )}

          {scale.ticks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                {showGrid && (
                  <line
                    x1={margin.left}
                    x2={width - margin.right}
                    y1={y}
                    y2={y}
                    className={tick === 0 ? styles.axisBaseline : styles.gridLine}
                  />
                )}
                <text x={margin.left - 8} y={y + 4} textAnchor="end" className={styles.axisLabel}>
                  {formatVal(tick)}
                </text>
              </g>
            );
          })}

          {data.map((row, idx) => {
            if (idx % labelStep !== 0 && idx !== data.length - 1) return null;
            return (
              <text
                key={idx}
                x={getX(idx)}
                y={height - 8}
                textAnchor="middle"
                className={styles.axisLabel}
              >
                {String(row[indexKey])}
              </text>
            );
          })}

          {activeIndex !== null && (
            <line
              x1={activeX}
              x2={activeX}
              y1={margin.top}
              y2={margin.top + plotH}
              className={styles.crosshair}
            />
          )}

          {visibleSeries.map((s) => {
            const color = seriesColorMap.get(s.key) ?? TOKEN_COLOR_MAP['chart-1'];
            const pts: Point2D[] = data.map((row, idx) => ({
              x: getX(idx),
              y: getY(toNumber(row[s.key])),
            }));
            const strokeD = curve === 'smooth' ? buildSmoothPath(pts) : buildLinearPath(pts);
            const areaD =
              pts.length > 0
                ? `${strokeD} L ${+pts[pts.length - 1].x.toFixed(2)} ${+baselineY.toFixed(2)} L ${+pts[0].x.toFixed(2)} ${+baselineY.toFixed(2)} Z`
                : '';

            return (
              <g key={s.key} data-chart-series={s.key}>
                {showArea && pts.length > 1 && (
                  <path d={areaD} fill={`url(#${gradientPrefix}-${s.key})`} />
                )}
                <path d={strokeD} stroke={color} className={styles.linePath} />
                {(showDots || activeIndex !== null) &&
                  pts.map((pt, idx) => {
                    const isFocused = activeIndex === idx;
                    if (!showDots && !isFocused) return null;
                    return (
                      <circle
                        key={idx}
                        cx={pt.x}
                        cy={pt.y}
                        r={isFocused ? 5 : 3.25}
                        fill={color}
                        className={styles.dot}
                      />
                    );
                  })}
              </g>
            );
          })}

          {data.map((_, idx) => {
            const colW = data.length <= 1 ? plotW : plotW / data.length;
            const hitX =
              data.length <= 1
                ? margin.left
                : Math.max(margin.left, getX(idx) - colW / 2);
            return (
              <rect
                key={idx}
                x={hitX}
                y={margin.top}
                width={colW}
                height={plotH}
                className={styles.hitColumn}
                onMouseEnter={() => setActiveIndex(idx)}
              />
            );
          })}
        </svg>

        {showTooltip && activeRow && tooltipEntries.length > 0 && (
          <ChartTooltipBox
            title={String(activeRow[indexKey])}
            entries={tooltipEntries}
            xPct={tooltipXPct}
            topPx={8}
          />
        )}

        <table className={styles.srOnly}>
          <caption>{chartLabel}</caption>
          <thead>
            <tr>
              <th scope="col">{indexKey}</th>
              {visibleSeries.map((s) => (
                <th key={s.key} scope="col">
                  {s.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <th scope="row">{String(row[indexKey])}</th>
                {visibleSeries.map((s) => (
                  <td key={s.key}>{formatVal(toNumber(row[s.key]), s.key)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartContainer>
  );
});

LineChart.displayName = 'LineChart';

export interface AreaChartProps extends Omit<LineChartProps, 'showArea'> {}

export const AreaChart = forwardRef<HTMLDivElement, AreaChartProps>(function AreaChart(
  props,
  ref
) {
  return <LineChart ref={ref} showArea {...props} />;
});

AreaChart.displayName = 'AreaChart';

function polarToCartesian(cx: number, cy: number, r: number, angleRad: number): Point2D {
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeDonutArc(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number
): string {
  const sweep = endAngle - startAngle;
  if (sweep >= Math.PI * 2 - 0.0001) {
    const midAngle = startAngle + Math.PI;
    return [
      describeDonutArc(cx, cy, outerR, innerR, startAngle, midAngle - 0.0002),
      describeDonutArc(cx, cy, outerR, innerR, midAngle, endAngle),
    ].join(' ');
  }

  const largeArc = sweep > Math.PI ? 1 : 0;
  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);

  if (innerR <= 0) {
    return [
      `M ${+cx.toFixed(2)} ${+cy.toFixed(2)}`,
      `L ${+outerStart.x.toFixed(2)} ${+outerStart.y.toFixed(2)}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${+outerEnd.x.toFixed(2)} ${+outerEnd.y.toFixed(2)}`,
      'Z',
    ].join(' ');
  }

  const innerEnd = polarToCartesian(cx, cy, innerR, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, startAngle);

  return [
    `M ${+outerStart.x.toFixed(2)} ${+outerStart.y.toFixed(2)}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${+outerEnd.x.toFixed(2)} ${+outerEnd.y.toFixed(2)}`,
    `L ${+innerEnd.x.toFixed(2)} ${+innerEnd.y.toFixed(2)}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${+innerStart.x.toFixed(2)} ${+innerStart.y.toFixed(2)}`,
    'Z',
  ].join(' ');
}

export interface DonutChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  data: readonly DonutChartDatum[];
  height?: number;
  thickness?: number;
  centerValue?: React.ReactNode;
  centerLabel?: React.ReactNode;
  variant?: ChartVariant;
  size?: ChartSize;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  showLegend?: boolean;
  interactiveLegend?: boolean;
  showTooltip?: boolean;
  valueFormatter?: (value: number, label: string) => string;
  isLoading?: boolean;
  loadingLabel?: string;
  error?: React.ReactNode;
  emptyState?: React.ReactNode;
  ariaLabel?: string;
}

export const DonutChart = forwardRef<HTMLDivElement, DonutChartProps>(function DonutChart(
  {
    data,
    height = 210,
    thickness = 28,
    centerValue,
    centerLabel,
    variant = 'surface',
    size = 'md',
    title,
    description,
    action,
    showLegend = true,
    interactiveLegend = true,
    showTooltip = true,
    valueFormatter,
    isLoading = false,
    loadingLabel,
    error,
    emptyState,
    ariaLabel,
    ...props
  },
  ref
) {
  const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(() => new Set());
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const normalized = useMemo(
    () =>
      data.map((d, idx) => ({
        key: d.id ?? `${d.label}-${idx}`,
        label: d.label,
        value: Math.max(0, d.value),
        color: resolveChartColor(d.color, idx),
      })),
    [data]
  );

  const canToggle = interactiveLegend && normalized.length > 1;

  const toggleSlice = useCallback(
    (key: string) => {
      if (!canToggle) return;
      setHiddenKeys((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
          next.delete(key);
        } else {
          const visibleCount = normalized.filter((item) => !next.has(item.key)).length;
          if (visibleCount <= 1) return prev;
          next.add(key);
        }
        return next;
      });
    },
    [canToggle, normalized]
  );

  const visibleSlices = useMemo(
    () => normalized.filter((s) => !hiddenKeys.has(s.key) && s.value > 0),
    [normalized, hiddenKeys]
  );

  const total = useMemo(
    () => visibleSlices.reduce((sum, item) => sum + item.value, 0),
    [visibleSlices]
  );

  const formatSliceVal = useCallback(
    (val: number, label: string) =>
      valueFormatter ? valueFormatter(val, label) : defaultFormatNumber(val),
    [valueFormatter]
  );

  const legendItems = useMemo<ChartLegendItem[]>(
    () =>
      normalized.map((item) => ({
        key: item.key,
        label: item.label,
        color: item.color,
        value: formatSliceVal(item.value, item.label),
      })),
    [normalized, formatSliceVal]
  );

  const isEmpty = normalized.length === 0 || total <= 0;
  const diameter = Math.max(120, height);
  const cx = diameter / 2;
  const cy = diameter / 2;
  const outerR = diameter / 2 - 8;
  const innerR = Math.max(0, outerR - Math.max(8, thickness));

  const arcs = useMemo(() => {
    if (total <= 0) return [];
    let angle = -Math.PI / 2;
    return visibleSlices.map((slice) => {
      const fraction = slice.value / total;
      const startAngle = angle;
      const endAngle = angle + fraction * Math.PI * 2;
      angle = endAngle;
      return {
        ...slice,
        fraction,
        path: describeDonutArc(cx, cy, outerR, innerR, startAngle, endAngle),
      };
    });
  }, [visibleSlices, total, cx, cy, outerR, innerR]);

  const activeArc = arcs.find((a) => a.key === activeKey);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (arcs.length === 0) return;
    const curIdx = arcs.findIndex((a) => a.key === activeKey);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const next = curIdx === -1 ? 0 : (curIdx + 1) % arcs.length;
      setActiveKey(arcs[next].key);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = curIdx <= 0 ? arcs.length - 1 : curIdx - 1;
      setActiveKey(arcs[prev].key);
    } else if (e.key === 'Escape') {
      setActiveKey(null);
    }
  };

  const chartLabel =
    ariaLabel ??
    (typeof title === 'string' ? title : `Donut chart with ${visibleSlices.length} segments`);

  return (
    <ChartContainer
      ref={ref}
      variant={variant}
      size={size}
      title={title}
      description={description}
      action={action}
      height={height}
      isLoading={isLoading}
      loadingLabel={loadingLabel}
      error={error}
      isEmpty={isEmpty}
      emptyState={emptyState}
      {...props}
    >
      <div className={styles.donutLayout}>
        <div
          tabIndex={0}
          role="group"
          aria-label={`${chartLabel}. Use arrow keys to inspect segments.`}
          className={styles.donutStage}
          style={{ width: diameter, height: diameter }}
          onKeyDown={handleKeyDown}
          onMouseLeave={() => setActiveKey(null)}
          onBlur={() => setActiveKey(null)}
        >
          <svg
            width={diameter}
            height={diameter}
            viewBox={`0 0 ${diameter} ${diameter}`}
            role="img"
            aria-label={chartLabel}
          >
            {arcs.map((arc) => {
              const isSelected = activeKey === arc.key;
              return (
                <path
                  key={arc.key}
                  d={arc.path}
                  fill={arc.color}
                  data-chart-slice={arc.label}
                  className={cn(
                    styles.donutSlice,
                    activeKey !== null && !isSelected && styles.donutSliceDimmed,
                    isSelected && styles.donutSliceActive
                  )}
                  onMouseEnter={() => setActiveKey(arc.key)}
                />
              );
            })}
          </svg>

          {innerR >= 28 && (centerValue !== undefined || centerLabel !== undefined) && (
            <div className={styles.donutCenter}>
              {centerValue !== undefined && (
                <span className={styles.donutCenterValue}>{centerValue}</span>
              )}
              {centerLabel !== undefined && (
                <span className={styles.donutCenterLabel}>{centerLabel}</span>
              )}
            </div>
          )}

          {showTooltip && activeArc && (
            <ChartTooltipBox
              title={activeArc.label}
              entries={[
                {
                  key: activeArc.key,
                  label: `${(activeArc.fraction * 100).toFixed(1)}%`,
                  color: activeArc.color,
                  formattedValue: formatSliceVal(activeArc.value, activeArc.label),
                },
              ]}
              xPct={52}
              topPx={4}
            />
          )}
        </div>

        {showLegend && (
          <ChartLegend
            direction="vertical"
            items={legendItems}
            hiddenKeys={hiddenKeys}
            onToggleKey={canToggle ? toggleSlice : undefined}
          />
        )}

        <table className={styles.srOnly}>
          <caption>{chartLabel}</caption>
          <thead>
            <tr>
              <th scope="col">Segment</th>
              <th scope="col">Value</th>
              <th scope="col">Share</th>
            </tr>
          </thead>
          <tbody>
            {arcs.map((arc) => (
              <tr key={arc.key}>
                <th scope="row">{arc.label}</th>
                <td>{formatSliceVal(arc.value, arc.label)}</td>
                <td>{(arc.fraction * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartContainer>
  );
});

DonutChart.displayName = 'DonutChart';

export interface SparklineProps extends React.SVGAttributes<SVGSVGElement> {
  data: readonly number[];
  variant?: 'area' | 'line' | 'bars';
  curve?: ChartCurve;
  color?: ChartColorToken;
  height?: number;
  showEndDot?: boolean;
  label?: string;
}

export const Sparkline = forwardRef<SVGSVGElement, SparklineProps>(function Sparkline(
  {
    data,
    variant = 'area',
    curve = 'smooth',
    color = 'chart-1',
    height = 40,
    showEndDot = false,
    label = 'Sparkline trend',
    className,
    style,
    ...props
  },
  ref
) {
  const gradId = useId().replace(/:/g, '');
  const resolvedColor = resolveChartColor(color, 0);
  const viewW = 160;
  const viewH = Math.max(20, height);
  const pad = 4;

  const safeValues = useMemo(
    () => data.map((v) => (Number.isFinite(v) ? v : 0)),
    [data]
  );

  if (safeValues.length === 0) return null;

  const min = Math.min(...safeValues);
  const max = Math.max(...safeValues);
  const span = max - min || 1;
  const innerW = viewW - pad * 2;
  const innerH = viewH - pad * 2;

  const points: Point2D[] = safeValues.map((val, idx) => ({
    x: safeValues.length <= 1 ? viewW / 2 : pad + (idx / (safeValues.length - 1)) * innerW,
    y: pad + innerH - ((val - min) / span) * innerH,
  }));

  const lineD = curve === 'smooth' ? buildSmoothPath(points) : buildLinearPath(points);
  const areaD =
    points.length > 1
      ? `${lineD} L ${+points[points.length - 1].x.toFixed(2)} ${viewH - pad} L ${+points[0].x.toFixed(2)} ${viewH - pad} Z`
      : '';
  const lastPt = points[points.length - 1];

  return (
    <svg
      ref={(el) => setRef(ref, el)}
      viewBox={`0 0 ${viewW} ${viewH}`}
      height={viewH}
      preserveAspectRatio="none"
      role="img"
      aria-label={label}
      className={cn(styles.sparkline, className)}
      style={{ height: viewH, ...style }}
      {...props}
    >
      {variant === 'bars' ? (
        safeValues.map((val, idx) => {
          const gap = 2;
          const barW = Math.max(
            2,
            (innerW - gap * (safeValues.length - 1)) / safeValues.length
          );
          const barMin = Math.min(0, min);
          const barSpan = Math.max(max - barMin, 1);
          const barH = Math.max(2, ((val - barMin) / barSpan) * innerH);
          const x = pad + idx * (barW + gap);
          const y = viewH - pad - barH;
          return (
            <rect
              key={idx}
              x={x}
              y={y}
              width={barW}
              height={barH}
              rx={1.5}
              fill={resolvedColor}
            />
          );
        })
      ) : (
        <>
          {variant === 'area' && points.length > 1 && (
            <>
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={resolvedColor} stopOpacity={0.28} />
                  <stop offset="100%" stopColor={resolvedColor} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <path d={areaD} fill={`url(#${gradId})`} />
            </>
          )}
          <path
            d={lineD}
            fill="none"
            stroke={resolvedColor}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {showEndDot && lastPt && (
            <circle cx={lastPt.x} cy={lastPt.y} r={3} fill={resolvedColor} />
          )}
        </>
      )}
    </svg>
  );
});

Sparkline.displayName = 'Sparkline';
