import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import styles from './DragAndDrop.module.css';

export type DragData = Record<string, unknown>;
export type DragSource = 'pointer' | 'keyboard';
export type DragAndDropSize = 'sm' | 'md' | 'lg';
export type DraggableVariant = 'surface' | 'outline' | 'soft' | 'ghost';
export type DroppableVariant = 'dashed' | 'surface' | 'soft';
export type SortableVariant = 'surface' | 'outline' | 'soft';
export type SortableOrientation = 'vertical' | 'horizontal' | 'grid';
export type SortableEntry = string | { id: string };

export interface ActiveDragItem {
  id: string;
  type?: string;
  containerId?: string;
  index?: number;
  label: string;
  data?: DragData;
}

export interface DropTarget {
  id: string;
  kind: 'droppable' | 'item';
  containerId?: string;
  index?: number;
  position?: 'before' | 'after' | 'inside';
  accepts: boolean;
  label?: string;
  data?: DragData;
}

export interface DragStartEvent {
  active: ActiveDragItem;
  source: DragSource;
}

export interface DragMoveEvent {
  active: ActiveDragItem;
  over: DropTarget | null;
  delta: { x: number; y: number };
}

export interface DragOverEvent {
  active: ActiveDragItem;
  over: DropTarget | null;
}

export interface DragEndEvent {
  active: ActiveDragItem;
  over: DropTarget | null;
  delta: { x: number; y: number };
  source: DragSource;
}

export interface DragCancelEvent {
  active: ActiveDragItem;
  source: DragSource;
}

export interface DndAnnouncements {
  onDragStart: (active: ActiveDragItem) => string;
  onDragOver: (active: ActiveDragItem, over: DropTarget | null) => string;
  onDragEnd: (active: ActiveDragItem, over: DropTarget | null) => string;
  onDragCancel: (active: ActiveDragItem) => string;
}

export function arrayMove<T>(array: readonly T[], fromIndex: number, toIndex: number): T[] {
  if (
    array.length <= 1 ||
    fromIndex === toIndex ||
    fromIndex < 0 ||
    fromIndex >= array.length
  ) {
    return array.slice();
  }
  const clampedTo = Math.max(0, Math.min(array.length - 1, toIndex));
  if (fromIndex === clampedTo) return array.slice();
  const next = array.slice();
  const [moved] = next.splice(fromIndex, 1);
  next.splice(clampedTo, 0, moved);
  return next;
}

export function moveBetweenContainers<T extends SortableEntry>(
  containers: Record<string, T[]>,
  activeContainerId: string,
  overContainerId: string,
  activeIndex: number,
  overIndex: number
): Record<string, T[]> {
  const source = containers[activeContainerId];
  const destination = containers[overContainerId];
  if (!source || !destination) return containers;
  if (activeIndex < 0 || activeIndex >= source.length) return containers;

  if (activeContainerId === overContainerId) {
    return {
      ...containers,
      [activeContainerId]: arrayMove(source, activeIndex, overIndex),
    };
  }

  const nextSource = source.slice();
  const [moved] = nextSource.splice(activeIndex, 1);
  const nextDestination = destination.slice();
  const clampedTarget = Math.max(0, Math.min(nextDestination.length, overIndex));
  nextDestination.splice(clampedTarget, 0, moved);

  return {
    ...containers,
    [activeContainerId]: nextSource,
    [overContainerId]: nextDestination,
  };
}

function getEntryId(entry: SortableEntry): string {
  return typeof entry === 'string' ? entry : entry.id;
}

function acceptsType(accept: string | string[] | undefined, type: string | undefined): boolean {
  if (!accept) return true;
  const list = Array.isArray(accept) ? accept : [accept];
  if (list.length === 0) return true;
  return Boolean(type && list.includes(type));
}

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as React.MutableRefObject<T>).current = value;
}

function isInteractiveDescendant(target: EventTarget | null, currentTarget: HTMLElement): boolean {
  if (!(target instanceof HTMLElement) || target === currentTarget) return false;
  let node: HTMLElement | null = target;
  while (node && node !== currentTarget) {
    const tag = node.tagName;
    if (
      tag === 'BUTTON' ||
      tag === 'A' ||
      tag === 'INPUT' ||
      tag === 'SELECT' ||
      tag === 'TEXTAREA' ||
      node.isContentEditable ||
      node.getAttribute('role') === 'button'
    ) {
      return true;
    }
    node = node.parentElement;
  }
  return false;
}

function isSameDropTarget(a: DropTarget | null, b: DropTarget | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.id === b.id &&
    a.kind === b.kind &&
    a.containerId === b.containerId &&
    a.index === b.index &&
    a.position === b.position &&
    a.accepts === b.accepts
  );
}

function sortByDomOrder<T extends { element: HTMLElement | null }>(records: T[]): T[] {
  return records.slice().sort((a, b) => {
    if (!a.element || !b.element || a.element === b.element) return 0;
    const pos = a.element.compareDocumentPosition(b.element);
    if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
    if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1;
    return 0;
  });
}

const defaultAnnouncements: DndAnnouncements = {
  onDragStart: (active) =>
    `Picked up ${active.label}. Use arrow keys to move, Space or Enter to drop, Escape to cancel.`,
  onDragOver: (active, over) => {
    if (!over) return `${active.label} is not over a drop zone.`;
    if (!over.accepts) return `${over.label ?? over.id} does not accept ${active.label}.`;
    if (over.index !== undefined) {
      return `${active.label} over ${over.label ?? over.containerId ?? over.id}, position ${over.index + 1}.`;
    }
    return `${active.label} over ${over.label ?? over.id}.`;
  },
  onDragEnd: (active, over) => {
    if (!over || !over.accepts) return `${active.label} returned to starting position.`;
    if (over.index !== undefined) {
      return `Dropped ${active.label} at position ${over.index + 1}.`;
    }
    return `Dropped ${active.label} on ${over.label ?? over.id}.`;
  },
  onDragCancel: (active) => `Drag cancelled. ${active.label} returned to starting position.`,
};

const GripDotsIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <circle cx="5.5" cy="3.5" r="1.25" />
    <circle cx="10.5" cy="3.5" r="1.25" />
    <circle cx="5.5" cy="8" r="1.25" />
    <circle cx="10.5" cy="8" r="1.25" />
    <circle cx="5.5" cy="12.5" r="1.25" />
    <circle cx="10.5" cy="12.5" r="1.25" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M8 12.5V3.5" />
    <path d="m4.5 7 3.5-3.5L11.5 7" />
  </svg>
);

const ArrowDownIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M8 3.5v9" />
    <path d="m4.5 9 3.5 3.5L11.5 9" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12.5 8h-9" />
    <path d="M7 4.5 3.5 8 7 11.5" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3.5 8h9" />
    <path d="M9 4.5 12.5 8 9 11.5" />
  </svg>
);

interface DroppableRecord {
  id: string;
  element: HTMLElement | null;
  accept?: string | string[];
  disabled: boolean;
  label: string;
  data?: DragData;
}

interface SortableContainerRecord {
  id: string;
  element: HTMLElement | null;
  orientation: SortableOrientation;
  columns: number;
  itemIds: string[];
  accept?: string | string[];
  disabled: boolean;
  label: string;
  onCommitReorder: (activeId: string, fromIndex: number, toIndex: number) => void;
}

interface SortableItemRecord {
  id: string;
  containerId: string;
  index: number;
  element: HTMLElement | null;
  triggerElement: HTMLElement | null;
  disabled: boolean;
  label: string;
  type: string;
  data?: DragData;
}

export interface DragAndDropContextValue {
  active: ActiveDragItem | null;
  over: DropTarget | null;
  isDragging: boolean;
  dragSource: DragSource | null;
  cancelDrag: () => void;
}

