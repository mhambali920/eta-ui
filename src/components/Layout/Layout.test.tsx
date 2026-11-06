import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Container, Divider } from './index';

describe('Layout Components', () => {
  describe('Container', () => {
    it('renders children with container wrapper', () => {
      render(<Container>Page Content</Container>);
      expect(screen.getByText('Page Content')).toBeInTheDocument();
    });

    it('handles size, padding, and centerContent props', () => {
      const { container, rerender } = render(
        <Container size="sm" centerContent>
          Centered Content
        </Container>
      );
      let el = container.firstChild as HTMLElement;
      expect(el.className).toContain('size-sm');
      expect(el.className).toContain('centerContent');
      expect(el.className).toContain('padded');

      rerender(<Container size="fluid" isPadded={false}>Fluid</Container>);
      el = container.firstChild as HTMLElement;
      expect(el.className).toContain('size-fluid');
      expect(el.className).not.toContain('padded');
    });
  });

  describe('Divider', () => {
    it('renders horizontal separator by default', () => {
      render(<Divider />);
      const separator = screen.getByRole('separator');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
      expect(separator.className).toContain('horizontal');
    });

    it('renders vertical separator', () => {
      render(<Divider orientation="vertical" />);
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-orientation', 'vertical');
      expect(separator.className).toContain('vertical');
    });

    it('renders divider with text label and label position', () => {
      render(<Divider label="OR" labelPosition="center" />);
      expect(screen.getByText('OR')).toBeInTheDocument();
      const separator = screen.getByRole('separator');
      expect(separator.className).toContain('hasLabel');
      expect(separator.className).toContain('label-center');
    });

    it('supports dashed and dotted styles', () => {
      const { container } = render(<Divider variant="dashed" />);
      const el = container.firstChild as HTMLElement;
      expect(el.className).toContain('dashed');
    });
  });
});
