import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { flushSync } from 'react-dom';
import { cn } from '../../utils/cn';
import styles from './Carousel.module.css';

/* -------------------------------------------------------------------------------------------------
 * Helpers
 * -----------------------------------------------------------------------------------------------*/

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const mod = (a: number, n: number) => ((a % n) + n) % n;
const clamp = (v: number, min: number, max: number) =>
  Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : min;

/** Pixels the pointer must travel before a press turns into a drag. */
const DRAG_THRESHOLD = 6;
/** Resistance applied when dragging past the first/last slide without loop. */
const RUBBER_BAND = 0.35;
/** Quiet time (ms) that ends a wheel/trackpad gesture. One gesture moves one slide. */
const WHEEL_GESTURE_GAP = 180;

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
};

function setRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as React.MutableRefObject<T>).current = value;
}

/* -------------------------------------------------------------------------------------------------
 * Context & Types
 * -----------------------------------------------------------------------------------------------*/

export type CarouselOrientation = 'horizontal' | 'vertical';

export interface CarouselContextValue {
  /** Index of the first fully visible real slide. */
  activeIndex: number;
  /** Number of real slides (clones excluded). */
  totalSlides: number;
  /** Number of reachable positions, i.e. the number of pagination dots. */
  snapCount: number;
  itemsPerView: number;
  orientation: CarouselOrientation;
  /** Effective loop state. Loop is disabled automatically when all slides fit in one view. */
  loop: boolean;
  canPrev: boolean;
  canNext: boolean;
  isPlaying: boolean;
  next: () => void;
  prev: () => void;
  goTo: (index: number) => void;
  carouselId: string;
}

interface CarouselInternalValue {
  position: number;
  animate: boolean;
  isDragging: boolean;
  draggable: boolean;
  cloneCount: number;
  liveRegion: 'off' | 'polite';
  trackRef: React.MutableRefObject<HTMLDivElement | null>;
  setViewportEl: (el: HTMLDivElement | null) => void;
  setTotalSlides: (n: number) => void;
  getTransform: (pos: number) => string;
  onTrackTransitionEnd: (e: React.TransitionEvent<HTMLDivElement>) => void;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  onPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => void;
  onClickCapture: (e: React.MouseEvent<HTMLDivElement>) => void;
}

interface SlideContextValue {
  index: number;
  isClone: boolean;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);
const CarouselInternalContext = createContext<CarouselInternalValue | null>(null);
const SlideContext = createContext<SlideContextValue | null>(null);

export function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within a <Carousel /> component.');
  }
  return context;
}

function useCarouselInternal() {
  const context = useContext(CarouselInternalContext);
  if (!context) {
    throw new Error('Carousel parts must be rendered inside a <Carousel /> component.');
  }
  return context;
}