interface DndInternalContextValue extends DragAndDropContextValue {
  disabled: boolean;
  instructionsId: string;
  pointerCoordsRef: React.MutableRefObject<{ x: number; y: number }>;
  setOverlayNode: (el: HTMLDivElement | null) => void;
  registerCustomOverlay: () => () => void;
  registerDroppable: (record: DroppableRecord) => () => void;
  registerSortableContainer: (record: SortableContainerRecord) => () => void;
  registerSortableItem: (record: SortableItemRecord) => () => void;
  startPointerSession: (
    e: React.PointerEvent<HTMLElement>,
    item: ActiveDragItem,
    isHandle: boolean
  ) => void;
  handleDragTriggerKeyDown: (
    e: React.KeyboardEvent<HTMLElement>,
    item: ActiveDragItem,
    isHandle: boolean
  ) => void;
  onTriggerClickCapture: (e: React.MouseEvent<HTMLElement>) => void;
  announce: (message: string) => void;
}

interface DragTriggerBindingContextValue {
  item: ActiveDragItem;
  disabled: boolean;
  setTriggerElement?: (el: HTMLElement | null) => void;
}

const DragAndDropPublicContext = createContext<DragAndDropContextValue | null>(null);
const DndInternalContext = createContext<DndInternalContextValue | null>(null);
const DragTriggerBindingContext = createContext<DragTriggerBindingContextValue | null>(null);

export function useDragAndDrop(): DragAndDropContextValue {
  const ctx = useContext(DragAndDropPublicContext);
  if (!ctx) {
    throw new Error('useDragAndDrop must be used within a <DragAndDrop /> component.');
  }
  return ctx;
}

function useDndInternal(): DndInternalContextValue {
  const ctx = useContext(DndInternalContext);
  if (!ctx) {
    throw new Error('DragAndDrop primitives must be rendered within <DragAndDrop />.');
  }
  return ctx;
}

export interface DragAndDropProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDragStart' | 'onDragOver' | 'onDragEnd'> {
  onDragStart?: (event: DragStartEvent) => void;
  onDragMove?: (event: DragMoveEvent) => void;
  onDragOver?: (event: DragOverEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  onDragCancel?: (event: DragCancelEvent) => void;
  dragThreshold?: number;
  disabled?: boolean;
  showDragOverlay?: boolean;
  overlay?: React.ReactNode | ((active: ActiveDragItem) => React.ReactNode);
  announcements?: Partial<DndAnnouncements>;
}

