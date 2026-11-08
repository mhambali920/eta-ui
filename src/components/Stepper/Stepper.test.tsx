import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Stepper, Step } from './index';

describe('Stepper', () => {
  it('derives complete, active, and upcoming step statuses from activeStep', () => {
    render(
      <Stepper activeStep={1}>
        <Step title="Account" description="Create credentials" />
        <Step title="Workspace" description="Configure team" />
        <Step title="Review" description="Launch project" />
      </Stepper>
    );

    const steps = screen.getAllByRole('listitem');
    expect(steps).toHaveLength(3);
    expect(steps[0]).toHaveAttribute('data-status', 'complete');
    expect(steps[1]).toHaveAttribute('data-status', 'active');
    expect(steps[1]).toHaveAttribute('aria-current', 'step');
    expect(steps[2]).toHaveAttribute('data-status', 'upcoming');
  });

  it('supports clickable steps via onStepClick and explicit error status', () => {
    const onStepClick = vi.fn();
    render(
      <Stepper activeStep={0} onStepClick={onStepClick}>
        <Step title="Step 1" />
        <Step title="Step 2" status="error" />
      </Stepper>
    );

    const steps = screen.getAllByRole('listitem');
    expect(steps[1]).toHaveAttribute('data-status', 'error');

    fireEvent.click(steps[1]);
    expect(onStepClick).toHaveBeenCalledWith(1);
  });
});