/* -------------------------------------------------------------------------------------------------
 * Carousel Root
 * -----------------------------------------------------------------------------------------------*/

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: CarouselOrientation;
  /** Wrap around seamlessly from the last slide to the first and vice versa. */
  loop?: boolean;
  /** `true` cycles every 4000ms, a number sets the interval in ms. */
  autoplay?: boolean | number;
  /** Pause autoplay while hovered or while keyboard focus is inside. */
  pauseOnHover?: boolean;
  defaultValue?: number;
  value?: number;
  onValueChange?: (index: number) => void;
  /** Height of the carousel. Required for a meaningful vertical layout (default 320px). */
  height?: string | number;
  /** Number of slides visible at the same time. */
  itemsPerView?: number;
  /** Space between slides. Number values are pixels. */
  gap?: string | number;
  /** Slide transition duration in ms. */
  duration?: number;
  /** Enable mouse / touch / pen dragging. */
  draggable?: boolean;
  /** Enable navigation with the mouse wheel or trackpad swipe along the carousel axis. */
  wheel?: boolean;
  children?: React.ReactNode;
}

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(function Carousel(
  {
    orientation = 'horizontal',
    loop = false,
    autoplay = false,
    pauseOnHover = true,
    defaultValue = 0,
    value,
    onValueChange,
    height,
    itemsPerView = 1,
    gap,
    duration = 450,
    draggable = true,
    wheel = true,
    style,
    className,
    children,
    onKeyDown,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    ...props
  },
  ref
) {
  const carouselId = useId();
  const isControlled = value !== undefined;

  const [totalSlides, setTotalSlides] = useState(0);
  const n = totalSlides;
  const ipv = Math.max(1, Math.floor(itemsPerView) || 1);
  const loopEnabled = loop && n > ipv;
  // Enough clones on each side to fill one view plus one extra step of buffer,
  // so quick consecutive clicks keep animating instead of snapping.
  const cloneCount = loopEnabled ? ipv + 1 : 0;
  const maxIndex = loopEnabled ? n - 1 : Math.max(0, n - ipv);
  const snapCount = n === 0 ? 0 : maxIndex + 1;
  const safeDuration = Math.max(0, duration);

  const initial = isControlled ? (value as number) : defaultValue;
  // Logical position: real slides are 0..n-1, clones live at -cloneCount..-1 and n..n+cloneCount-1.
  const [position, setPosition] = useState(initial);
  const [animate, setAnimate] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const positionRef = useRef(initial);

  const realIndex =
    n === 0
      ? Math.max(0, Math.round(position))
      : loopEnabled
        ? mod(Math.round(position), n)
        : clamp(Math.round(position), 0, maxIndex);

  const canPrev = loopEnabled || realIndex > 0;
  const canNext = loopEnabled || realIndex < maxIndex;

  const trackRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [viewportEl, setViewportElState] = useState<HTMLDivElement | null>(null);
  const setViewportEl = useCallback((el: HTMLDivElement | null) => {
    viewportRef.current = el;
    setViewportElState(el);
  }, []);

  // Latest values for event handlers, timers and native listeners.
  const stateRef = useRef({
    n,
    ipv,
    loopEnabled,
    cloneCount,
    maxIndex,
    snapCount,
    orientation,
    duration: safeDuration,
    draggable,
  });
  stateRef.current = {
    n,
    ipv,
    loopEnabled,
    cloneCount,
    maxIndex,
    snapCount,
    orientation,
    duration: safeDuration,
    draggable,
  };
  const realIndexRef = useRef(realIndex);
  realIndexRef.current = realIndex;

  const getTransform = useCallback(
    (pos: number) => {
      const raw = (-(pos + cloneCount) * 100) / ipv;
      const offset = Number.isFinite(raw) ? +raw.toFixed(4) + 0 : 0;
      return orientation === 'horizontal'
        ? `translate3d(${offset}%, 0, 0)`
        : `translate3d(0, ${offset}%, 0)`;
    },
    [cloneCount, ipv, orientation]
  );
  const getTransformRef = useRef(getTransform);
  getTransformRef.current = getTransform;

  /* ----------------------------------------- movement ----------------------------------------- */

  const settleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const clearSettle = useCallback(() => {
    if (settleTimer.current !== undefined) clearTimeout(settleTimer.current);
    settleTimer.current = undefined;
  }, []);

  /** Jump to a position without animation. Only call from event handlers or timers. */
  const snapInstant = useCallback((p: number) => {
    positionRef.current = p;
    flushSync(() => {
      setAnimate(false);
      setPosition(p);
    });
    // Force a reflow so the next transition starts from the snapped position.
    void trackRef.current?.offsetHeight;
  }, []);

  /** After an animation lands on a clone, swap to the identical real slide. */
  const normalize = useCallback(() => {
    clearSettle();
    const s = stateRef.current;
    if (!s.loopEnabled || s.n === 0) return;
    const p = positionRef.current;
    if (p < 0 || p >= s.n) snapInstant(mod(p, s.n));
  }, [clearSettle, snapInstant]);

  const scheduleSettle = useCallback(() => {
    clearSettle();
    // Fallback for when `transitionend` never fires (reduced motion, hidden tab, interrupted transition).
    settleTimer.current = setTimeout(normalize, stateRef.current.duration + 80);
  }, [clearSettle, normalize]);

  const animateTo = useCallback(
    (target: number) => {
      if (target === positionRef.current) return;
      positionRef.current = target;
      setAnimate(true);
      setPosition(target);
      scheduleSettle();
    },
    [scheduleSettle]
  );

  const moveBy = useCallback(
    (delta: number) => {
      const s = stateRef.current;
      if (s.snapCount <= 1) return;
      const cur = Math.round(positionRef.current);
      if (!s.loopEnabled) {
        animateTo(clamp(cur + delta, 0, s.maxIndex));
        return;
      }
      const minP = -s.cloneCount;
      const maxP = s.n + s.cloneCount - s.ipv;
      let target = cur + delta;
      if (target < minP || target > maxP) {
        // Out of clone buffer: jump to the identical real position first, then animate.
        const base = mod(cur, s.n);
        snapInstant(base);
        target = base + delta;
      }
      animateTo(target);
    },
    [animateTo, snapInstant]
  );

  const goTo = useCallback(
    (index: number) => {
      const s = stateRef.current;
      if (s.n === 0 || !Number.isFinite(index)) return;
      const i = clamp(Math.round(index), 0, s.maxIndex);
      if (!s.loopEnabled) {
        animateTo(i);
        return;
      }
      const cur = Math.round(positionRef.current);
      const base = mod(cur, s.n);
      let diff = i - base;
      if (diff > s.n / 2) diff -= s.n;
      else if (diff < -s.n / 2) diff += s.n;
      const minP = -s.cloneCount;
      const maxP = s.n + s.cloneCount - s.ipv;
      let target = cur + diff;
      if (target < minP || target > maxP) {
        if (cur !== base) snapInstant(base);
        target = base + diff;
      }
      const inBuffer = target >= minP && target <= maxP;
      animateTo(inBuffer ? target : i);
    },
    [animateTo, snapInstant]
  );

  const next = useCallback(() => moveBy(1), [moveBy]);
  const prev = useCallback(() => moveBy(-1), [moveBy]);

  const moveByRef = useRef(moveBy);
  moveByRef.current = moveBy;
  const goToRef = useRef(goTo);
  goToRef.current = goTo;

  // Keep the position valid when slides, itemsPerView or loop change.
  useIsoLayoutEffect(() => {
    if (n === 0) return;
    clearSettle();
    const r = Math.round(positionRef.current);
    const nextPos = loopEnabled ? mod(r, n) : clamp(r, 0, maxIndex);
    positionRef.current = nextPos;
    setAnimate(false);
    setPosition(nextPos);
  }, [n, ipv, loopEnabled, maxIndex, clearSettle]);

  // Controlled value.
  useEffect(() => {
    if (!isControlled || n === 0) return;
    if (value !== realIndexRef.current) goTo(value as number);
  }, [isControlled, value, n, goTo]);

  // Report index changes from every source (buttons, dots, keys, drag, wheel, autoplay).
  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;
  const lastReported = useRef(realIndex);
  useEffect(() => {
    if (n === 0 || realIndex === lastReported.current) return;
    lastReported.current = realIndex;
    onValueChangeRef.current?.(realIndex);
  }, [realIndex, n]);

  useEffect(() => clearSettle, [clearSettle]);

  const onTrackTransitionEnd = useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      // Ignore transitions bubbling up from slide content (hover effects etc).
      if (e.target !== e.currentTarget) return;
      if (e.propertyName && e.propertyName !== 'transform') return;
      normalize();
    },
    [normalize]
  );

  /* ------------------------------------------- drag ------------------------------------------- */

  const dragRef = useRef<{
    id: number;
    x: number;
    y: number;
    active: boolean;
    origin: number;
    startPos: number;
    live: number;
    lastCoord: number;
    lastTime: number;
    velocity: number;
  } | null>(null);
  const suppressClickRef = useRef(false);

  const slideSizePx = useCallback(() => {
    const vp = viewportRef.current;
    const s = stateRef.current;
    if (!vp) return 300 / s.ipv;
    const rect = vp.getBoundingClientRect?.();
    const raw =
      s.orientation === 'horizontal'
        ? vp.clientWidth || rect?.width || 300
        : vp.clientHeight || rect?.height || 300;
    return raw / s.ipv;
  }, []);

  /** Where the track currently is on screen, including mid-transition. */
  const readVisualPosition = useCallback(() => {
    const track = trackRef.current;
    const s = stateRef.current;
    const size = slideSizePx();
    if (track && size > 0 && typeof window !== 'undefined') {
      const t = window.getComputedStyle(track).transform;
      const match = t ? t.match(/^matrix(3d)?\((.+)\)$/) : null;
      if (match) {
        const v = match[2].split(',').map((x) => parseFloat(x));
        const horizontal = s.orientation === 'horizontal';
        const translate = match[1] ? (horizontal ? v[12] : v[13]) : horizontal ? v[4] : v[5];
        if (Number.isFinite(translate)) return -translate / size - s.cloneCount;
      }
    }
    return positionRef.current;
  }, [slideSizePx]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const s = stateRef.current;
    if (!s.draggable || s.snapCount <= 1) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (!Number.isFinite(e.clientX) || !Number.isFinite(e.clientY)) return;
    suppressClickRef.current = false;
    dragRef.current = {
      id: e.pointerId ?? 0,
      x: e.clientX,
      y: e.clientY,
      active: false,
      origin: 0,
      startPos: 0,
      live: 0,
      lastCoord: 0,
      lastTime: 0,
      velocity: 0,
    };
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const d = dragRef.current;
      if (!d || d.id !== (e.pointerId ?? 0)) return;
      if (!Number.isFinite(e.clientX) || !Number.isFinite(e.clientY)) return;
      const s = stateRef.current;
      const horizontal = s.orientation === 'horizontal';
      const coord = horizontal ? e.clientX : e.clientY;

      if (!d.active) {
        const main = horizontal ? e.clientX - d.x : e.clientY - d.y;
        const cross = horizontal ? e.clientY - d.y : e.clientX - d.x;
        if (Math.abs(main) < DRAG_THRESHOLD && Math.abs(cross) < DRAG_THRESHOLD) return;
        if (Math.abs(cross) > Math.abs(main)) {
          // The user is scrolling the page, not the carousel.
          dragRef.current = null;
          return;
        }
        clearSettle();
        let start = readVisualPosition();
        start = s.loopEnabled ? mod(start, s.n) : clamp(start, 0, s.maxIndex);
        d.active = true;
        d.startPos = start;
        d.live = start;
        d.origin = (horizontal ? d.x : d.y) + Math.sign(main) * DRAG_THRESHOLD;
        d.lastCoord = coord;
        d.lastTime = e.timeStamp;
        try {
          e.currentTarget.setPointerCapture?.(e.pointerId);
        } catch {
          /* pointer capture is optional */
        }
        if (trackRef.current) trackRef.current.style.transition = 'none';
        setIsDragging(true);
      }

      const size = slideSizePx() || 1;
      let live = d.startPos - (coord - d.origin) / size;
      if (s.loopEnabled) {
        live = clamp(live, -s.cloneCount, s.n + s.cloneCount - s.ipv);
      } else if (live < 0) {
        live *= RUBBER_BAND;
      } else if (live > s.maxIndex) {
        live = s.maxIndex + (live - s.maxIndex) * RUBBER_BAND;
      }
      d.live = live;

      const dt = e.timeStamp - d.lastTime;
      if (dt > 0) {
        d.velocity = 0.8 * ((coord - d.lastCoord) / dt) + 0.2 * d.velocity;
        d.lastCoord = coord;
        d.lastTime = e.timeStamp;
      }
      // Write straight to the DOM: no React render per pointer move.
      if (trackRef.current) trackRef.current.style.transform = getTransformRef.current(live);
    },
    [clearSettle, readVisualPosition, slideSizePx]
  );

  const endDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
      const d = dragRef.current;
      if (!d || d.id !== (e.pointerId ?? 0)) return;
      dragRef.current = null;
      if (!d.active) return;
      try {
        e.currentTarget.releasePointerCapture?.(e.pointerId);
      } catch {
        /* pointer capture is optional */
      }

      const s = stateRef.current;
      const size = slideSizePx() || 1;
      const idle = e.timeStamp - d.lastTime > 100;
      const velocity = cancelled || idle ? 0 : d.velocity;
      const moved = d.live - d.startPos;
      const start = Math.round(d.startPos);
      let target = Math.round(d.live - (velocity * 180) / size);
      if (target === start && Math.abs(moved) > 0.15) target = start + Math.sign(moved);
      target = s.loopEnabled
        ? clamp(target, -s.cloneCount, s.n + s.cloneCount - s.ipv)
        : clamp(target, 0, s.maxIndex);

      suppressClickRef.current = Math.abs(moved * size) > DRAG_THRESHOLD;

      const track = trackRef.current;
      // Restore the CSS transition before the position changes so the release animates.
      if (track) track.style.transition = '';
      positionRef.current = target;
      flushSync(() => {
        setIsDragging(false);
        setAnimate(true);
        setPosition(target);
      });
      // React skips the style update when the target equals the pre-drag position.
      if (track) track.style.transform = getTransformRef.current(target);
      scheduleSettle();
    },
    [scheduleSettle, slideSizePx]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => endDrag(e, false),
    [endDrag]
  );
  const onPointerCancel = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => endDrag(e, true),
    [endDrag]
  );
  const onClickCapture = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    // A drag just ended: don't let it activate links or buttons inside the slide.
    suppressClickRef.current = false;
    e.preventDefault();
    e.stopPropagation();
  }, []);

  /* ------------------------------------------- wheel ------------------------------------------ */

  useEffect(() => {
    const el = viewportEl;
    if (!el || !wheel) return;
    let locked = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const handleWheel = (e: WheelEvent) => {
      const s = stateRef.current;
      if (s.snapCount <= 1 || dragRef.current?.active) return;
      const horizontal = s.orientation === 'horizontal';
      const main = horizontal ? e.deltaX : e.deltaY;
      const cross = horizontal ? e.deltaY : e.deltaX;
      // Let the page scroll when the gesture is mostly across the carousel axis.
      if (Math.abs(main) <= Math.abs(cross)) return;

      if (locked) {
        e.preventDefault();
        clearTimeout(timer);
        timer = setTimeout(() => (locked = false), WHEEL_GESTURE_GAP);
        return;
      }

      const dir = main > 0 ? 1 : -1;
      if (!s.loopEnabled) {
        const cur = Math.round(positionRef.current);
        // At the edge: hand the scroll back to the page.
        if ((dir > 0 && cur >= s.maxIndex) || (dir < 0 && cur <= 0)) return;
      }
      e.preventDefault();
      if (Math.abs(main) < 4) return;
      locked = true;
      clearTimeout(timer);
      timer = setTimeout(() => (locked = false), WHEEL_GESTURE_GAP);
      moveByRef.current(dir);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      clearTimeout(timer);
    };
  }, [viewportEl, wheel]);

  /* ----------------------------------------- autoplay ----------------------------------------- */

  const [hovered, setHovered] = useState(false);
  const [keyboardFocusWithin, setKeyboardFocusWithin] = useState(false);
  const [documentHidden, setDocumentHidden] = useState(false);

  useEffect(() => {
    if (!autoplay || typeof document === 'undefined') return;
    const handleVisibility = () => setDocumentHidden(document.hidden);
    handleVisibility();
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [autoplay]);

  const paused =
    (pauseOnHover && (hovered || keyboardFocusWithin)) || isDragging || documentHidden;
  const isPlaying = Boolean(autoplay) && !paused && snapCount > 1;
  const interval = typeof autoplay === 'number' && autoplay > 0 ? autoplay : 4000;

  useEffect(() => {
    if (!isPlaying) return;
    // Restarts after every move, so manual navigation always gets a full interval.
    const timer = setTimeout(() => {
      const s = stateRef.current;
      if (!s.loopEnabled && Math.round(positionRef.current) >= s.maxIndex) goToRef.current(0);
      else moveByRef.current(1);
    }, interval);
    return () => clearTimeout(timer);
  }, [isPlaying, interval, position]);

  /* ----------------------------------------- keyboard ----------------------------------------- */

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || isEditableTarget(e.target)) return;
    const prevKey = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    const nextKey = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    if (e.key === prevKey) {
      e.preventDefault();
      prev();
    } else if (e.key === nextKey) {
      e.preventDefault();
      next();
    } else if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goTo(maxIndex);
    }
  };

  /* ------------------------------------------ render ------------------------------------------ */

  const publicValue = useMemo<CarouselContextValue>(
    () => ({
      activeIndex: realIndex,
      totalSlides: n,
      snapCount,
      itemsPerView: ipv,
      orientation,
      loop: loopEnabled,
      canPrev,
      canNext,
      isPlaying,
      next,
      prev,
      goTo,
      carouselId,
    }),
    [realIndex, n, snapCount, ipv, orientation, loopEnabled, canPrev, canNext, isPlaying, next, prev, goTo, carouselId]
  );

  const internalValue = useMemo<CarouselInternalValue>(
    () => ({
      position,
      animate,
      isDragging,
      draggable,
      cloneCount,
      liveRegion: isPlaying ? 'off' : 'polite',
      trackRef,
      setViewportEl,
      setTotalSlides,
      getTransform,
      onTrackTransitionEnd,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onClickCapture,
    }),
    [
      position,
      animate,
      isDragging,
      draggable,
      cloneCount,
      isPlaying,
      setViewportEl,
      getTransform,
      onTrackTransitionEnd,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onClickCapture,
    ]
  );

  const cssVars = {
    '--eta-carousel-item-size': `${100 / ipv}%`,
    '--eta-carousel-duration': `${safeDuration}ms`,
    ...(gap !== undefined
      ? { '--eta-carousel-gap': typeof gap === 'number' ? `${gap}px` : gap }
      : {}),
    ...(height !== undefined
      ? { height: typeof height === 'number' ? `${height}px` : height }
      : {}),
  } as React.CSSProperties;

  return (
    <CarouselContext.Provider value={publicValue}>
      <CarouselInternalContext.Provider value={internalValue}>
        <div
          ref={ref}
          role="region"
          aria-roledescription="carousel"
          tabIndex={0}
          data-orientation={orientation}
          onKeyDown={handleKeyDown}
          onMouseEnter={(e) => {
            setHovered(true);
            onMouseEnter?.(e);
          }}
          onMouseLeave={(e) => {
            setHovered(false);
            onMouseLeave?.(e);
          }}
          onFocus={(e) => {
            try {
              if ((e.target as HTMLElement).matches(':focus-visible')) setKeyboardFocusWithin(true);
            } catch {
              /* :focus-visible unsupported */
            }
            onFocus?.(e);
          }}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setKeyboardFocusWithin(false);
            }
            onBlur?.(e);
          }}
          className={cn(
            styles.carousel,
            orientation === 'vertical' ? styles.vertical : styles.horizontal,
            className
          )}
          style={{ ...cssVars, ...style }}
          {...props}
        >
          {children}
        </div>
      </CarouselInternalContext.Provider>
    </CarouselContext.Provider>
  );
});

