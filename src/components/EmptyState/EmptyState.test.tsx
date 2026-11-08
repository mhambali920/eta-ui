import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateActions,
} from './index';

describe('EmptyState', () => {
  it('renders title, description, default icon, and action via shorthand props', () => {
    const onCreate = vi.fn();
    render(
      <EmptyState
        title="No projects yet"
        description="Get started by creating your first workspace project."
        action={<button onClick={onCreate}>Create Project</button>}
      />
    );

    expect(screen.getByText('No projects yet')).toBeInTheDocument();
    expect(
      screen.getByText('Get started by creating your first workspace project.')
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Create Project' }));
    expect(onCreate).toHaveBeenCalledTimes(1);
  });

  it('supports composable subcomponents and variants', () => {
    const { container } = render(
      <EmptyState variant="surface" size="lg">
        <EmptyStateIcon>★</EmptyStateIcon>
        <EmptyStateTitle>No starred items</EmptyStateTitle>
        <EmptyStateDescription>Star items to access them quickly here.</EmptyStateDescription>
        <EmptyStateActions>
          <button>Explore</button>
        </EmptyStateActions>
      </EmptyState>
    );

    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain('surface');
    expect(root.className).toContain('lg');
    expect(screen.getByText('No starred items')).toBeInTheDocument();
  });
});