export const DragAndDrop = forwardRef<HTMLDivElement, DragAndDropProps>(function DragAndDrop(
  {
    onDragStart,
    onDragMove,
    onDragOver,
    onDragEnd,
    onDragCancel,
    dragThreshold = 5,
    disabled = false,
    showDragOverlay = true,
    overlay,
    announcements,
    className,
    children,
    ...props
  },
  ref
) {
  const instructionsId = useId();
  const [active, setActive] = useState<ActiveDragItem | null>(null);
  const [over, setOver] = useState<DropTarget | null>(null);
  const [dragSource, setDragSource] = useState<DragSource | null>(null);
  const [liveMessage, setLiveMessage] = useState('');
  const [customOverlayCount, setCustomOverlayCount] = useState(0);

  const activeRef = useRef<ActiveDragItem | null>(null);
  activeRef.current = active;
  const overRef = useRef<DropTarget | null>(null);
  overRef.current = over;
  const dragSourceRef = useRef<DragSource | null>(null);
  dragSourceRef.current = dragSource;

  const droppablesRef = useRef<Map<string, DroppableRecord>>(new Map());
  const containersRef = useRef<Map<string, SortableContainerRecord>>(new Map());
  const itemsRef = useRef<Map<string, SortableItemRecord>>(new Map());

  const pointerCoordsRef = useRef({ x: 0, y: 0 });
  const overlayElRef = useRef<HTMLDivElement | null>(null);
  const suppressClickRef = useRef(false);
  const cleanupListenersRef = useRef<(() => void) | null>(null);

  const callbacksRef = useRef({
    onDragStart,
    onDragMove,
    onDragOver,
    onDragEnd,
    onDragCancel,
    announcements: { ...defaultAnnouncements, ...announcements },
  });
  callbacksRef.current = {
    onDragStart,
    onDragMove,
    onDragOver,
    onDragEnd,
    onDragCancel,
    announcements: { ...defaultAnnouncements, ...announcements },
  };

  const announce = useCallback((message: string) => {
    setLiveMessage('');
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(() => setLiveMessage(message));
    } else {
      setLiveMessage(message);
    }
  }, []);

  const setOverlayNode = useCallback((el: HTMLDivElement | null) => {
    overlayElRef.current = el;
    if (el) {
      const { x, y } = pointerCoordsRef.current;
      el.style.transform = `translate3d(${Math.round(x + 12)}px, ${Math.round(y + 12)}px, 0)`;
    }
  }, []);

  const registerCustomOverlay = useCallback(() => {
    setCustomOverlayCount((c) => c + 1);
    return () => setCustomOverlayCount((c) => Math.max(0, c - 1));
  }, []);

  const registerDroppable = useCallback((record: DroppableRecord) => {
    droppablesRef.current.set(record.id, record);
    return () => {
      droppablesRef.current.delete(record.id);
    };
  }, []);

  const registerSortableContainer = useCallback((record: SortableContainerRecord) => {
    containersRef.current.set(record.id, record);
    return () => {
      containersRef.current.delete(record.id);
    };
  }, []);

  const registerSortableItem = useCallback((record: SortableItemRecord) => {
    itemsRef.current.set(record.id, record);
    return () => {
      itemsRef.current.delete(record.id);
    };
  }, []);

  const buildSortableItemTarget = useCallback(
    (
      item: SortableItemRecord,
      activeItem: ActiveDragItem,
      clientX: number,
      clientY: number,
      rect?: DOMRect
    ): DropTarget => {
      const container = containersRef.current.get(item.containerId);
      const accepts = container ? acceptsType(container.accept, activeItem.type) : true;
      const sameContainer =
        activeItem.containerId !== undefined &&
        activeItem.containerId === item.containerId &&
        activeItem.index !== undefined;

      if (sameContainer) {
        if (item.id === activeItem.id || activeItem.index === item.index) {
          return {
            id: item.id,
            kind: 'item',
            containerId: item.containerId,
            index: item.index,
            position: undefined,
            accepts,
            label: item.label,
            data: item.data,
          };
        }
        const fromIdx = activeItem.index as number;
        const position: 'before' | 'after' = fromIdx < item.index ? 'after' : 'before';
        return {
          id: item.id,
          kind: 'item',
          containerId: item.containerId,
          index: item.index,
          position,
          accepts,
          label: item.label,
          data: item.data,
        };
      }

      const orientation = container?.orientation ?? 'vertical';
      let position: 'before' | 'after' = 'after';
      if (rect && (rect.width > 0 || rect.height > 0)) {
        const useHorizontal = orientation === 'horizontal' || orientation === 'grid';
        const mid = useHorizontal ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
        const coord = useHorizontal ? clientX : clientY;
        position = coord < mid ? 'before' : 'after';
      } else {
        position = 'before';
      }

      return {
        id: item.id,
        kind: 'item',
        containerId: item.containerId,
        index: position === 'after' ? item.index + 1 : item.index,
        position,
        accepts,
        label: item.label,
        data: item.data,
      };
    },
    []
  );

  const resolveDropTarget = useCallback(
    (
      clientX: number,
      clientY: number,
      eventTarget: EventTarget | null,
      activeItem: ActiveDragItem
    ): DropTarget | null => {
      let hasGeometry = false;

      for (const item of itemsRef.current.values()) {
        if (item.disabled || !item.element) continue;
        const container = containersRef.current.get(item.containerId);
        if (container?.disabled) continue;
        const rect = item.element.getBoundingClientRect();
        if (rect.width > 0 || rect.height > 0) {
          hasGeometry = true;
          if (
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom
          ) {
            return buildSortableItemTarget(item, activeItem, clientX, clientY, rect);
          }
        }
      }

      for (const container of containersRef.current.values()) {
        if (container.disabled || !container.element) continue;
        const rect = container.element.getBoundingClientRect();
        if (rect.width > 0 || rect.height > 0) {
          hasGeometry = true;
          if (
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom
          ) {
            const accepts = acceptsType(container.accept, activeItem.type);
            if (container.itemIds.length === 0) {
              return {
                id: container.id,
                kind: 'droppable',
                containerId: container.id,
                index: 0,
                position: 'inside',
                accepts,
                label: container.label,
              };
            }

            let closestItem: SortableItemRecord | null = null;
            let closestRect: DOMRect | undefined;
            let minDist = Infinity;
            for (const itemId of container.itemIds) {
              const rec = itemsRef.current.get(itemId);
              if (!rec || rec.disabled || !rec.element) continue;
              const r = rec.element.getBoundingClientRect();
              const cx = r.left + r.width / 2;
              const cy = r.top + r.height / 2;
              const dist = Math.hypot(clientX - cx, clientY - cy);
              if (dist < minDist) {
                minDist = dist;
                closestItem = rec;
                closestRect = r;
              }
            }

            if (closestItem) {
              return buildSortableItemTarget(
                closestItem,
                activeItem,
                clientX,
                clientY,
                closestRect
              );
            }
          }
        }
      }

      for (const drop of droppablesRef.current.values()) {
        if (drop.disabled || !drop.element) continue;
        const rect = drop.element.getBoundingClientRect();
        if (rect.width > 0 || rect.height > 0) {
          hasGeometry = true;
          if (
            clientX >= rect.left &&
            clientX <= rect.right &&
            clientY >= rect.top &&
            clientY <= rect.bottom
          ) {
            return {
              id: drop.id,
              kind: 'droppable',
              containerId: drop.id,
              position: 'inside',
              accepts: acceptsType(drop.accept, activeItem.type),
              label: drop.label,
              data: drop.data,
            };
          }
        }
      }

      if (hasGeometry) return null;

      let candidateEl: Element | null = null;
      if (typeof document !== 'undefined' && typeof document.elementFromPoint === 'function') {
        const fromPoint = document.elementFromPoint(clientX, clientY);
        if (fromPoint && !fromPoint.closest('[data-eta-dnd-overlay="true"]')) {
          candidateEl = fromPoint;
        }
      }
      if (!candidateEl && eventTarget instanceof Element) {
        candidateEl = eventTarget;
      }
      if (!candidateEl) return null;

      const itemEl = candidateEl.closest('[data-eta-sortable-item-id]');
      if (itemEl) {
        const itemId = itemEl.getAttribute('data-eta-sortable-item-id');
        const rec = itemId ? itemsRef.current.get(itemId) : undefined;
        if (rec && !rec.disabled) {
          const container = containersRef.current.get(rec.containerId);
          if (!container?.disabled) {
            return buildSortableItemTarget(rec, activeItem, clientX, clientY);
          }
        }
      }

      const listEl = candidateEl.closest('[data-eta-sortable-list-id]');
      if (listEl) {
        const listId = listEl.getAttribute('data-eta-sortable-list-id');
        const container = listId ? containersRef.current.get(listId) : undefined;
        if (container && !container.disabled) {
          return {
            id: container.id,
            kind: 'droppable',
            containerId: container.id,
            index: container.itemIds.length,
            position: 'inside',
            accepts: acceptsType(container.accept, activeItem.type),
            label: container.label,
          };
        }
      }

      const dropEl = candidateEl.closest('[data-eta-droppable-id]');
      if (dropEl) {
        const dropId = dropEl.getAttribute('data-eta-droppable-id');
        const drop = dropId ? droppablesRef.current.get(dropId) : undefined;
        if (drop && !drop.disabled) {
          return {
            id: drop.id,
            kind: 'droppable',
            containerId: drop.id,
            position: 'inside',
            accepts: acceptsType(drop.accept, activeItem.type),
            label: drop.label,
            data: drop.data,
          };
        }
      }

      return null;
    },
    [buildSortableItemTarget]
  );

  const resetSessionState = useCallback(() => {
    cleanupListenersRef.current?.();
    cleanupListenersRef.current = null;
    activeRef.current = null;
    overRef.current = null;
    dragSourceRef.current = null;
    setActive(null);
    setOver(null);
    setDragSource(null);
  }, []);

  const cancelDrag = useCallback(() => {
    const curActive = activeRef.current;
    const curSource = dragSourceRef.current;
    resetSessionState();
    if (curActive && curSource) {
      callbacksRef.current.onDragCancel?.({ active: curActive, source: curSource });
      announce(callbacksRef.current.announcements.onDragCancel(curActive));
    }
  }, [announce, resetSessionState]);

  useEffect(() => {
    return () => {
      cleanupListenersRef.current?.();
    };
  }, []);

  const startPointerSession = useCallback(
    (e: React.PointerEvent<HTMLElement>, item: ActiveDragItem, isHandle: boolean) => {
      if (disabled) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (!isHandle && isInteractiveDescendant(e.target, e.currentTarget)) return;
      if (activeRef.current) return;

      const pointerId = e.pointerId ?? 0;
      const startX = Number.isFinite(e.clientX) ? e.clientX : 0;
      const startY = Number.isFinite(e.clientY) ? e.clientY : 0;
      pointerCoordsRef.current = { x: startX, y: startY };

      let started = false;
      const threshold = Math.max(0, dragThreshold);

      const updateOver = (nextOver: DropTarget | null) => {
        if (!isSameDropTarget(overRef.current, nextOver)) {
          overRef.current = nextOver;
          setOver(nextOver);
          callbacksRef.current.onDragOver?.({ active: item, over: nextOver });
        }
      };

      const handleMove = (ev: PointerEvent) => {
        if ((ev.pointerId ?? 0) !== pointerId) return;
        const cx = Number.isFinite(ev.clientX) ? ev.clientX : startX;
        const cy = Number.isFinite(ev.clientY) ? ev.clientY : startY;
        const dx = cx - startX;
        const dy = cy - startY;

        if (!started) {
          if (Math.hypot(dx, dy) < threshold) return;
          started = true;
          suppressClickRef.current = true;
          activeRef.current = item;
          dragSourceRef.current = 'pointer';
          setActive(item);
          setDragSource('pointer');
          callbacksRef.current.onDragStart?.({ active: item, source: 'pointer' });
          announce(callbacksRef.current.announcements.onDragStart(item));
        }

        pointerCoordsRef.current = { x: cx, y: cy };
        if (overlayElRef.current) {
          overlayElRef.current.style.transform = `translate3d(${Math.round(cx + 12)}px, ${Math.round(cy + 12)}px, 0)`;
        }

        const nextOver = resolveDropTarget(cx, cy, ev.target, item);
        updateOver(nextOver);
        callbacksRef.current.onDragMove?.({
          active: item,
          over: nextOver,
          delta: { x: dx, y: dy },
        });
      };

      const finishPointer = (ev: PointerEvent, cancelled: boolean) => {
        if ((ev.pointerId ?? 0) !== pointerId) return;
        cleanupListenersRef.current?.();
        cleanupListenersRef.current = null;

        if (!started) return;

        const cx = Number.isFinite(ev.clientX) ? ev.clientX : pointerCoordsRef.current.x;
        const cy = Number.isFinite(ev.clientY) ? ev.clientY : pointerCoordsRef.current.y;
        const delta = { x: cx - startX, y: cy - startY };

        if (cancelled) {
          resetSessionState();
          callbacksRef.current.onDragCancel?.({ active: item, source: 'pointer' });
          announce(callbacksRef.current.announcements.onDragCancel(item));
        } else {
          const detectedOnUp =
            ev.target instanceof Element
              ? resolveDropTarget(cx, cy, ev.target, item)
              : null;
          const candidateOver = detectedOnUp ?? overRef.current;
          const validOver = candidateOver && candidateOver.accepts ? candidateOver : null;

          if (
            validOver &&
            item.containerId !== undefined &&
            validOver.containerId === item.containerId &&
            item.index !== undefined &&
            validOver.index !== undefined &&
            validOver.index !== item.index
          ) {
            const container = containersRef.current.get(item.containerId);
            container?.onCommitReorder(item.id, item.index, validOver.index);
          }

          resetSessionState();
          callbacksRef.current.onDragEnd?.({
            active: item,
            over: validOver,
            delta,
            source: 'pointer',
          });
          announce(callbacksRef.current.announcements.onDragEnd(item, validOver));
        }

        setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      };

      const handleUp = (ev: PointerEvent) => finishPointer(ev, false);
      const handleCancel = (ev: PointerEvent) => finishPointer(ev, true);
      const handleKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === 'Escape' && started) {
          ev.preventDefault();
          resetSessionState();
          callbacksRef.current.onDragCancel?.({ active: item, source: 'pointer' });
          announce(callbacksRef.current.announcements.onDragCancel(item));
          setTimeout(() => {
            suppressClickRef.current = false;
          }, 0);
        }
      };

      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
      window.addEventListener('pointercancel', handleCancel);
      window.addEventListener('keydown', handleKeyDown);

      cleanupListenersRef.current = () => {
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
        window.removeEventListener('pointercancel', handleCancel);
        window.removeEventListener('keydown', handleKeyDown);
      };
    },
    [announce, disabled, dragThreshold, resetSessionState, resolveDropTarget]
  );

  const handleDragTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>, item: ActiveDragItem, isHandle: boolean) => {
      if (disabled) return;
      if (!isHandle && e.target !== e.currentTarget) return;

      const isCurrentlyActive =
        dragSourceRef.current === 'keyboard' && activeRef.current?.id === item.id;

      if (!isCurrentlyActive) {
        if (e.key !== ' ' && e.key !== 'Enter') return;
        e.preventDefault();
        e.stopPropagation();

        let initialOver: DropTarget | null = null;
        if (item.containerId !== undefined && item.index !== undefined) {
          initialOver = {
            id: item.id,
            kind: 'item',
            containerId: item.containerId,
            index: item.index,
            position: undefined,
            accepts: true,
            label: item.label,
          };
        } else {
          for (const drop of droppablesRef.current.values()) {
            if (!drop.disabled && acceptsType(drop.accept, item.type)) {
              initialOver = {
                id: drop.id,
                kind: 'droppable',
                containerId: drop.id,
                position: 'inside',
                accepts: true,
                label: drop.label,
                data: drop.data,
              };
              break;
            }
          }
        }

        activeRef.current = item;
        overRef.current = initialOver;
        dragSourceRef.current = 'keyboard';
        setActive(item);
        setOver(initialOver);
        setDragSource('keyboard');
        callbacksRef.current.onDragStart?.({ active: item, source: 'keyboard' });
        if (initialOver) {
          callbacksRef.current.onDragOver?.({ active: item, over: initialOver });
        }
        announce(callbacksRef.current.announcements.onDragStart(item));
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        cancelDrag();
        return;
      }

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        const currentOver = overRef.current;
        const validOver = currentOver && currentOver.accepts ? currentOver : null;
        const movedItemId = item.id;

        if (
          validOver &&
          item.containerId !== undefined &&
          validOver.containerId === item.containerId &&
          item.index !== undefined &&
          validOver.index !== undefined &&
          validOver.index !== item.index
        ) {
          const container = containersRef.current.get(item.containerId);
          container?.onCommitReorder(item.id, item.index, validOver.index);
        }

        resetSessionState();
        callbacksRef.current.onDragEnd?.({
          active: item,
          over: validOver,
          delta: { x: 0, y: 0 },
          source: 'keyboard',
        });
        announce(callbacksRef.current.announcements.onDragEnd(item, validOver));

        if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
          window.requestAnimationFrame(() => {
            const movedRec = itemsRef.current.get(movedItemId);
            const focusEl = movedRec?.triggerElement ?? movedRec?.element;
            focusEl?.focus();
          });
        }
        return;
      }

      const moveKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
      if (!moveKeys.includes(e.key)) return;

      e.preventDefault();
      e.stopPropagation();

      if (item.containerId !== undefined && item.index !== undefined) {
        const curContainerId = overRef.current?.containerId ?? item.containerId;
        const container = containersRef.current.get(curContainerId);
        if (!container) return;

        const compatibleContainers = sortByDomOrder(
          Array.from(containersRef.current.values()).filter(
            (c) => !c.disabled && acceptsType(c.accept, item.type)
          )
        );
        const curContainerIdx = compatibleContainers.findIndex((c) => c.id === curContainerId);

        const isVertical = container.orientation === 'vertical';
        const isHorizontal = container.orientation === 'horizontal';
        const isGrid = container.orientation === 'grid';

        const switchContainerDelta =
          isVertical && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
            ? e.key === 'ArrowRight'
              ? 1
              : -1
            : isHorizontal && (e.key === 'ArrowUp' || e.key === 'ArrowDown')
              ? e.key === 'ArrowDown'
                ? 1
                : -1
              : 0;

        if (switchContainerDelta !== 0 && compatibleContainers.length > 1 && curContainerIdx !== -1) {
          const nextContainer = compatibleContainers[curContainerIdx + switchContainerDelta];
          if (nextContainer) {
            const curIdx = overRef.current?.index ?? 0;
            const maxSlot =
              nextContainer.id === item.containerId
                ? Math.max(0, nextContainer.itemIds.length - 1)
                : nextContainer.itemIds.length;
            const clampedIdx = Math.max(0, Math.min(maxSlot, curIdx));
            const targetItemId = nextContainer.itemIds[clampedIdx];
            const targetRec = targetItemId ? itemsRef.current.get(targetItemId) : undefined;
            const nextOver: DropTarget = targetRec
              ? {
                  id: targetRec.id,
                  kind: 'item',
                  containerId: nextContainer.id,
                  index: clampedIdx,
                  position:
                    nextContainer.id === item.containerId
                      ? clampedIdx > item.index
                        ? 'after'
                        : clampedIdx < item.index
                          ? 'before'
                          : undefined
                      : 'before',
                  accepts: true,
                  label: nextContainer.label,
                  data: targetRec.data,
                }
              : {
                  id: nextContainer.id,
                  kind: 'droppable',
                  containerId: nextContainer.id,
                  index: clampedIdx,
                  position: 'inside',
                  accepts: true,
                  label: nextContainer.label,
                };
            overRef.current = nextOver;
            setOver(nextOver);
            callbacksRef.current.onDragOver?.({ active: item, over: nextOver });
            announce(callbacksRef.current.announcements.onDragOver(item, nextOver));
            return;
          }
        }

        const sameContainer = curContainerId === item.containerId;
        const maxIndex = sameContainer
          ? Math.max(0, container.itemIds.length - 1)
          : container.itemIds.length;
        const curIndex = overRef.current?.index ?? item.index;
        let nextIndex = curIndex;

        if (e.key === 'Home') {
          nextIndex = 0;
        } else if (e.key === 'End') {
          nextIndex = maxIndex;
        } else if (isGrid) {
          const cols = Math.max(1, container.columns);
          if (e.key === 'ArrowLeft') nextIndex = curIndex - 1;
          else if (e.key === 'ArrowRight') nextIndex = curIndex + 1;
          else if (e.key === 'ArrowUp') nextIndex = curIndex - cols;
          else if (e.key === 'ArrowDown') nextIndex = curIndex + cols;
        } else if (isHorizontal) {
          if (e.key === 'ArrowLeft') nextIndex = curIndex - 1;
          else if (e.key === 'ArrowRight') nextIndex = curIndex + 1;
        } else {
          if (e.key === 'ArrowUp') nextIndex = curIndex - 1;
          else if (e.key === 'ArrowDown') nextIndex = curIndex + 1;
        }

        nextIndex = Math.max(0, Math.min(maxIndex, nextIndex));
        if (nextIndex === curIndex) return;

        const targetItemId = container.itemIds[Math.min(nextIndex, container.itemIds.length - 1)];
        const targetRec = targetItemId ? itemsRef.current.get(targetItemId) : undefined;
        const position: 'before' | 'after' | 'inside' | undefined = !targetRec
          ? 'inside'
          : sameContainer
            ? nextIndex > item.index
              ? 'after'
              : nextIndex < item.index
                ? 'before'
                : undefined
            : nextIndex >= container.itemIds.length
              ? 'after'
              : 'before';

        const nextOver: DropTarget = targetRec
          ? {
              id: targetRec.id,
              kind: 'item',
              containerId: curContainerId,
              index: nextIndex,
              position,
              accepts: true,
              label: container.label,
              data: targetRec.data,
            }
          : {
              id: curContainerId,
              kind: 'droppable',
              containerId: curContainerId,
              index: nextIndex,
              position: 'inside',
              accepts: true,
              label: container.label,
            };

        overRef.current = nextOver;
        setOver(nextOver);
        callbacksRef.current.onDragOver?.({ active: item, over: nextOver });
        announce(callbacksRef.current.announcements.onDragOver(item, nextOver));
        return;
      }

      const compatibleDroppables = sortByDomOrder(
        Array.from(droppablesRef.current.values()).filter(
          (d) => !d.disabled && acceptsType(d.accept, item.type)
        )
      );
      if (compatibleDroppables.length === 0) return;

      const curIdx = compatibleDroppables.findIndex((d) => d.id === overRef.current?.id);
      let nextIdx = curIdx === -1 ? 0 : curIdx;
      if (e.key === 'Home') nextIdx = 0;
      else if (e.key === 'End') nextIdx = compatibleDroppables.length - 1;
      else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        nextIdx = (nextIdx + 1) % compatibleDroppables.length;
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        nextIdx = (nextIdx - 1 + compatibleDroppables.length) % compatibleDroppables.length;
      }

      const targetDrop = compatibleDroppables[nextIdx];
      if (!targetDrop) return;
      const nextOver: DropTarget = {
        id: targetDrop.id,
        kind: 'droppable',
        containerId: targetDrop.id,
        position: 'inside',
        accepts: true,
        label: targetDrop.label,
        data: targetDrop.data,
      };
      overRef.current = nextOver;
      setOver(nextOver);
      callbacksRef.current.onDragOver?.({ active: item, over: nextOver });
      announce(callbacksRef.current.announcements.onDragOver(item, nextOver));
    },
    [announce, cancelDrag, disabled, resetSessionState]
  );

  const onTriggerClickCapture = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const isDragging = active !== null;

  const publicValue = useMemo<DragAndDropContextValue>(
    () => ({
      active,
      over,
      isDragging,
      dragSource,
      cancelDrag,
    }),
    [active, over, isDragging, dragSource, cancelDrag]
  );

  const internalValue = useMemo<DndInternalContextValue>(
    () => ({
      ...publicValue,
      disabled,
      instructionsId,
      pointerCoordsRef,
      setOverlayNode,
      registerCustomOverlay,
      registerDroppable,
      registerSortableContainer,
      registerSortableItem,
      startPointerSession,
      handleDragTriggerKeyDown,
      onTriggerClickCapture,
      announce,
    }),
    [
      publicValue,
      disabled,
      instructionsId,
      setOverlayNode,
      registerCustomOverlay,
      registerDroppable,
      registerSortableContainer,
      registerSortableItem,
      startPointerSession,
      handleDragTriggerKeyDown,
      onTriggerClickCapture,
      announce,
    ]
  );

  const shouldRenderBuiltInOverlay =
    showDragOverlay &&
    customOverlayCount === 0 &&
    active !== null &&
    dragSource === 'pointer' &&
    typeof document !== 'undefined';

  const renderedOverlayContent =
    active !== null
      ? typeof overlay === 'function'
        ? overlay(active)
        : overlay !== undefined
          ? overlay
          : (
              <div className={styles.defaultOverlayCard}>
                <span className={styles.defaultOverlayGrip} aria-hidden="true">
                  <GripDotsIcon />
                </span>
                <span>{active.label}</span>
              </div>
            )
      : null;

  return (
    <DragAndDropPublicContext.Provider value={publicValue}>
      <DndInternalContext.Provider value={internalValue}>
        <div ref={ref} className={cn(styles.root, className)} {...props}>
          {children}
          <div id={instructionsId} className={styles.srOnly}>
            Press Space or Enter to pick up item, arrow keys to move, Space or Enter to drop, or
            Escape to cancel.
          </div>
          <div aria-live="polite" aria-atomic="true" className={styles.srOnly}>
            {liveMessage}
          </div>
        </div>
        {shouldRenderBuiltInOverlay &&
          createPortal(
            <div ref={setOverlayNode} data-eta-dnd-overlay="true" className={styles.overlay}>
              {renderedOverlayContent}
            </div>,
            document.body
          )}
      </DndInternalContext.Provider>
    </DragAndDropPublicContext.Provider>
  );
});