Carousel.displayName = 'Carousel';

/* -------------------------------------------------------------------------------------------------
 * CarouselContent (Viewport & Track)
 * -----------------------------------------------------------------------------------------------*/

export interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CarouselContent = forwardRef<HTMLDivElement, CarouselContentProps>(
  function CarouselContent({ className, children, style, onTransitionEnd, ...props }, ref) {
    const { carouselId, orientation, snapCount } = useCarousel();
    const ctx = useCarouselInternal();
    const { setTotalSlides, trackRef } = ctx;

    const items = React.Children.toArray(children).filter(React.isValidElement);
    const count = items.length;

    useIsoLayoutEffect(() => {
      setTotalSlides(count);
    }, [count, setTotalSlides]);

    const setTrackRef = useCallback(
      (node: HTMLDivElement | null) => {
        trackRef.current = node;
        setRef(ref, node);
      },
      [ref, trackRef]
    );

    const clones = count > 0 && ctx.cloneCount <= count ? ctx.cloneCount : 0;
    const slides: React.ReactNode[] = [];
    for (let k = -clones; k < 0; k++) {
      const real = mod(k, count);
      slides.push(
        <SlideContext.Provider key={`clone-start-${k}`} value={{ index: real, isClone: true }}>
          {items[real]}
        </SlideContext.Provider>
      );
    }
    items.forEach((item, i) => {
      slides.push(
        <SlideContext.Provider key={`slide-${item.key ?? i}`} value={{ index: i, isClone: false }}>
          {item}
        </SlideContext.Provider>
      );
    });
    for (let k = 0; k < clones; k++) {
      slides.push(
        <SlideContext.Provider key={`clone-end-${k}`} value={{ index: k, isClone: true }}>
          {items[k]}
        </SlideContext.Provider>
      );
    }

    const vertical = orientation === 'vertical';

    return (
      <div
        ref={ctx.setViewportEl}
        className={cn(
          styles.viewport,
          vertical ? styles.viewportVertical : styles.viewportHorizontal,
          ctx.draggable && snapCount > 1 && styles.draggable,
          ctx.isDragging && styles.dragging
        )}
        onPointerDown={ctx.onPointerDown}
        onPointerMove={ctx.onPointerMove}
        onPointerUp={ctx.onPointerUp}
        onPointerCancel={ctx.onPointerCancel}
        onClickCapture={ctx.onClickCapture}
        onDragStart={(e) => e.preventDefault()}
      >
        <div
          ref={setTrackRef}
          id={`${carouselId}-track`}
          aria-live={ctx.liveRegion}
          className={cn(
            styles.track,
            vertical ? styles.trackVertical : styles.trackHorizontal,
            !ctx.animate && styles.noTransition,
            className
          )}
          style={{ ...style, transform: ctx.getTransform(ctx.position) }}
          onTransitionEnd={(e) => {
            onTransitionEnd?.(e);
            ctx.onTrackTransitionEnd(e);
          }}
          {...props}
        >
          {slides}
        </div>
      </div>
    );
  }
);

