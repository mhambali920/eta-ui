import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './index';

describe('Collapsible', () => {
  it('toggles content visibility and aria-expanded on trigger click', () => {
    const onOpenChange = vi.fn();
    render(
      <Collapsible onOpenChange={onOpenChange}>
        <CollapsibleTrigger>Show advanced settings</CollapsibleTrigger>
        <CollapsibleContent>Custom webhook configuration</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole('button', { name: 'Show advanced settings' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Custom webhook configuration')).not.toBeInTheDocument();

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Custom webhook configuration')).toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledWith(true);

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Custom webhook configuration')).not.toBeInTheDocument();
  });

  it('respects defaultOpen and disabled prop', () => {
    render(
      <Collapsible defaultOpen disabled>
        <CollapsibleTrigger>Locked section</CollapsibleTrigger>
        <CollapsibleContent>Always visible while locked</CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole('button', { name: 'Locked section' });
    expect(trigger).toBeDisabled();
    expect(screen.getByText('Always visible while locked')).toBeInTheDocument();

    fireEvent.click(trigger);
    expect(screen.getByText('Always visible while locked')).toBeInTheDocument();
  });
});