DragAndDrop.displayName = 'DragAndDrop';

export const DndProvider = DragAndDrop;

export interface DragOverlayProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: React.ReactNode | ((active: ActiveDragItem) => React.ReactNode);
}

export const DragOverlay = forwardRef<HTMLDivElement, DragOverlayProps>(function DragOverlay(
  { className, children, ...props },
  ref
) {
  const ctx = useDndInternal();

  useEffect(() => {
    return ctx.registerCustomOverlay();
  }, [ctx]);

  if (!ctx.active || ctx.dragSource !== 'pointer' || typeof document === 'undefined') {
    return null;
  }

  const content = typeof children === 'function' ? children(ctx.active) : children;

  return createPortal(
    <div
      ref={(el) => {
        ctx.setOverlayNode(el);
        setRef(ref, el);
      }}
      data-eta-dnd-overlay="true"
      className={cn(styles.overlay, className)}
      {...props}
    >
      {content ?? (
        <div className={styles.defaultOverlayCard}>
          <span className={styles.defaultOverlayGrip} aria-hidden="true">
            <GripDotsIcon />
          </span>
          <span>{ctx.active.label}</span>
        </div>
      )}
    </div>,
    document.body
  );
});

DragOverlay.displayName = 'DragOverlay';

export interface DragHandleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export const DragHandle = forwardRef<HTMLButtonElement, DragHandleProps>(function DragHandle(
  { label, disabled: disabledProp, className, children, onPointerDown, onKeyDown, onClickCapture, ...props },
  ref
) {
  const dnd = useDndInternal();
  const binding = useContext(DragTriggerBindingContext);
  if (!binding) {
    throw new Error('DragHandle must be used within a <Draggable /> or <SortableItem />.');
  }

  const isDisabled = Boolean(disabledProp || binding.disabled || dnd.disabled);
  const isItemActive = dnd.active?.id === binding.item.id;
  const isKeyboardDragging = isItemActive && dnd.dragSource === 'keyboard';
  const ariaLabel = label ?? `Drag ${binding.item.label}`;

  return (
    <button
      ref={(el) => {
        binding.setTriggerElement?.(el);
        setRef(ref, el);
      }}
      type="button"
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-roledescription="drag handle"
      aria-pressed={isKeyboardDragging ? true : undefined}
      aria-describedby={dnd.instructionsId}
      className={cn(styles.handle, isItemActive && styles.handleDragging, className)}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        if (!e.defaultPrevented && !isDisabled) {
          dnd.startPointerSession(e, binding.item, true);
        }
      }}
      onKeyDown={(e) => {
        onKeyDown?.(e);
        if (!e.defaultPrevented && !isDisabled) {
          dnd.handleDragTriggerKeyDown(e, binding.item, true);
        }
      }}
      onClickCapture={(e) => {
        onClickCapture?.(e);
        dnd.onTriggerClickCapture(e);
      }}
      {...props}
    >
      {children ?? <GripDotsIcon />}
    </button>
  );
});