CarouselContent.displayName = 'CarouselContent';

/* -------------------------------------------------------------------------------------------------
 * CarouselItem (Slide)
 * -----------------------------------------------------------------------------------------------*/

export interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(function CarouselItem(
  { className, children, ...props },
  ref
) {
  const { activeIndex, totalSlides, itemsPerView, loop } = useCarousel();
  const slide = useContext(SlideContext);
  const localRef = useRef<HTMLDivElement | null>(null);

  let hidden = false;
  if (slide && totalSlides > 0) {
    const offset = loop
      ? mod(slide.index - activeIndex, totalSlides)
      : slide.index - activeIndex;
    hidden = slide.isClone || offset < 0 || offset >= itemsPerView;
  }

  // Off-screen slides and clones must not be reachable with Tab.
  // Set as an attribute for compatibility with both React 18 and 19.
  useIsoLayoutEffect(() => {
    localRef.current?.toggleAttribute('inert', hidden);
  }, [hidden]);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      localRef.current = node;
      setRef(ref, node);
    },
    [ref]
  );

  return (
    <div
      ref={setRefs}
      role="group"
      aria-roledescription="slide"
      aria-label={slide ? `${slide.index + 1} of ${totalSlides}` : undefined}
      aria-hidden={hidden || undefined}
      data-clone={slide?.isClone || undefined}
      className={cn(styles.item, className)}
      {...props}
    >
      {children}
    </div>
  );
});

