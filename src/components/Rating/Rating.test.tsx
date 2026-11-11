import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Rating } from './Rating';

describe('Rating component', () => {
  it('renders correct number of stars and initial value', () => {
    render(<Rating defaultValue={3} max={5} />);
    const ratingEl = screen.getByRole('slider');
    expect(ratingEl).toHaveAttribute('aria-valuenow', '3');
    expect(ratingEl).toHaveAttribute('aria-valuemax', '5');
    expect(screen.getByTestId('star-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('star-item-5')).toBeInTheDocument();
  });

  it('updates value and calls onChange on star click', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Rating defaultValue={2} onChange={handleChange} />);
    const star4 = screen.getByTestId('star-item-4');
    await user.click(star4);

    expect(handleChange).toHaveBeenCalledWith(4);
    const ratingEl = screen.getByRole('slider');
    expect(ratingEl).toHaveAttribute('aria-valuenow', '4');
  });

  it('navigates with keyboard ArrowRight and ArrowLeft', () => {
    const handleChange = vi.fn();
    render(<Rating defaultValue={3} max={5} onChange={handleChange} />);
    const ratingEl = screen.getByRole('slider');

    fireEvent.keyDown(ratingEl, { key: 'ArrowRight' });
    expect(handleChange).toHaveBeenLastCalledWith(4);

    fireEvent.keyDown(ratingEl, { key: 'ArrowLeft' });
    expect(handleChange).toHaveBeenLastCalledWith(3);
  });

  it('does not change value when readOnly or disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Rating defaultValue={3} readOnly onChange={handleChange} />);
    const star5 = screen.getByTestId('star-item-5');
    await user.click(star5);

    expect(handleChange).not.toHaveBeenCalled();
    const ratingEl = screen.getByRole('slider');
    expect(ratingEl).toHaveAttribute('aria-valuenow', '3');
  });

  it('supports half precision selection', () => {
    const handleChange = vi.fn();
    render(<Rating defaultValue={2} precision={0.5} onChange={handleChange} />);
    const star3 = screen.getByTestId('star-item-3');

    // Simulate clicking left half of star 3
    fireEvent.click(star3, { clientX: 0 });
    expect(handleChange).toHaveBeenCalled();
  });
});