DragHandle.displayName = 'DragHandle';

export interface DraggableProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  type?: string;
  data?: DragData;
  label?: string;
  disabled?: boolean;
  handle?: boolean;
  variant?: DraggableVariant;
  size?: DragAndDropSize;
  unstyled?: boolean;
}

export const Draggable = forwardRef<HTMLDivElement, DraggableProps>(function Draggable(
  {
    id,
    type = 'draggable',
    data,
    label,
    disabled = false,
    handle = false,
    variant = 'surface',
    size = 'md',
    unstyled = false,
    className,
    children,
    onPointerDown,
    onKeyDown,
    onClickCapture,
    ...props
  },
  ref
) {
  const dnd = useDndInternal();
  const isDisabled = disabled || dnd.disabled;
  const resolvedLabel = label ?? (typeof children === 'string' ? children : id);

  const dragItem = useMemo<ActiveDragItem>(
    () => ({
      id,
      type,
      label: resolvedLabel,
      data,
    }),
    [id, type, resolvedLabel, data]
  );

  const isActive = dnd.active?.id === id;
  const isPointerDragging = isActive && dnd.dragSource === 'pointer';
  const isKeyboardDragging = isActive && dnd.dragSource === 'keyboard';

  const bindingValue = useMemo<DragTriggerBindingContextValue>(
    () => ({
      item: dragItem,
      disabled: isDisabled,
    }),
    [dragItem, isDisabled]
  );

  return (
    <DragTriggerBindingContext.Provider value={bindingValue}>
      <div
        ref={ref}
        data-eta-draggable-id={id}
        data-dragging={isActive ? 'true' : undefined}
        role={!handle ? 'button' : undefined}
        tabIndex={!handle ? (isDisabled ? -1 : 0) : undefined}
        aria-disabled={!handle && isDisabled ? 'true' : undefined}
        aria-roledescription={!handle ? 'draggable item' : undefined}
        aria-pressed={!handle && isKeyboardDragging ? true : undefined}
        aria-describedby={!handle ? dnd.instructionsId : undefined}
        className={cn(
          !unstyled && styles.draggable,
          !unstyled && styles[`variant-${variant}`],
          !unstyled && styles[`size-${size}`],
          !unstyled && !isDisabled && styles.interactiveSurface,
          !handle && !isDisabled && styles.grabTarget,
          !handle && styles.focusable,
          isPointerDragging && styles.isDragging,
          isKeyboardDragging && styles.isKeyboardDragging,
          isDisabled && styles.disabled,
          className
        )}
        onPointerDown={(e) => {
          onPointerDown?.(e);
          if (!handle && !e.defaultPrevented && !isDisabled) {
            dnd.startPointerSession(e, dragItem, false);
          }
        }}
        onKeyDown={(e) => {
          onKeyDown?.(e);
          if (!handle && !e.defaultPrevented && !isDisabled) {
            dnd.handleDragTriggerKeyDown(e, dragItem, false);
          }
        }}
        onClickCapture={(e) => {
          onClickCapture?.(e);
          if (!handle) {
            dnd.onTriggerClickCapture(e);
          }
        }}
        {...props}
      >
        {children}
      </div>
    </DragTriggerBindingContext.Provider>
  );
});