CarouselItem.displayName = 'CarouselItem';

/* -------------------------------------------------------------------------------------------------
 * CarouselPrevious & CarouselNext Buttons
 * -----------------------------------------------------------------------------------------------*/

export interface CarouselButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const CarouselPrevious = forwardRef<HTMLButtonElement, CarouselButtonProps>(
  function CarouselPrevious({ className, children, onClick, disabled, ...props }, ref) {
    const { orientation, prev, canPrev, carouselId } = useCarousel();

    return (
      <button
        ref={ref}
        type="button"
        aria-label="Previous slide"
        aria-controls={`${carouselId}-track`}
        disabled={disabled || !canPrev}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) prev();
        }}
        className={cn(
          styles.button,
          orientation === 'vertical' ? styles.prevVertical : styles.prevHorizontal,
          className
        )}
        {...props}
      >
        {children ?? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {orientation === 'vertical' ? (
              <polyline points="18 15 12 9 6 15" />
            ) : (
              <polyline points="15 18 9 12 15 6" />
            )}
          </svg>
        )}
      </button>
    );
  }
);

CarouselPrevious.displayName = 'CarouselPrevious';

export const CarouselNext = forwardRef<HTMLButtonElement, CarouselButtonProps>(
  function CarouselNext({ className, children, onClick, disabled, ...props }, ref) {
    const { orientation, next, canNext, carouselId } = useCarousel();

    return (
      <button
        ref={ref}
        type="button"
        aria-label="Next slide"
        aria-controls={`${carouselId}-track`}
        disabled={disabled || !canNext}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) next();
        }}
        className={cn(
          styles.button,
          orientation === 'vertical' ? styles.nextVertical : styles.nextHorizontal,
          className
        )}
        {...props}
      >
        {children ?? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {orientation === 'vertical' ? (
              <polyline points="6 9 12 15 18 9" />
            ) : (
              <polyline points="9 18 15 12 9 6" />
            )}
          </svg>
        )}
      </button>
    );
  }
);

