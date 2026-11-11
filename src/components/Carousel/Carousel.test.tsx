import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
  CarouselCounter,
} from './index';

describe('Carousel', () => {
  it('renders slides and initial state correctly', () => {
    render(
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
          <CarouselItem>Slide 3</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
        <CarouselCounter data-testid="counter" />
      </Carousel>
    );

    expect(screen.getByRole('region', { name: '' })).toHaveAttribute(
      'aria-roledescription',
      'carousel'
    );
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
    expect(screen.getByText('Slide 3')).toBeInTheDocument();
    expect(screen.getByTestId('counter')).toHaveTextContent('1 / 3');

    const prevBtn = screen.getByRole('button', { name: 'Previous slide' });
    const nextBtn = screen.getByRole('button', { name: 'Next slide' });

    // At slide 0 without loop, prev is disabled
    expect(prevBtn).toBeDisabled();
    expect(nextBtn).toBeEnabled();
  });

  it('navigates next and prev when buttons are clicked', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Carousel onValueChange={onValueChange}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
          <CarouselItem>Slide 3</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselCounter data-testid="counter" />
      </Carousel>
    );

    const prevBtn = screen.getByRole('button', { name: 'Previous slide' });
    const nextBtn = screen.getByRole('button', { name: 'Next slide' });

    await user.click(nextBtn);
    expect(onValueChange).toHaveBeenCalledWith(1);
    expect(screen.getByTestId('counter')).toHaveTextContent('2 / 3');
    expect(prevBtn).toBeEnabled();

    await user.click(nextBtn);
    expect(onValueChange).toHaveBeenCalledWith(2);
    expect(screen.getByTestId('counter')).toHaveTextContent('3 / 3');
    expect(nextBtn).toBeDisabled();

    await user.click(prevBtn);
    expect(onValueChange).toHaveBeenCalledWith(1);
    expect(screen.getByTestId('counter')).toHaveTextContent('2 / 3');
  });

  it('supports loop mode navigation and never lands on an empty slide during rapid clicks', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    const { container } = render(
      <Carousel loop onValueChange={onValueChange}>
        <CarouselContent>
          <CarouselItem>Slide A</CarouselItem>
          <CarouselItem>Slide B</CarouselItem>
          <CarouselItem>Slide C</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );

    const prevBtn = screen.getByRole('button', { name: 'Previous slide' });
    const nextBtn = screen.getByRole('button', { name: 'Next slide' });
    const track = container.querySelector('[aria-live]') as HTMLElement;

    expect(prevBtn).toBeEnabled();
    expect(nextBtn).toBeEnabled();

    // Rapidly click next 12 times without firing transitionEnd
    for (let i = 0; i < 12; i++) {
      await user.click(nextBtn);
      // With 3 real slides and cloneCount=2 (total 7 rendered slides, indices 0..6),
      // valid translate3d offsets are between 0% and -600%.
      const match = track.style.transform.match(/translate3d\((-?\d+(?:\.\d+)?)%/);
      expect(match).not.toBeNull();
      const pct = Number(match?.[1]);
      expect(pct).toBeLessThanOrEqual(0);
      expect(pct).toBeGreaterThanOrEqual(-600);
    }

    // Rapidly click prev 12 times without firing transitionEnd
    for (let i = 0; i < 12; i++) {
      await user.click(prevBtn);
      const match = track.style.transform.match(/translate3d\((-?\d+(?:\.\d+)?)%/);
      expect(match).not.toBeNull();
      const pct = Number(match?.[1]);
      expect(pct).toBeLessThanOrEqual(0);
      expect(pct).toBeGreaterThanOrEqual(-600);
    }
  });

  it('clamps maxIndex when itemsPerView > 1 so there are no trailing empty pages', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Carousel itemsPerView={2} loop={false} onValueChange={onValueChange}>
        <CarouselContent>
          <CarouselItem>Item 1</CarouselItem>
          <CarouselItem>Item 2</CarouselItem>
          <CarouselItem>Item 3</CarouselItem>
          <CarouselItem>Item 4</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    );

    // 4 items with itemsPerView=2 -> maxIndex = 2, snapCount = 3 dots (0, 1, 2)
    const dots = screen.getAllByRole('tab');
    expect(dots).toHaveLength(3);

    const nextBtn = screen.getByRole('button', { name: 'Next slide' });
    await user.click(nextBtn);
    expect(onValueChange).toHaveBeenLastCalledWith(1);
    expect(nextBtn).toBeEnabled();

    await user.click(nextBtn);
    expect(onValueChange).toHaveBeenLastCalledWith(2);
    expect(nextBtn).toBeDisabled();
  });

  it('navigates via dots pagination', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Carousel onValueChange={onValueChange}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
          <CarouselItem>Slide 3</CarouselItem>
        </CarouselContent>
        <CarouselDots />
      </Carousel>
    );

    const dots = screen.getAllByRole('tab');
    expect(dots).toHaveLength(3);

    expect(dots[0]).toHaveAttribute('aria-selected', 'true');
    expect(dots[1]).toHaveAttribute('aria-selected', 'false');

    await user.click(dots[2]);
    expect(onValueChange).toHaveBeenCalledWith(2);
    expect(dots[2]).toHaveAttribute('aria-selected', 'true');
  });

  it('navigates with keyboard arrow, Home, and End keys', () => {
    const onValueChange = vi.fn();

    render(
      <Carousel onValueChange={onValueChange}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
          <CarouselItem>Slide 3</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    const carousel = screen.getByRole('region');

    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    expect(onValueChange).toHaveBeenCalledWith(1);

    fireEvent.keyDown(carousel, { key: 'End' });
    expect(onValueChange).toHaveBeenCalledWith(2);

    fireEvent.keyDown(carousel, { key: 'Home' });
    expect(onValueChange).toHaveBeenCalledWith(0);
  });

  it('supports controlled value prop', () => {
    const { rerender } = render(
      <Carousel value={0}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
        <CarouselDots />
      </Carousel>
    );

    let dots = screen.getAllByRole('tab');
    expect(dots[0]).toHaveAttribute('aria-selected', 'true');

    rerender(
      <Carousel value={1}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
        <CarouselDots />
      </Carousel>
    );

    dots = screen.getAllByRole('tab');
    expect(dots[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('supports pointer drag swipe navigation', () => {
    if (typeof window.PointerEvent === 'undefined') {
      (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
    }
    const onValueChange = vi.fn();

    const { container } = render(
      <Carousel onValueChange={onValueChange}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
      </Carousel>
    );

    const track = container.querySelector('[aria-live]') as HTMLElement;
    const viewport = track.parentElement as HTMLElement;
    expect(viewport).toBeInTheDocument();

    fireEvent.pointerDown(viewport, { button: 0, clientX: 240, clientY: 100 });
    fireEvent.pointerMove(viewport, { clientX: 80, clientY: 100 });
    fireEvent.pointerUp(viewport, { clientX: 80, clientY: 100 });

    expect(onValueChange).toHaveBeenCalledWith(1);
  });

  it('supports vertical orientation with keyboard navigation', () => {
    const onValueChange = vi.fn();

    render(
      <Carousel orientation="vertical" onValueChange={onValueChange}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    );

    const carousel = screen.getByRole('region');

    fireEvent.keyDown(carousel, { key: 'ArrowDown' });
    expect(onValueChange).toHaveBeenCalledWith(1);

    fireEvent.keyDown(carousel, { key: 'ArrowUp' });
    expect(onValueChange).toHaveBeenCalledWith(0);
  });

  it('performs seamless continuous loop without rewinding on transition end', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    const { container } = render(
      <Carousel loop defaultValue={1} onValueChange={onValueChange}>
        <CarouselContent>
          <CarouselItem>Slide 1</CarouselItem>
          <CarouselItem>Slide 2</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );

    const nextBtn = screen.getByRole('button', { name: 'Next slide' });
    const track = container.querySelector('[aria-live]') as HTMLElement;
    expect(track).toBeInTheDocument();

    // With 2 real slides and cloneCount=2, pos=1 is at -(1 + 2)*100% = -300%
    expect(track.style.transform).toBe('translate3d(-300%, 0, 0)');

    // Click next -> animates forward to clone of Slide 1 (pos=2 -> -(2 + 2)*100% = -400%)
    await user.click(nextBtn);
    expect(track.style.transform).toBe('translate3d(-400%, 0, 0)');
    expect(onValueChange).toHaveBeenCalledWith(0);

    // Trigger transitionEnd -> seamlessly snaps to real Slide 1 (pos=0 -> -(0 + 2)*100% = -200%)
    fireEvent.transitionEnd(track, { propertyName: 'transform' });
    expect(track.style.transform).toBe('translate3d(-200%, 0, 0)');
  });
});
