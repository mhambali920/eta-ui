import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Progress, CircularProgress } from './index';

describe('Progress & CircularProgress', () => {
  it('renders determinate linear Progress with aria attributes and value label', () => {
    render(<Progress value={65} label="Uploading files" showValueLabel />);
    const bar = screen.getByRole('progressbar', { name: 'Uploading files' });
    expect(bar).toHaveAttribute('aria-valuenow', '65');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('clamps out-of-range values between min and max', () => {
    const { rerender } = render(<Progress value={140} min={0} max={100} showValueLabel />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByText('100%')).toBeInTheDocument();

    rerender(<Progress value={-25} min={0} max={100} showValueLabel />);
    expect(bar).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('supports indeterminate linear Progress without aria-valuenow', () => {
    render(<Progress isIndeterminate aria-label="Loading data" />);
    const bar = screen.getByRole('progressbar', { name: 'Loading data' });
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).toHaveAttribute('data-indeterminate');
  });

  it('renders CircularProgress in determinate and indeterminate modes', () => {
    const { rerender } = render(
      <CircularProgress value={80} color="success" size="lg" showValueLabel />
    );
    const ring = screen.getByRole('progressbar');
    expect(ring).toHaveAttribute('aria-valuenow', '80');
    expect(screen.getByText('80%')).toBeInTheDocument();

    rerender(<CircularProgress isIndeterminate color="primary" />);
    expect(ring).not.toHaveAttribute('aria-valuenow');
    expect(ring).toHaveAttribute('data-indeterminate');
  });
});