Draggable.displayName = 'Draggable';

export interface DroppableRenderState {
  isOver: boolean;
  canDrop: boolean;
  isRejected: boolean;
  active: ActiveDragItem | null;
}

export interface DroppableProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  id: string;
  accept?: string | string[];
  data?: DragData;
  label?: string;
  disabled?: boolean;
  variant?: DroppableVariant;
  size?: DragAndDropSize;
  emptyState?: React.ReactNode;
  unstyled?: boolean;
  children?: React.ReactNode | ((state: DroppableRenderState) => React.ReactNode);
}

export const Droppable = forwardRef<HTMLDivElement, DroppableProps>(function Droppable(
  {
    id,
    accept,
    data,
    label,
    disabled = false,
    variant = 'dashed',
    size = 'md',
    emptyState,
    unstyled = false,
    className,
    children,
    ...props
  },
  ref
) {
  const dnd = useDndInternal();
  const elementRef = useRef<HTMLDivElement | null>(null);
  const isDisabled = disabled || dnd.disabled;
  const resolvedLabel = label ?? id;

  useEffect(() => {
    return dnd.registerDroppable({
      id,
      element: elementRef.current,
      accept,
      disabled: isDisabled,
      label: resolvedLabel,
      data,
    });
  }, [dnd, id, accept, isDisabled, resolvedLabel, data]);

  const canDrop = Boolean(dnd.active && !isDisabled && acceptsType(accept, dnd.active.type));
  const isDirectlyOver = dnd.over?.id === id && dnd.over?.kind === 'droppable';
  const isRejected = Boolean(isDirectlyOver && dnd.active && !canDrop);
  const isOver = Boolean(isDirectlyOver && canDrop);

  const renderedChildren =
    typeof children === 'function'
      ? children({ isOver, canDrop, isRejected, active: dnd.active })
      : children;

  const hasChildren = React.Children.count(renderedChildren) > 0;

  return (
    <div
      ref={(el) => {
        elementRef.current = el;
        setRef(ref, el);
      }}
      role="group"
      data-eta-droppable-id={id}
      data-over={isOver ? 'true' : undefined}
      data-rejected={isRejected ? 'true' : undefined}
      data-can-drop={canDrop ? 'true' : undefined}
      aria-label={resolvedLabel}
      aria-disabled={isDisabled ? 'true' : undefined}
      className={cn(
        !unstyled && styles.droppable,
        !unstyled && styles[`droppable-${variant}`],
        !unstyled && styles[`droppable-${size}`],
        !unstyled && canDrop && !isOver && styles.droppableCanDrop,
        !unstyled && isOver && styles.droppableOver,
        !unstyled && isRejected && styles.droppableRejected,
        !unstyled && isDisabled && styles.droppableDisabled,
        className
      )}
      {...props}
    >
      {hasChildren
        ? renderedChildren
        : emptyState !== undefined && (
            <div className={styles.emptyState}>{emptyState}</div>
          )}
    </div>
  );
});

Droppable.displayName = 'Droppable';

interface SortableListContextValue {
  containerId: string;
  orientation: SortableOrientation;
  size: DragAndDropSize;
  variant: SortableVariant;
  type: string;
  disabled: boolean;
  showMoveButtons: boolean;
  itemIds: string[];
  moveItem: (fromIndex: number, toIndex: number) => void;
}

interface SortableItemContextValue {
  id: string;
  label: string;
  index: number;
  total: number;
  disabled: boolean;
  orientation: SortableOrientation;
  movePrevious: () => void;
  moveNext: () => void;
  canMovePrevious: boolean;
  canMoveNext: boolean;
}

const SortableListContext = createContext<SortableListContextValue | null>(null);
const SortableItemContext = createContext<SortableItemContextValue | null>(null);

export interface SortableItemRenderState {
  isDragging: boolean;
  isOver: boolean;
  index: number;
  total: number;
}

