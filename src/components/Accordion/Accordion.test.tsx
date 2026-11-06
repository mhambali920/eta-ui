import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './Accordion';

describe('Accordion component', () => {
  it('expands and collapses item on trigger click (single collapsible)', async () => {
    const user = userEvent.setup();

    render(
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Question 1</AccordionTrigger>
          <AccordionContent>Answer 1 content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Question 2</AccordionTrigger>
          <AccordionContent>Answer 2 content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText('Answer 1 content')).toBeInTheDocument();
    expect(screen.queryByText('Answer 2 content')).not.toBeInTheDocument();

    // Click item 2
    await user.click(screen.getByRole('button', { name: 'Question 2' }));

    expect(screen.queryByText('Answer 1 content')).not.toBeInTheDocument();
    expect(screen.getByText('Answer 2 content')).toBeInTheDocument();

    // Click item 2 again to collapse
    await user.click(screen.getByRole('button', { name: 'Question 2' }));
    expect(screen.queryByText('Answer 2 content')).not.toBeInTheDocument();
  });

  it('allows multiple items open simultaneously when type="multiple"', async () => {
    const user = userEvent.setup();

    render(
      <Accordion type="multiple" defaultValue={['item-1']}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Body 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Body 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText('Body 1')).toBeInTheDocument();
    expect(screen.queryByText('Body 2')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Section 2' }));

    expect(screen.getByText('Body 1')).toBeInTheDocument();
    expect(screen.getByText('Body 2')).toBeInTheDocument();
  });

  it('renders variants and size classes correctly', () => {
    const { rerender } = render(
      <Accordion type="single" variant="flush" size="sm" data-testid="accordion">
        <AccordionItem value="i1">
          <AccordionTrigger>Item</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    let el = screen.getByTestId('accordion');
    expect(el.className).toContain('variant-flush');
    expect(el.className).toContain('size-sm');

    rerender(
      <Accordion type="single" variant="soft" size="lg" data-testid="accordion">
        <AccordionItem value="i1">
          <AccordionTrigger>Item</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    el = screen.getByTestId('accordion');
    expect(el.className).toContain('variant-soft');
    expect(el.className).toContain('size-lg');
  });

  it('respects disabled items', async () => {
    const user = userEvent.setup();

    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="disabled" disabled>
          <AccordionTrigger>Disabled Item</AccordionTrigger>
          <AccordionContent>Disabled Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole('button', { name: 'Disabled Item' });
    await user.click(trigger);

    expect(screen.queryByText('Disabled Content')).not.toBeInTheDocument();
  });
});
