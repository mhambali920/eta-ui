import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ScrollArea } from './ScrollArea';

describe('ScrollArea component', () => {
  it('renders children content correctly inside viewport', () => {
    render(
      <ScrollArea style={{ height: 200, width: 200 }}>
        <div>Scrollable Content Item 1</div>
        <div>Scrollable Content Item 2</div>
      </ScrollArea>
    );

    expect(screen.getByText('Scrollable Content Item 1')).toBeInTheDocument();
    expect(screen.getByText('Scrollable Content Item 2')).toBeInTheDocument();
  });

  it('forwards ref correctly to root element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <ScrollArea ref={ref} data-testid="scroll-area-root">
        <p>Test</p>
      </ScrollArea>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(screen.getByTestId('scroll-area-root')).toBeInTheDocument();
  });

  it('renders with both vertical and horizontal scrollbars', () => {
    const { container } = render(
      <ScrollArea orientation="both" style={{ height: 150, width: 150 }}>
        <div style={{ width: 400, height: 400 }}>Very large content</div>
      </ScrollArea>
    );

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByText('Very large content')).toBeInTheDocument();
  });
});