export interface SortableListProps<T extends SortableEntry = SortableEntry>
  extends Omit<React.HTMLAttributes<HTMLUListElement>, 'onChange'> {
  id?: string;
  items: readonly T[];
  onReorder?: (
    nextIds: string[],
    detail: { activeId: string; fromIndex: number; toIndex: number }
  ) => void;
  onItemsChange?: (
    nextItems: T[],
    detail: { activeId: string; fromIndex: number; toIndex: number }
  ) => void;
  orientation?: SortableOrientation;
  columns?: number;
  gap?: number | string;
  size?: DragAndDropSize;
  variant?: SortableVariant;
  type?: string;
  accept?: string | string[];
  disabled?: boolean;
  showMoveButtons?: boolean;
  isLoading?: boolean;
  loadingCount?: number;
  loadingLabel?: string;
  error?: React.ReactNode;
  emptyState?: React.ReactNode;
  label?: string;
  renderItem?: (item: T, index: number, state: SortableItemRenderState) => React.ReactNode;
  children?: React.ReactNode;
}

function SortableListInner<T extends SortableEntry>(
  {
    id,
    items,
    onReorder,
    onItemsChange,
    orientation = 'vertical',
    columns = 3,
    gap,
    size = 'md',
    variant = 'surface',
    type = 'sortable-item',
    accept,
    disabled = false,
    showMoveButtons = false,
    isLoading = false,
    loadingCount = 3,
    loadingLabel = 'Loading items...',
    error,
    emptyState = 'No items yet. Add or drag an item here.',
    label,
    renderItem,
    style,
    className,
    children,
    ...props
  }: SortableListProps<T>,
  ref: React.ForwardedRef<HTMLUListElement>
) {
  const generatedId = useId();
  const containerId = id ?? generatedId;
  const dnd = useDndInternal();
  const listElRef = useRef<HTMLUListElement | null>(null);
  const isDisabled = disabled || dnd.disabled;

  const itemIds = useMemo(() => items.map((entry) => getEntryId(entry)), [items]);

  const latestRef = useRef({ items, itemIds, onReorder, onItemsChange });
  latestRef.current = { items, itemIds, onReorder, onItemsChange };

  const commitReorder = useCallback(
    (activeId: string, fromIndex: number, toIndex: number) => {
      const {
        items: curItems,
        itemIds: curIds,
        onReorder: reorderCb,
        onItemsChange: changeCb,
      } = latestRef.current;
      if (fromIndex === toIndex) return;
      if (fromIndex < 0 || fromIndex >= curItems.length) return;
      const clampedTo = Math.max(0, Math.min(curItems.length - 1, toIndex));
      if (fromIndex === clampedTo) return;

      const nextItems = arrayMove(curItems, fromIndex, clampedTo);
      const nextIds = arrayMove(curIds, fromIndex, clampedTo);
      const detail = { activeId, fromIndex, toIndex: clampedTo };
      reorderCb?.(nextIds, detail);
      changeCb?.(nextItems, detail);
    },
    []
  );

  const moveItem = useCallback(
    (fromIndex: number, toIndex: number) => {
      const { itemIds: curIds } = latestRef.current;
      const movedId = curIds[fromIndex];
      if (!movedId) return;
      const clampedTo = Math.max(0, Math.min(curIds.length - 1, toIndex));
      if (fromIndex === clampedTo) return;
      commitReorder(movedId, fromIndex, clampedTo);
      dnd.announce(`Moved item to position ${clampedTo + 1} of ${curIds.length}.`);
    },
    [commitReorder, dnd]
  );

  const effectiveAccept = accept ?? type;

  useEffect(() => {
    return dnd.registerSortableContainer({
      id: containerId,
      element: listElRef.current,
      orientation,
      columns,
      itemIds,
      accept: effectiveAccept,
      disabled: isDisabled,
      label: label ?? containerId,
      onCommitReorder: commitReorder,
    });
  }, [
    dnd,
    containerId,
    orientation,
    columns,
    itemIds,
    effectiveAccept,
    isDisabled,
    label,
    commitReorder,
  ]);

  const listContextValue = useMemo<SortableListContextValue>(
    () => ({
      containerId,
      orientation,
      size,
      variant,
      type,
      disabled: isDisabled,
      showMoveButtons,
      itemIds,
      moveItem,
    }),
    [containerId, orientation, size, variant, type, isDisabled, showMoveButtons, itemIds, moveItem]
  );

  const isContainerDirectlyOver =
    dnd.over?.containerId === containerId &&
    dnd.over?.kind === 'droppable' &&
    dnd.over?.accepts;

  const cssVars = {
    ...(gap !== undefined
      ? { '--eta-dnd-gap': typeof gap === 'number' ? `${gap}px` : gap }
      : {}),
    ...(orientation === 'grid' ? { '--eta-dnd-columns': String(Math.max(1, columns)) } : {}),
  } as React.CSSProperties;

  if (error) {
    return (
      <div role="alert" className={cn(styles.errorState, className)}>
        {error}
      </div>
    );
  }

  if (isLoading) {
    const safeCount = Math.max(1, loadingCount);
    return (
      <div
        role="status"
        aria-live="polite"
        aria-label={loadingLabel}
        className={cn(styles.loadingState, className)}
      >
        <p className={styles.loadingLabel}>{loadingLabel}</p>
        {Array.from({ length: safeCount }).map((_, idx) => (
          <div key={idx} className={styles.skeletonRow} aria-hidden="true" />
        ))}
      </div>
    );
  }

  const hasItems = items.length > 0;

  return (
    <SortableListContext.Provider value={listContextValue}>
      <ul
        ref={(el) => {
          listElRef.current = el;
          setRef(ref, el);
        }}
        aria-label={label}
        data-eta-sortable-list-id={containerId}
        data-orientation={orientation}
        data-over={isContainerDirectlyOver ? 'true' : undefined}
        className={cn(
          styles.sortableList,
          orientation === 'horizontal'
            ? styles.listHorizontal
            : orientation === 'grid'
              ? styles.listGrid
              : styles.listVertical,
          isContainerDirectlyOver && styles.listOverContainer,
          className
        )}
        style={{ ...cssVars, ...style }}
        {...props}
      >
        {!hasItems && emptyState !== null && emptyState !== undefined ? (
          <li className={styles.emptyState}>{emptyState}</li>
        ) : renderItem ? (
          items.map((entry, idx) => {
            const entryId = getEntryId(entry);
            const isDraggingItem = dnd.active?.id === entryId;
            const isOverItem = dnd.over?.id === entryId && dnd.over?.kind === 'item';
            return renderItem(entry, idx, {
              isDragging: isDraggingItem,
              isOver: isOverItem,
              index: idx,
              total: items.length,
            });
          })
        ) : (
          children
        )}
      </ul>
    </SortableListContext.Provider>
  );
}

const SortableListBase = forwardRef(SortableListInner as unknown as React.ForwardRefRenderFunction<
  HTMLUListElement,
  SortableListProps<SortableEntry>
>);

export type SortableListComponent = (<T extends SortableEntry = SortableEntry>(
  props: SortableListProps<T> & { ref?: React.Ref<HTMLUListElement> }
) => React.ReactElement | null) & { displayName?: string };

export const SortableList: SortableListComponent = Object.assign(
  forwardRef(function SortableListWrapper(
    props: SortableListProps<SortableEntry>,
    ref: React.ForwardedRef<HTMLUListElement>
  ) {
    const existingDnd = useContext(DndInternalContext);
    if (existingDnd) {
      return <SortableListBase ref={ref} {...props} />;
    }
    return (
      <DragAndDrop disabled={props.disabled}>
        <SortableListBase ref={ref} {...props} />
      </DragAndDrop>
    );
  }) as unknown as SortableListComponent,
  { displayName: 'SortableList' }
);

export interface SortableItemActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  previousLabel?: string;
  nextLabel?: string;
}

