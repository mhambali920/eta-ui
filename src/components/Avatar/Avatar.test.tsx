import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarGroup } from './index';

describe('Avatar', () => {
  it('renders fallback initials derived from name', () => {
    render(<Avatar name="Sarah Connor" />);
    expect(screen.getByText('SC')).toBeInTheDocument();
  });

  it('renders custom fallback element when provided', () => {
    render(<Avatar fallback="U" />);
    expect(screen.getByText('U')).toBeInTheDocument();
  });

  it('renders status indicator badge', () => {
    const { container } = render(<Avatar name="John Doe" status="online" />);
    const status = container.querySelector('[aria-label="Status: online"]');
    expect(status).toBeInTheDocument();
  });

  it('handles sizes and shapes correctly', () => {
    const { container, rerender } = render(<Avatar name="A" size="sm" shape="rounded" />);
    let wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('sm');
    expect(wrapper.className).toContain('rounded');

    rerender(<Avatar name="A" size="xl" shape="circle" />);
    wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('xl');
    expect(wrapper.className).toContain('circle');
  });

  it('renders AvatarGroup with remaining count indicator when max is set', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="Alice" />
        <Avatar name="Bob" />
        <Avatar name="Charlie" />
        <Avatar name="Dave" />
      </AvatarGroup>
    );

    expect(screen.getByText('AL')).toBeInTheDocument();
    expect(screen.getByText('BO')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();
    expect(screen.queryByText('CH')).not.toBeInTheDocument();
  });
});
