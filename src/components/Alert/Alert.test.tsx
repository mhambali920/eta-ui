import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Alert, AlertTitle, AlertDescription, AlertIcon, AlertCloseButton, Callout } from './Alert';

describe('Alert component', () => {
  it('renders default info alert with polite live region', () => {
    render(<Alert title="Information" description="System is operating normally" />);
    const alert = screen.getByRole('status');
    expect(alert).toBeInTheDocument();
    expect(screen.getByText('Information')).toBeInTheDocument();
    expect(screen.getByText('System is operating normally')).toBeInTheDocument();
  });

  it('renders error status with role="alert"', () => {
    render(<Alert status="error" title="Failed" description="Something went wrong" />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('handles danger status alias as error', () => {
    render(<Alert status="danger" title="Danger" description="Dangerous action" />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('renders warning status with role="alert"', () => {
    render(<Alert status="warning" title="Warning" description="Check settings" />);
    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  it('renders success status with role="status"', () => {
    render(<Alert status="success" title="Success" description="Changes saved" />);
    const alert = screen.getByRole('status');
    expect(alert).toBeInTheDocument();
  });

  it('renders variants correctly (soft, outline, solid)', () => {
    const { rerender } = render(<Alert variant="soft" data-testid="alert">Soft</Alert>);
    let el = screen.getByTestId('alert');
    expect(el.className).toContain('variant-soft');

    rerender(<Alert variant="outline" data-testid="alert">Outline</Alert>);
    el = screen.getByTestId('alert');
    expect(el.className).toContain('variant-outline');

    rerender(<Alert variant="solid" data-testid="alert">Solid</Alert>);
    el = screen.getByTestId('alert');
    expect(el.className).toContain('variant-solid');
  });

  it('hides icon when icon={false}', () => {
    const { container } = render(<Alert icon={false} title="No icon" />);
    expect(container.querySelector('span[aria-hidden="true"]')).not.toBeInTheDocument();
  });

  it('renders custom icon', () => {
    render(<Alert icon={<span data-testid="custom-icon">★</span>} title="Custom" />);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Alert
        title="Dismissible"
        description="You can dismiss this"
        onClose={handleClose}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close alert/i });
    expect(closeButton).toBeInTheDocument();

    await user.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('supports composable subcomponents', () => {
    render(
      <Alert icon={false}>
        <AlertIcon status="success" data-testid="composed-icon" />
        <AlertTitle>Custom Title</AlertTitle>
        <AlertDescription>Custom Description</AlertDescription>
        <AlertCloseButton label="Dismiss" />
      </Alert>
    );

    expect(screen.getByTestId('composed-icon')).toBeInTheDocument();
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('works as Callout alias', () => {
    render(<Callout title="Callout note" description="Important note" />);
    expect(screen.getByText('Callout note')).toBeInTheDocument();
  });
});
