import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from './Tooltip';

describe('Tooltip component', () => {
  it('renders shorthand Tooltip and reveals content on trigger hover/focus', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip content="Helper informative text">
          <button>Hover Me</button>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByRole('button', { name: 'Hover Me' });
    await user.hover(trigger);

    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByText('Helper informative text')).toBeInTheDocument();
  });

  it('renders low-level composable primitive Tooltip', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button>Composable Trigger</button>
          </TooltipTrigger>
          <TooltipContent variant="soft">
            Soft styled tooltip
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByRole('button', { name: 'Composable Trigger' });
    await user.hover(trigger);

    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip.className).toContain('variant-soft');
    expect(screen.getByText('Soft styled tooltip')).toBeInTheDocument();
  });

  it('supports hiding arrow with hasArrow={false}', async () => {
    const user = userEvent.setup();

    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip content="No arrow tooltip" hasArrow={false}>
          <button>Trigger Without Arrow</button>
        </Tooltip>
      </TooltipProvider>
    );

    await user.hover(screen.getByRole('button', { name: 'Trigger Without Arrow' }));
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip.querySelector('svg')).not.toBeInTheDocument();
  });
});
