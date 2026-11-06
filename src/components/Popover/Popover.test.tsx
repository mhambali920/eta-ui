import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
  PopoverBody,
  PopoverFooter,
  PopoverClose,
} from './Popover';

describe('Popover component', () => {
  it('opens and closes popover on trigger click and close button', async () => {
    const user = userEvent.setup();

    render(
      <Popover>
        <PopoverTrigger asChild>
          <button>Open Popover</button>
        </PopoverTrigger>
        <PopoverContent showCloseButton>
          <PopoverHeader>
            <PopoverTitle>Filter Options</PopoverTitle>
            <PopoverDescription>Customize table filters</PopoverDescription>
          </PopoverHeader>
          <PopoverBody>Filter body content</PopoverBody>
          <PopoverFooter>
            <PopoverClose asChild>
              <button>Apply</button>
            </PopoverClose>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    );

    expect(screen.queryByText('Filter Options')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Open Popover' }));

    expect(screen.getByText('Filter Options')).toBeInTheDocument();
    expect(screen.getByText('Customize table filters')).toBeInTheDocument();
    expect(screen.getByText('Filter body content')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: 'Close popover' });
    await user.click(closeBtn);

    expect(screen.queryByText('Filter Options')).not.toBeInTheDocument();
  });

  it('renders different size classes', () => {
    render(
      <Popover open>
        <PopoverContent size="lg" data-testid="popover-content">
          <div>Large Popover</div>
        </PopoverContent>
      </Popover>
    );

    const content = screen.getByTestId('popover-content');
    expect(content.className).toContain('size-lg');
  });
});
