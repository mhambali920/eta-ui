import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Slider } from './Slider';

describe('Slider component', () => {
  it('renders slider with role="slider" and value', () => {
    render(<Slider defaultValue={[50]} aria-label="Volume" />);
    const slider = screen.getByRole('slider', { name: 'Volume' });
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute('aria-valuenow', '50');
  });

  it('renders multiple thumbs for range selection', () => {
    render(<Slider defaultValue={[20, 80]} />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(2);
    expect(sliders[0]).toHaveAttribute('aria-valuenow', '20');
    expect(sliders[1]).toHaveAttribute('aria-valuenow', '80');
  });

  it('renders sizes and colors', () => {
    const { rerender } = render(
      <Slider defaultValue={[30]} size="sm" color="success" data-testid="slider" />
    );
    let el = screen.getByTestId('slider');
    expect(el.className).toContain('size-sm');
    expect(el.className).toContain('color-success');

    rerender(
      <Slider defaultValue={[30]} size="lg" color="danger" data-testid="slider" />
    );
    el = screen.getByTestId('slider');
    expect(el.className).toContain('size-lg');
    expect(el.className).toContain('color-danger');
  });

  it('respects disabled state', () => {
    render(<Slider defaultValue={[40]} disabled data-testid="slider" />);
    const el = screen.getByTestId('slider');
    expect(el).toHaveAttribute('data-disabled');
  });
});
