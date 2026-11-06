# eta-ui Component Automation Goals & Progress

This document tracks the modular UI component goals for `eta-ui`.
Each UI component is an independent, self-contained goal designed for automated vibe-coding execution.

---

## 🎯 Verification Loop per Component
Before marking a component goal complete:
1. Run `node scripts/verify-component.mjs <ComponentName>`
2. Ensure:
   - Typecheck passes (0 TS errors)
   - Unit tests pass with 100% success
   - Bundler builds cleanly (`dist/` generated)
   - Component exported in `src/index.ts`
   - Strict rule: **DO NOT** run `git commit` unless explicitly instructed by the user.

---

## 📋 Phase 1: Core Primitives (Target `v0.1.0` - MVP)

### Foundation & Theme System
- [x] **Tokens & Global Styles**: `src/styles/tokens.css`, `reset.css`, `index.css`
- [x] **Theme Engine**: `ThemeProvider`, `useTheme()`, localStorage persistence, Dark Mode & System fallback
- [x] **Theme Tests**: `src/theme/Theme.test.tsx` (Passed)

---

### Component Goals

#### 1. Button & IconButton
- **Path**: `src/components/Button/`
- **Status**: [x] COMPLETED
- **Features**:
  - Variants: `solid`, `soft` (tinted), `outline`, `ghost`
  - Colors: `primary`, `secondary`, `success`, `warning`, `danger`, `info`
  - Sizes: `sm`, `md`, `lg`
  - States: `isLoading` (with animated spinner), `disabled`
  - Accessibility: Radix UI `Slot` & `Slottable` for polymorphic `asChild` support
  - Tests: `src/components/Button/Button.test.tsx` (7 tests passing)
  - Stories: `src/components/Button/Button.stories.tsx` (CSF3 with semantic stories)

---

#### 2. Form Inputs (Input & Textarea)
- **Path**: `src/components/Input/`, `src/components/Textarea/`
- **Status**: [x] COMPLETED
- **Features**:
  - Soft focus ring (`0 0 0 3px rgba(107, 144, 128, 0.25)`)
  - Sizes: `sm`, `md`, `lg`
  - Variants: `outline`, `filled`, `unstyled`
  - States: `isInvalid` (with `aria-invalid`), `disabled`, `readOnly`
  - Prefix & Suffix adornments (`leftAdornment`, `rightAdornment`)
  - Complementary `Textarea` with resizable controls (`none`, `vertical`, `horizontal`, `both`)
  - Tests: `src/components/Input/Input.test.tsx` (7 tests) & `src/components/Textarea/Textarea.test.tsx` (6 tests) - All passing

---

#### 3. Selection Controls (Checkbox, Radio, Switch)
- **Path**: `src/components/Checkbox/`, `src/components/Radio/`, `src/components/Switch/`
- **Status**: [x] COMPLETED
- **Features**:
  - Headless a11y primitives (Radix UI Checkbox, RadioGroup, Switch)
  - Soft pastel checked states & soft focus outline
  - Custom label & description alignment with accessible IDs (`aria-describedby`)
  - Sizes: `sm`, `md`, `lg`
  - States: `checked`, `defaultChecked`, `disabled`, `isInvalid` (with `aria-invalid`), `indeterminate` (for Checkbox)
  - Tests: `Checkbox.test.tsx` (6 tests), `Radio.test.tsx` (4 tests), `Switch.test.tsx` (5 tests) - All passing
  - Stories: `Checkbox.stories.tsx`, `Radio.stories.tsx`, `Switch.stories.tsx` (Storybook v10)

---

#### 4. Data Display (Badge & Avatar)
- **Path**: `src/components/Badge/`, `src/components/Avatar/`
- **Status**: [x] COMPLETED
- **Features**:
  - Badge variants: `soft`, `solid`, `outline` with full semantic colors (`primary`, `secondary`, `success`, `warning`, `danger`, `info`, `neutral`)
  - Badge sizes: `sm`, `md`, `lg`; shapes: `pill`, `rounded`; with optional dot indicator & icons
  - Avatar: Radix UI `@radix-ui/react-avatar` with image loading lifecycle & fallback initials derived from name (e.g. "Jane Doe" -> "JD")
  - Avatar sizes: `xs` (24px), `sm` (32px), `md` (40px), `lg` (48px), `xl` (56px)
  - Avatar shapes: `circle`, `rounded`; status indicator badge (`online`, `busy`, `away`, `offline`)
  - AvatarGroup: Overlapping stacked avatars with max visible count indicator (`+N`)
  - Tests: `Badge.test.tsx` (3 tests), `Avatar.test.tsx` (5 tests) - All passing
  - Stories: `Badge.stories.tsx`, `Avatar.stories.tsx` (Storybook v10)

