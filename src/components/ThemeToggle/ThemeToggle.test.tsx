import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../../theme';
import { ThemeToggle } from './index';

describe('ThemeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');
  });

  it('renders icon button and cycles themes on click', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('light'));

    // Light -> Dark
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('dark'));
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    // Dark -> System
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('system'));

    // System -> Light
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', expect.stringContaining('light'));
  });

  it('renders segmented variant with active indicator', () => {
    render(
      <ThemeProvider defaultTheme="light">
        <ThemeToggle variant="segmented" />
      </ThemeProvider>
    );

    const lightOption = screen.getByRole('radio', { name: /light/i });
    const darkOption = screen.getByRole('radio', { name: /dark/i });
    const systemOption = screen.getByRole('radio', { name: /system/i });

    expect(lightOption).toHaveAttribute('aria-checked', 'true');
    expect(darkOption).toHaveAttribute('aria-checked', 'false');
    expect(systemOption).toHaveAttribute('aria-checked', 'false');

    // Click dark
    fireEvent.click(darkOption);
    expect(darkOption).toHaveAttribute('aria-checked', 'true');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('supports sizes sm, md, lg', () => {
    const { container, rerender } = render(
      <ThemeProvider>
        <ThemeToggle size="sm" />
      </ThemeProvider>
    );
    let button = container.firstChild as HTMLElement;
    expect(button.className).toContain('sm');

    rerender(
      <ThemeProvider>
        <ThemeToggle size="lg" />
      </ThemeProvider>
    );
    button = container.firstChild as HTMLElement;
    expect(button.className).toContain('lg');
  });
});
