import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Heading, Text } from './index';

describe('Typography Components', () => {
  describe('Heading', () => {
    it('renders heading with default h2 tag', () => {
      render(<Heading>Main Section Heading</Heading>);
      const heading = screen.getByRole('heading', { level: 2, name: /main section heading/i });
      expect(heading).toBeInTheDocument();
    });

    it('supports custom tag and sizes', () => {
      render(<Heading as="h1" size="4xl">Hero Heading</Heading>);
      const heading = screen.getByRole('heading', { level: 1, name: /hero heading/i });
      expect(heading).toBeInTheDocument();
      expect(heading.className).toContain('heading-4xl');
    });

    it('supports colors and weights', () => {
      const { container } = render(
        <Heading color="primary" weight="medium">
          Sage Heading
        </Heading>
      );
      const heading = container.firstChild as HTMLElement;
      expect(heading.className).toContain('color-primary');
      expect(heading.className).toContain('weight-medium');
    });
  });

  describe('Text', () => {
    it('renders paragraph with default settings', () => {
      render(<Text>Body paragraph text.</Text>);
      const paragraph = screen.getByText('Body paragraph text.');
      expect(paragraph.tagName).toBe('P');
      expect(paragraph.className).toContain('variant-body');
    });

    it('supports custom tags such as span and small', () => {
      render(<Text as="span">Inline span text.</Text>);
      const span = screen.getByText('Inline span text.');
      expect(span.tagName).toBe('SPAN');
    });

    it('supports variants and semantic colors', () => {
      const { container, rerender } = render(
        <Text variant="muted" color="muted">
          Subtle caption
        </Text>
      );
      let text = container.firstChild as HTMLElement;
      expect(text.className).toContain('variant-muted');
      expect(text.className).toContain('color-muted');

      rerender(<Text color="success">Operation completed.</Text>);
      text = container.firstChild as HTMLElement;
      expect(text.className).toContain('color-success');
    });
  });
});
