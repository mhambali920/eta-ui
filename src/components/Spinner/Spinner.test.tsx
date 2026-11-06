import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';

describe('Spinner component', () => {
  it('renders with role="status" and default accessibility label', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom accessibility label', () => {
    render(<Spinner label="Processing payment..." />);
    expect(screen.getByText('Processing payment...')).toBeInTheDocument();
  });

  it('renders different sizes correctly', () => {
    const { rerender } = render(<Spinner size="xs" data-testid="spinner" />);
    let spinner = screen.getByTestId('spinner');
    expect(spinner.className).toContain('size-xs');

    rerender(<Spinner size="lg" data-testid="spinner" />);
    spinner = screen.getByTestId('spinner');
    expect(spinner.className).toContain('size-lg');
  });

  it('renders semantic colors', () => {
    const { rerender } = render(<Spinner color="primary" data-testid="spinner" />);
    let spinner = screen.getByTestId('spinner');
    expect(spinner.className).toContain('color-primary');

    rerender(<Spinner color="success" data-testid="spinner" />);
    spinner = screen.getByTestId('spinner');
    expect(spinner.className).toContain('color-success');
  });

  it('applies custom inline styles for thickness, speed, and emptyColor', () => {
    render(
      <Spinner
        thickness={4}
        speed="0.5s"
        emptyColor="rgba(0,0,0,0.1)"
        data-testid="spinner"
      />
    );
    const spinner = screen.getByTestId('spinner');
    expect(spinner.style.borderWidth).toBe('4px');
    expect(spinner.style.animationDuration).toBe('0.5s');
    expect(spinner.style.borderRightColor).toBe('rgba(0, 0, 0, 0.1)');
  });
});
