import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { ThemeScript, getThemeInitScript, ThemeProvider } from './index';

describe('ThemeScript SSR anti-FOUC helper', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = '';
  });

  it('renders inline script tag with suppressHydrationWarning', () => {
    const { container } = render(<ThemeScript defaultTheme="dark" nonce="test-nonce" />);
    const scriptEl = container.querySelector('script');
    expect(scriptEl).toBeInTheDocument();
    expect(scriptEl).toHaveAttribute('nonce', 'test-nonce');
    expect(scriptEl?.innerHTML).toContain('eta-ui-theme');
  });

  it('synchronously applies stored dark theme, class, and colorScheme before paint', () => {
    localStorage.setItem('eta-ui-theme', 'dark');
    const code = getThemeInitScript({ defaultTheme: 'light', storageKey: 'eta-ui-theme' });
    new Function(code)();

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });

  it('falls back to defaultTheme when localStorage is empty and syncs with ThemeProvider', () => {
    const code = getThemeInitScript({ defaultTheme: 'light' });
    new Function(code)();

    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe('light');

    render(
      <ThemeProvider defaultTheme="dark">
        <div>Content</div>
      </ThemeProvider>
    );

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(document.documentElement.style.colorScheme).toBe('dark');
  });
});