export const SortableItemActions = forwardRef<HTMLDivElement, SortableItemActionsProps>(
  function SortableItemActions({ previousLabel, nextLabel, className, ...props }, ref) {
    const itemCtx = useContext(SortableItemContext);
    if (!itemCtx) {
      throw new Error('SortableItemActions must be rendered inside a <SortableItem />.');
    }

    const useHorizontalIcons =
      itemCtx.orientation === 'horizontal' || itemCtx.orientation === 'grid';
    const prevAria =
      previousLabel ??
      (useHorizontalIcons ? `Move ${itemCtx.label} left` : `Move ${itemCtx.label} up`);
    const nextAria =
      nextLabel ??
      (useHorizontalIcons ? `Move ${itemCtx.label} right` : `Move ${itemCtx.label} down`);

    return (
      <div ref={ref} className={cn(styles.actions, className)} {...props}>
        <button
          type="button"
          className={styles.actionBtn}
          aria-label={prevAria}
          disabled={itemCtx.disabled || !itemCtx.canMovePrevious}
          onClick={(e) => {
            e.stopPropagation();
            itemCtx.movePrevious();
          }}
        >
          {useHorizontalIcons ? <ArrowLeftIcon /> : <ArrowUpIcon />}
        </button>
        <button
          type="button"
          className={styles.actionBtn}
          aria-label={nextAria}
          disabled={itemCtx.disabled || !itemCtx.canMoveNext}
          onClick={(e) => {
            e.stopPropagation();
            itemCtx.moveNext();
          }}
        >
          {useHorizontalIcons ? <ArrowRightIcon /> : <ArrowDownIcon />}
        </button>
      </div>
    );
  }
);

SortableItemActions.displayName = 'SortableItemActions';

export interface SortableItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  id: string;
  index?: number;
  label?: string;
  disabled?: boolean;
  handle?: boolean;
  data?: DragData;
  showMoveButtons?: boolean;
  unstyled?: boolean;
}

export const SortableItem = forwardRef<HTMLLIElement, SortableItemProps>(function SortableItem(
  {
    id,
    index: indexProp,
    label,
    disabled = false,
    handle = false,
    data,
    showMoveButtons,
    unstyled = false,
    className,
    children,
    onPointerDown,
    onKeyDown,
    onClickCapture,
    ...props
  },
  ref
) {
  const dnd = useDndInternal();
  const listCtx = useContext(SortableListContext);
  if (!listCtx) {
    throw new Error('SortableItem must be used within a <SortableList />.');
  }

  const itemElRef = useRef<HTMLLIElement | null>(null);
  const triggerElRef = useRef<HTMLElement | null>(null);

  const resolvedIndex = useMemo(() => {
    if (indexProp !== undefined) return indexProp;
    const found = listCtx.itemIds.indexOf(id);
    return found === -1 ? 0 : found;
  }, [indexProp, listCtx.itemIds, id]);

  const isDisabled = disabled || listCtx.disabled || dnd.disabled;
  const resolvedLabel = label ?? (typeof children === 'string' ? children : id);
  const total = listCtx.itemIds.length;

  const setTriggerElement = useCallback((el: HTMLElement | null) => {
    triggerElRef.current = el;
  }, []);

  useEffect(() => {
    return dnd.registerSortableItem({
      id,
      containerId: listCtx.containerId,
      index: resolvedIndex,
      element: itemElRef.current,
      triggerElement: triggerElRef.current ?? itemElRef.current,
      disabled: isDisabled,
      label: resolvedLabel,
      type: listCtx.type,
      data,
    });
  }, [
    dnd,
    id,
    listCtx.containerId,
    listCtx.type,
    resolvedIndex,
    isDisabled,
    resolvedLabel,
    data,
  ]);

  const dragItem = useMemo<ActiveDragItem>(
    () => ({
      id,
      type: listCtx.type,
      containerId: listCtx.containerId,
      index: resolvedIndex,
      label: resolvedLabel,
      data,
    }),
    [id, listCtx.type, listCtx.containerId, resolvedIndex, resolvedLabel, data]
  );

  const isActive = dnd.active?.id === id;
  const isPointerDragging = isActive && dnd.dragSource === 'pointer';
  const isKeyboardDragging = isActive && dnd.dragSource === 'keyboard';

  const isOverThisItem =
    dnd.over?.kind === 'item' && dnd.over.id === id && dnd.over.accepts && !isActive;
  const dropPosition = isOverThisItem ? dnd.over?.position : undefined;
  const useHorizontalIndicator =
    listCtx.orientation === 'horizontal' || listCtx.orientation === 'grid';

  const shouldShowMoveButtons = showMoveButtons ?? listCtx.showMoveButtons;

  const itemContextValue = useMemo<SortableItemContextValue>(
    () => ({
      id,
      label: resolvedLabel,
      index: resolvedIndex,
      total,
      disabled: isDisabled,
      orientation: listCtx.orientation,
      canMovePrevious: resolvedIndex > 0,
      canMoveNext: resolvedIndex < total - 1,
      movePrevious: () => listCtx.moveItem(resolvedIndex, resolvedIndex - 1),
      moveNext: () => listCtx.moveItem(resolvedIndex, resolvedIndex + 1),
    }),
    [id, resolvedLabel, resolvedIndex, total, isDisabled, listCtx]
  );

  const bindingValue = useMemo<DragTriggerBindingContextValue>(
    () => ({
      item: dragItem,
      disabled: isDisabled,
      setTriggerElement,
    }),
    [dragItem, isDisabled, setTriggerElement]
  );

  return (
    <SortableItemContext.Provider value={itemContextValue}>
      <DragTriggerBindingContext.Provider value={bindingValue}>
        <li
          ref={(el) => {
            itemElRef.current = el;
            if (!handle) triggerElRef.current = el;
            setRef(ref, el);
          }}
          data-eta-sortable-item-id={id}
          data-dragging={isActive ? 'true' : undefined}
          data-over={isOverThisItem ? 'true' : undefined}
          data-drop-position={dropPosition}
          data-disabled={isDisabled ? 'true' : undefined}
          tabIndex={!handle ? (isDisabled ? -1 : 0) : undefined}
          aria-roledescription="sortable item"
          aria-describedby={!handle ? dnd.instructionsId : undefined}
          className={cn(
            styles.sortableItem,
            !unstyled && styles.draggable,
            !unstyled && styles[`variant-${listCtx.variant}`],
            !unstyled && styles[`size-${listCtx.size}`],
            !unstyled && !isDisabled && styles.interactiveSurface,
            !handle && !isDisabled && styles.grabTarget,
            !handle && styles.focusable,
            isPointerDragging && styles.isDragging,
            isKeyboardDragging && styles.isKeyboardDragging,
            isDisabled && styles.disabled,
            dropPosition === 'before' &&
              (useHorizontalIndicator
                ? styles.dropIndicatorBeforeHorizontal
                : styles.dropIndicatorBeforeVertical),
            dropPosition === 'after' &&
              (useHorizontalIndicator
                ? styles.dropIndicatorAfterHorizontal
                : styles.dropIndicatorAfterVertical),
            className
          )}
          onPointerDown={(e) => {
            onPointerDown?.(e);
            if (!handle && !e.defaultPrevented && !isDisabled) {
              dnd.startPointerSession(e, dragItem, false);
            }
          }}
          onKeyDown={(e) => {
            onKeyDown?.(e);
            if (!handle && !e.defaultPrevented && !isDisabled) {
              dnd.handleDragTriggerKeyDown(e, dragItem, false);
            }
          }}
          onClickCapture={(e) => {
            onClickCapture?.(e);
            if (!handle) {
              dnd.onTriggerClickCapture(e);
            }
          }}
          {...props}
        >
          <div className={styles.itemContent}>{children}</div>
          {shouldShowMoveButtons && <SortableItemActions />}
        </li>
      </DragTriggerBindingContext.Provider>
    </SortableItemContext.Provider>
  );
});

SortableItem.displayName = 'SortableItem';
