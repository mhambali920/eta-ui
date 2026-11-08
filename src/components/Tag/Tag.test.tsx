import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tag, Chip, TagGroup } from './index';

describe('Tag / Chip', () => {
  it('renders Tag label with variants, colors, sizes, and shapes', () => {
    const { container } = render(
      <Tag variant="solid" color="success" size="lg" shape="pill">
        Verified
      </Tag>
    );
    expect(screen.getByText('Verified')).toBeInTheDocument();
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('solid');
    expect(el.className).toContain('success');
    expect(el.className).toContain('lg');
    expect(el.className).toContain('pill');
  });

  it('calls onRemove when close button is clicked', () => {
    const onRemove = vi.fn();
    render(
      <Tag isClosable onRemove={onRemove}>
        TypeScript
      </Tag>
    );

    const removeBtn = screen.getByRole('button', { name: 'Remove tag' });
    fireEvent.click(removeBtn);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('supports interactive selectable Chip mode with aria-pressed and keyboard activation', () => {
    const onClick = vi.fn();
    render(
      <TagGroup>
        <Chip isSelected={true} onClick={onClick}>
          Design System
        </Chip>
      </TagGroup>
    );

    const chip = screen.getByRole('button', { name: 'Design System' });
    expect(chip).toHaveAttribute('aria-pressed', 'true');

    fireEvent.keyDown(chip, { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