---

#### 5. Card Container
- **Path**: `src/components/Card/`
- **Status**: [x] COMPLETED
- **Features**:
  - Subcomponents: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardBody`, `CardFooter`
  - Elevation: Soft diffused shadows (`--eta-shadow-sm`, `md`, `lg`)
  - Variants: `elevated`, `outline`, `filled`
  - Padding: `none`, `sm`, `md`, `lg`
  - Interactive hover state: subtle lift (`translateY(-2px)`) & accent highlight
  - Border highlight for dark mode support (`1px solid var(--eta-border-default)`)
  - Tests: `Card.test.tsx` (4 tests passing)
  - Stories: `Card.stories.tsx` (Storybook v10 with subcomponent layouts)

---

#### 6. Typography & Layout
- **Path**: `src/components/Typography/`, `src/components/Layout/`
- **Status**: [x] COMPLETED
- **Features**:
  - `Heading`: Polymorphic h1-h6 tags, font sizes (xs to 4xl), weights, alignments, and soft charcoal ink (`--eta-text-heading`)
  - `Text`: Polymorphic (p, span, div, label, small, strong, em), variants (body, muted, lead, caption), and semantic colors
  - `Container`: Responsive max-width container (`sm`, `md`, `lg`, `xl`, `2xl`, `fluid`) with optional padding & centering
  - `Divider`: Accessible separator (`role="separator"`), horizontal & vertical orientations, styles (solid, dashed, dotted), with optional label (left, center, right)
  - Tests: `Typography.test.tsx` (6 tests), `Layout.test.tsx` (6 tests) - All passing
  - Stories: `Typography.stories.tsx`, `Layout.stories.tsx` (Storybook v10)

---

#### 7. ThemeToggle
- **Path**: `src/components/ThemeToggle/`
- **Status**: [x] COMPLETED
- **Features**:
  - Interactive toggle button between Light, Dark, and System modes
  - Variants: `icon` (rotating/cycling button) and `segmented` (pill option group)
  - Sizes: `sm`, `md`, `lg`
  - Inline custom SVGs for Sun, Moon, and Monitor (zero external icon dependency)
  - Seamless integration with `useTheme()` and `ThemeProvider`
  - Tests: `ThemeToggle.test.tsx` (3 tests passing)
  - Stories: `ThemeToggle.stories.tsx` (Storybook v10)

---

## 📋 Phase 2: Feedback & Navigation (Target `v0.2.0`)

#### 1. Alert / Callout
- **Path**: `src/components/Alert/`
- **Status**: [x] COMPLETED
- **Features**:
  - Variants: `soft` (pastel background with WCAG AA contrast), `outline`, `solid`
  - Statuses: `info`, `success`, `warning`, `error`, `danger` (alias for error)
  - Subcomponents: `AlertTitle`, `AlertDescription`, `AlertIcon`, `AlertCloseButton`
  - Built-in accessible SVGs for semantic status icons & close button
  - Shorthand props: `title`, `description`, `icon`, `action`, `isClosable`, `onClose`
  - Semantic alias: `Callout` (identical API)
  - A11y: `role="status"` (info/success) or `role="alert"` (warning/error) with `aria-live="polite"`
  - Tests: `Alert.test.tsx` (11 tests passing)
  - Stories: `Alert.stories.tsx` (Storybook v10 with status, variant, dismissible, and action examples)

#### 2. Spinner
- **Path**: `src/components/Spinner/`
- **Status**: [x] COMPLETED
- **Features**:
  - Smooth rotating loading indicator with sizes (`xs`, `sm`, `md`, `lg`, `xl`)
  - Semantic status colors (`primary`, `secondary`, `success`, `warning`, `danger`, `info`, `neutral`)
  - Custom `thickness`, `speed`, and `emptyColor` support
  - Screen-reader accessible label (`role="status"`)
  - Tests: `Spinner.test.tsx` (5 tests passing)
  - Stories: `Spinner.stories.tsx` (Storybook v10)

#### 3. Skeleton
- **Path**: `src/components/Skeleton/`
- **Status**: [x] COMPLETED
- **Features**:
  - Soft pastel shimmer and pulse placeholders avoiding stark contrasts
  - Variants: `rounded`, `text`, `circular`, `rectangular`
  - Customizable dimensions and wrapper `isLoaded` support
  - Subcomponents: `SkeletonCircle`, `SkeletonText` (multi-line layout with natural last-line truncation)
  - Tests: `Skeleton.test.tsx` (8 tests passing)
  - Stories: `Skeleton.stories.tsx` (Storybook v10)

#### 4. Toast
- **Path**: `src/components/Toast/`
- **Status**: [x] COMPLETED
- **Features**:
  - Headless a11y primitive: `@radix-ui/react-toast` with swipe-to-dismiss gesture support
  - Subcomponents: `ToastProvider`, `Toast`, `ToastTitle`, `ToastDescription`, `ToastAction`, `ToastClose`, `ToastViewport`
  - Imperative hook: `useToast()` with `toast()`, `toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()`, and `dismiss()`
  - Viewport positions: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`
  - Variants: `surface` (accented side border) and `soft` (tinted background)
  - Diffused elevation: `--eta-shadow-lg`
  - Tests: `Toast.test.tsx` (5 tests passing)
  - Stories: `Toast.stories.tsx` (Storybook v10 with interactive demo in multiple positions)