CarouselNext.displayName = 'CarouselNext';

/* -------------------------------------------------------------------------------------------------
 * CarouselDots (Pagination indicators)
 * -----------------------------------------------------------------------------------------------*/

export interface CarouselDotsProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CarouselDots = forwardRef<HTMLDivElement, CarouselDotsProps>(function CarouselDots(
  { className, ...props },
  ref
) {
  const { snapCount, activeIndex, goTo, orientation, carouselId } = useCarousel();

  if (snapCount <= 1) return null;

  return (
    <div
      ref={ref}
      role="tablist"
      aria-label="Carousel pagination"
      aria-orientation={orientation}
      className={cn(
        styles.dots,
        orientation === 'vertical' ? styles.dotsVertical : styles.dotsHorizontal,
        className
      )}
      {...props}
    >
      {Array.from({ length: snapCount }, (_, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`${carouselId}-track`}
            aria-label={`Go to slide ${i + 1}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => goTo(i)}
            className={cn(
              styles.dot,
              isActive &&
                (orientation === 'vertical' ? styles.dotActiveVertical : styles.dotActiveHorizontal)
            )}
          />
        );
      })}
    </div>
  );
});

CarouselDots.displayName = 'CarouselDots';

/* -------------------------------------------------------------------------------------------------
 * CarouselCounter ("2 / 5")
 * -----------------------------------------------------------------------------------------------*/

export interface CarouselCounterProps extends React.HTMLAttributes<HTMLSpanElement> {}

export const CarouselCounter = forwardRef<HTMLSpanElement, CarouselCounterProps>(
  function CarouselCounter({ className, ...props }, ref) {
    const { activeIndex, snapCount } = useCarousel();
    if (snapCount === 0) return null;
    return (
      <span ref={ref} className={cn(styles.counter, className)} {...props}>
        {activeIndex + 1} / {snapCount}
      </span>
    );
  }
);

CarouselCounter.displayName = 'CarouselCounter';
