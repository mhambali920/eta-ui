import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './index';

describe('HoverCard', () => {
  it('opens preview card on mouse enter / focus when openDelay is 0', () => {
    render(
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger>@eta-ui</HoverCardTrigger>
        <HoverCardContent>
          Calming soft color UI kit for modern React applications.
        </HoverCardContent>
      </HoverCard>
    );

    const trigger = screen.getByText('@eta-ui');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.mouseEnter(trigger);
    expect(screen.getByRole('dialog')).toHaveTextContent(
      'Calming soft color UI kit for modern React applications.'
    );

    fireEvent.mouseLeave(trigger);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('supports keyboard focus activation and placement/size props', () => {
    render(
      <HoverCard openDelay={0} closeDelay={0}>
        <HoverCardTrigger>Profile</HoverCardTrigger>
        <HoverCardContent placement="top" size="lg" showArrow>
          Jane Doe — Principal Product Designer
        </HoverCardContent>
      </HoverCard>
    );

    const trigger = screen.getByText('Profile');
    fireEvent.focus(trigger);

    const content = screen.getByRole('dialog');
    expect(content).toHaveAttribute('data-placement', 'top');
    expect(content).toHaveTextContent('Jane Doe — Principal Product Designer');
  });
});