#### 5. Modal / Dialog
- **Path**: `src/components/Dialog/`
- **Status**: [x] COMPLETED
- **Features**:
  - Headless a11y primitive: `@radix-ui/react-dialog` with focus trap, aria attributes, and keyboard ESC navigation
  - Subcomponents: `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogBody`, `DialogFooter`, `DialogClose`
  - Semantic aliases: `Modal`, `ModalTrigger`, `ModalContent`, `ModalHeader`, `ModalTitle`, `ModalDescription`, `ModalBody`, `ModalFooter`, `ModalClose`
  - Soft overlay backdrop blur (`backdrop-filter: blur(4px)`)
  - Elevated modal surface with soft rounded corners (`--eta-radius-lg` / 12px)
  - Sizes: `sm` (400px), `md` (540px), `lg` (720px), `xl` (900px), `full` (fluid fullscreen)
  - Smooth scale & fade-in entrance animation
  - Tests: `Dialog.test.tsx` (4 tests passing)
  - Stories: `Dialog.stories.tsx` (Storybook v10 with confirmation and profile form layouts)

#### 6. Drawer / Sheet
- **Path**: `src/components/Drawer/`
- **Status**: [x] COMPLETED
- **Features**:
  - Headless a11y primitive: `@radix-ui/react-dialog` configured for slide-out drawers and bottom sheets
  - Sides: `right` (default), `left`, `top`, `bottom`
  - Sizes: `sm`, `md`, `lg`, `full`
  - Subcomponents: `Drawer`, `DrawerTrigger`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent`, `DrawerHeader`, `DrawerTitle`, `DrawerDescription`, `DrawerBody`, `DrawerFooter`, `DrawerClose`
  - Semantic aliases: `Sheet`, `SheetTrigger`, `SheetPortal`, `SheetOverlay`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetBody`, `SheetFooter`, `SheetClose`
  - Smooth slide animations with directional transform
  - Tests: `Drawer.test.tsx` (4 tests passing)
  - Stories: `Drawer.stories.tsx` (Storybook v10 with right side, left navigation, and bottom sheet examples)

#### 7. Tooltip
- **Path**: `src/components/Tooltip/`
- **Status**: [x] COMPLETED
- **Features**:
  - Headless `@radix-ui/react-tooltip` with shorthand `<Tooltip content="..."><button /></Tooltip>` and composable subcomponents
  - Variants: `dark` (high-contrast charcoal) and `soft` (tinted surface)
  - Customizable placements (`top`, `right`, `bottom`, `left`), optional arrow, and delay
  - Tests: `Tooltip.test.tsx` (3 tests passing)
  - Stories: `Tooltip.stories.tsx` (Storybook v10 with interactive controls)

#### 8. Popover
- **Path**: `src/components/Popover/`
- **Status**: [x] COMPLETED
- **Features**:
  - Headless `@radix-ui/react-popover` with subcomponents (`Popover`, `PopoverTrigger`, `PopoverContent`, `PopoverHeader`, `PopoverTitle`, `PopoverDescription`, `PopoverBody`, `PopoverFooter`, `PopoverClose`, `PopoverArrow`)
  - Sizes: `sm`, `md`, `lg`, `auto`
  - Diffused soft shadows and accessible ESC / outside-click handling
  - Tests: `Popover.test.tsx` (2 tests passing)
  - Stories: `Popover.stories.tsx` (Storybook v10 with interactive controls)

- [ ] **Tabs & Accordion**: Accessible collapsible panels
- [ ] **Breadcrumb**: Path navigation

---

## 📋 Phase 3: Advanced Form & Data (Target `v1.0.0`)
- [ ] **Select / Combobox**: Searchable accessible dropdown
- [ ] **Datepicker & Slider**
- [ ] **FileDropzone**: Drag & drop file upload
- [ ] **Table**: Soft styled data table with sorting and empty states
- [ ] **Pagination & DropdownMenu**
