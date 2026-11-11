import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AspectRatio } from './AspectRatio';

describe('AspectRatio component', () => {
  it('renders children with default 16:9 ratio correctly', () => {
    render(
      <div style={{ width: 300 }}>
        <AspectRatio data-testid="aspect-ratio">
          <div data-testid="child-content">Video content</div>
        </AspectRatio>
      </div>
    );

    const el = screen.getByTestId('aspect-ratio');
    expect(el).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <AspectRatio ref={ref} ratio={1}>
        <span>Square</span>
      </AspectRatio>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
