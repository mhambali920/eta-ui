import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DragAndDrop,
  Draggable,
  DragHandle,
  Droppable,
  DragOverlay,
  SortableList,
  SortableItem,
  arrayMove,
  moveBetweenContainers,
  type DragEndEvent,
} from './index';

describe('DragAndDrop utilities', () => {
  it('reorders elements immutably with arrayMove', () => {
    const original = ['a', 'b', 'c', 'd'];
    expect(arrayMove(original, 0, 2)).toEqual(['b', 'c', 'a', 'd']);
    expect(arrayMove(original, 3, 1)).toEqual(['a', 'd', 'b', 'c']);
    expect(arrayMove(original, 1, 1)).toEqual(['a', 'b', 'c', 'd']);
    expect(original).toEqual(['a', 'b', 'c', 'd']);
  });

  it('moves items across containers immutably with moveBetweenContainers', () => {
    const initial = {
      todo: ['task-1', 'task-2'],
      done: ['task-3'],
    };

    const updated = moveBetweenContainers(initial, 'todo', 'done', 0, 1);
    expect(updated.todo).toEqual(['task-2']);
    expect(updated.done).toEqual(['task-3', 'task-1']);
    expect(initial.todo).toEqual(['task-1', 'task-2']);
  });
});

describe('SortableList and SortableItem', () => {
  it('renders list items and supports empty, loading, and error states', () => {
    const { rerender } = render(
      <SortableList items={[]} emptyState="Queue is empty. Add a task to begin." />
    );
    expect(screen.getByText('Queue is empty. Add a task to begin.')).toBeInTheDocument();

    rerender(<SortableList items={[]} isLoading loadingLabel="Fetching queue..." />);
    expect(screen.getByRole('status')).toHaveTextContent('Fetching queue...');

    rerender(<SortableList items={[]} error="Could not load tasks. Check connection." />);
    expect(screen.getByRole('alert')).toHaveTextContent('Could not load tasks. Check connection.');
  });

  it('reorders items via pointer drag past threshold and ignores sub-threshold clicks', () => {
    if (typeof window.PointerEvent === 'undefined') {
      (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
    }

    const onReorder = vi.fn();
    const items = [
      { id: 'alpha', title: 'Alpha' },
      { id: 'beta', title: 'Beta' },
      { id: 'gamma', title: 'Gamma' },
    ];

    function Harness() {
      const [list, setList] = useState(items);
      return (
        <SortableList
          items={list}
          onReorder={onReorder}
          onItemsChange={(next) => setList(next)}
        >
          {list.map((entry) => (
            <SortableItem key={entry.id} id={entry.id} label={entry.title}>
              {entry.title}
            </SortableItem>
          ))}
        </SortableList>
      );
    }

    render(<Harness />);

    const alphaEl = screen.getByText('Alpha').closest('li') as HTMLElement;
    const gammaEl = screen.getByText('Gamma').closest('li') as HTMLElement;

    // Sub-threshold movement should not trigger reorder
    fireEvent.pointerDown(alphaEl, { button: 0, clientX: 20, clientY: 20 });
    fireEvent.pointerMove(alphaEl, { clientX: 22, clientY: 22 });
    fireEvent.pointerUp(alphaEl, { clientX: 22, clientY: 22 });
    expect(onReorder).not.toHaveBeenCalled();

    // Drag Alpha onto Gamma
    fireEvent.pointerDown(alphaEl, { button: 0, clientX: 20, clientY: 20 });
    fireEvent.pointerMove(gammaEl, { clientX: 20, clientY: 120 });
    fireEvent.pointerUp(gammaEl, { clientX: 20, clientY: 120 });

    expect(onReorder).toHaveBeenCalledTimes(1);
    expect(onReorder).toHaveBeenCalledWith(['beta', 'gamma', 'alpha'], {
      activeId: 'alpha',
      fromIndex: 0,
      toIndex: 2,
    });

    const renderedItems = screen.getAllByRole('listitem');
    expect(renderedItems.map((el) => el.textContent)).toEqual(['Beta', 'Gamma', 'Alpha']);
  });

  it('restricts drag initiation to DragHandle when handle prop is enabled', async () => {
    if (typeof window.PointerEvent === 'undefined') {
      (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
    }

    const user = userEvent.setup();
    const onReorder = vi.fn();
    const onDeleteClick = vi.fn();
    const ids = ['one', 'two'];

    render(
      <SortableList items={ids} onReorder={onReorder}>
        <SortableItem id="one" label="First item" handle>
          <DragHandle />
          <span>First item</span>
          <button type="button" onClick={onDeleteClick}>
            Remove
          </button>
        </SortableItem>
        <SortableItem id="two" label="Second item" handle>
          <DragHandle />
          <span>Second item</span>
        </SortableItem>
      </SortableList>
    );

    const firstLi = screen.getByText('First item').closest('li') as HTMLElement;
    const secondLi = screen.getByText('Second item').closest('li') as HTMLElement;

    // Dragging the item body directly should not reorder when handle=true
    fireEvent.pointerDown(firstLi, { button: 0, clientX: 10, clientY: 10 });
    fireEvent.pointerMove(secondLi, { clientX: 10, clientY: 90 });
    fireEvent.pointerUp(secondLi, { clientX: 10, clientY: 90 });
    expect(onReorder).not.toHaveBeenCalled();

    // Nested interactive button remains clickable
    await user.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onDeleteClick).toHaveBeenCalledTimes(1);

    // Dragging via DragHandle reorders properly
    const firstHandle = screen.getByRole('button', { name: 'Drag First item' });
    fireEvent.pointerDown(firstHandle, { button: 0, clientX: 10, clientY: 10 });
    fireEvent.pointerMove(secondLi, { clientX: 10, clientY: 90 });
    fireEvent.pointerUp(secondLi, { clientX: 10, clientY: 90 });

    expect(onReorder).toHaveBeenCalledWith(['two', 'one'], {
      activeId: 'one',
      fromIndex: 0,
      toIndex: 1,
    });
  });

  it('reorders items with single-pointer move buttons (WCAG 2.5.7)', async () => {
    const user = userEvent.setup();
    const onReorder = vi.fn();

    function MoveButtonsHarness() {
      const [items, setItems] = useState(['Step A', 'Step B', 'Step C']);
      return (
        <SortableList
          items={items}
          showMoveButtons
          onReorder={(next, detail) => {
            setItems(next);
            onReorder(next, detail);
          }}
        >
          {items.map((item) => (
            <SortableItem key={item} id={item} label={item}>
              {item}
            </SortableItem>
          ))}
        </SortableList>
      );
    }

    render(<MoveButtonsHarness />);

    expect(screen.getByRole('button', { name: 'Move Step A up' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Move Step C down' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Move Step A down' }));
    expect(onReorder).toHaveBeenCalledWith(['Step B', 'Step A', 'Step C'], {
      activeId: 'Step A',
      fromIndex: 0,
      toIndex: 1,
    });
  });

  it('supports keyboard pickup, arrow movement, drop, and Escape cancellation', () => {
    const onReorder = vi.fn();
    const onDragCancel = vi.fn();

    render(
      <DragAndDrop onDragCancel={onDragCancel}>
        <SortableList items={['item-1', 'item-2', 'item-3']} onReorder={onReorder}>
          <SortableItem id="item-1" label="Item 1">
            Item 1
          </SortableItem>
          <SortableItem id="item-2" label="Item 2">
            Item 2
          </SortableItem>
          <SortableItem id="item-3" label="Item 3">
            Item 3
          </SortableItem>
        </SortableList>
      </DragAndDrop>
    );

    const first = screen.getByText('Item 1').closest('li') as HTMLElement;
    first.focus();

    // Pick up, move down, then cancel with Escape
    fireEvent.keyDown(first, { key: ' ' });
    fireEvent.keyDown(first, { key: 'ArrowDown' });
    fireEvent.keyDown(first, { key: 'Escape' });

    expect(onDragCancel).toHaveBeenCalledTimes(1);
    expect(onReorder).not.toHaveBeenCalled();

    // Pick up, move to End, and drop with Enter
    fireEvent.keyDown(first, { key: ' ' });
    fireEvent.keyDown(first, { key: 'End' });
    fireEvent.keyDown(first, { key: 'Enter' });

    expect(onReorder).toHaveBeenCalledWith(['item-2', 'item-3', 'item-1'], {
      activeId: 'item-1',
      fromIndex: 0,
      toIndex: 2,
    });
  });
});

describe('Draggable, Droppable, and Cross-Container Kanban', () => {
  it('handles accepted and rejected drops based on type filtering', () => {
    if (typeof window.PointerEvent === 'undefined') {
      (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
    }

    const onDragEnd = vi.fn();

    render(
      <DragAndDrop onDragEnd={onDragEnd}>
        <Draggable id="doc-1" type="pdf" label="Quarterly Report">
          Quarterly Report
        </Draggable>
        <Draggable id="img-1" type="image" label="Diagram PNG">
          Diagram PNG
        </Draggable>
        <Droppable id="pdf-zone" accept="pdf" label="PDF Signing Bucket">
          Drop PDF here
        </Droppable>
        <DragOverlay>{(active) => <span>Dragging: {active.label}</span>}</DragOverlay>
      </DragAndDrop>
    );

    const docEl = screen.getByRole('button', { name: 'Quarterly Report' });
    const imgEl = screen.getByRole('button', { name: 'Diagram PNG' });
    const zoneEl = screen.getByRole('group', { name: 'PDF Signing Bucket' });

    // Drag incompatible image over pdf-zone -> rejected
    fireEvent.pointerDown(imgEl, { button: 0, clientX: 15, clientY: 15 });
    fireEvent.pointerMove(zoneEl, { clientX: 15, clientY: 120 });
    expect(zoneEl).toHaveAttribute('data-rejected', 'true');
    expect(screen.getByText('Dragging: Diagram PNG')).toBeInTheDocument();

    fireEvent.pointerUp(zoneEl, { clientX: 15, clientY: 120 });
    expect(onDragEnd).toHaveBeenLastCalledWith(
      expect.objectContaining({
        active: expect.objectContaining({ id: 'img-1' }),
        over: null,
      })
    );

    // Drag compatible pdf over pdf-zone -> accepted
    fireEvent.pointerDown(docEl, { button: 0, clientX: 15, clientY: 15 });
    fireEvent.pointerMove(zoneEl, { clientX: 15, clientY: 120 });
    expect(zoneEl).toHaveAttribute('data-over', 'true');

    fireEvent.pointerUp(zoneEl, { clientX: 15, clientY: 120 });
    expect(onDragEnd).toHaveBeenLastCalledWith(
      expect.objectContaining({
        active: expect.objectContaining({ id: 'doc-1' }),
        over: expect.objectContaining({ id: 'pdf-zone', accepts: true }),
      })
    );
  });

  it('moves items between multiple SortableList containers in a Kanban setup', () => {
    if (typeof window.PointerEvent === 'undefined') {
      (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = MouseEvent;
    }

    function KanbanHarness() {
      const [columns, setColumns] = useState<Record<string, string[]>>({
        backlog: ['ticket-1', 'ticket-2'],
        review: [],
      });

      const handleDragEnd = ({ active, over }: DragEndEvent) => {
        if (!over || !active.containerId || !over.containerId || active.index === undefined) return;
        if (active.containerId !== over.containerId && over.index !== undefined) {
          setColumns((prev) =>
            moveBetweenContainers(
              prev,
              active.containerId as string,
              over.containerId as string,
              active.index as number,
              over.index as number
            )
          );
        }
      };

      return (
        <DragAndDrop onDragEnd={handleDragEnd}>
          <SortableList id="backlog" label="Backlog" items={columns.backlog}>
            {columns.backlog.map((id) => (
              <SortableItem key={id} id={id} label={id}>
                {id}
              </SortableItem>
            ))}
          </SortableList>
          <SortableList
            id="review"
            label="In Review"
            items={columns.review}
            emptyState="Drop tickets for review"
          >
            {columns.review.map((id) => (
              <SortableItem key={id} id={id} label={id}>
                {id}
              </SortableItem>
            ))}
          </SortableList>
        </DragAndDrop>
      );
    }

    render(<KanbanHarness />);

    const ticket1 = screen.getByText('ticket-1').closest('li') as HTMLElement;
    const reviewList = screen.getByRole('list', { name: 'In Review' });

    fireEvent.pointerDown(ticket1, { button: 0, clientX: 20, clientY: 20 });
    fireEvent.pointerMove(reviewList, { clientX: 280, clientY: 40 });
    fireEvent.pointerUp(reviewList, { clientX: 280, clientY: 40 });

    expect(reviewList).toHaveTextContent('ticket-1');
    expect(screen.getByRole('list', { name: 'Backlog' })).not.toHaveTextContent('ticket-1');
  });
});
