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

#### 9. Tabs
- **Path**: `src/components/Tabs/`
- **Status**: [x] COMPLETED
- **Features**:
  - Headless `@radix-ui/react-tabs` with variants (`soft`, `underline`, `outline`), sizes (`sm`, `md`, `lg`), and orientations (`horizontal`, `vertical`)
  - Full keyboard navigation (arrows, home, end) and roving focus
  - Interactive Storybook controls binding
  - Tests: `Tabs.test.tsx` (4 tests passing)
  - Stories: `Tabs.stories.tsx` (Storybook v10 with dynamic controls)

#### 10. Accordion
- **Path**: `src/components/Accordion/`
- **Status**: [x] COMPLETED
- **Features**:
  - Headless `@radix-ui/react-accordion` supporting `single` (collapsible) and `multiple` modes
  - Smooth height animation and rotating chevron indicator
  - Variants: `bordered`, `flush`, `soft`
  - Tests: `Accordion.test.tsx` (4 tests passing)
  - Stories: `Accordion.stories.tsx` (Storybook v10 with interactive controls)

#### 11. Breadcrumb
- **Path**: `src/components/Breadcrumb/`
- **Status**: [x] COMPLETED
- **Features**:
  - Semantic HTML navigation (`<nav aria-label="Breadcrumb">`, `<ol>`, `<li>`)
  - Subcomponents: `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`
  - Current page indicator with accessible `aria-current="page"`
  - Radix `Slot` integration with `asChild` for router frameworks (Next.js Link, React Router)
  - Custom separator support and collapsed path ellipsis
  - Tests: `Breadcrumb.test.tsx` (4 tests passing)
  - Stories: `Breadcrumb.stories.tsx` (Storybook v10 with custom separators and collapsed ellipsis)

---

## 📋 Phase 3: Advanced Form & Data (Target `v1.0.0`)

#### 1. Select
- **Path**: `src/components/Select/`
- **Status**: [x] COMPLETED
- **Features**:
  - Headless `@radix-ui/react-select` with full keyboard navigation and scroll buttons
  - Subcomponents: `Select`, `SelectGroup`, `SelectValue`, `SelectTrigger`, `SelectContent`, `SelectItem`, `SelectLabel`, `SelectSeparator`
  - Variants: `outline`, `filled`
  - Sizes: `sm`, `md`, `lg`
  - Soft focus ring (`0 0 0 3px var(--eta-color-primary-focus)`)
  - Validation: `isInvalid` with `aria-invalid`
  - Tests: `Select.test.tsx` (3 tests passing)
  - Stories: `Select.stories.tsx` (Storybook v10 with dynamic controls)

#### 2. Slider
- **Path**: `src/components/Slider/`
- **Status**: [x] COMPLETED
- **Features**:
  - Headless `@radix-ui/react-slider` with single and dual-thumb range slider support
  - Subcomponents: `Slider`, `SliderTrack`, `SliderRange`, `SliderThumb`
  - Sizes: `sm`, `md`, `lg`
  - Colors: `primary`, `secondary`, `success`, `warning`, `danger`
  - Orientations: `horizontal`, `vertical`
  - Smooth scale animations on hover/grab and soft diffused focus rings
  - Tests: `Slider.test.tsx` (4 tests passing)
  - Stories: `Slider.stories.tsx` (Storybook v10 with dynamic controls)

#### 3. DropdownMenu
- **Path**: `src/components/DropdownMenu/`
- **Status**: [x] COMPLETED
- **Features**:
  - Headless `@radix-ui/react-dropdown-menu` with full keyboard navigation and item highlighting
  - Subcomponents: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuCheckboxItem`, `DropdownMenuRadioGroup`, `DropdownMenuRadioItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, `DropdownMenuShortcut`, `DropdownMenuSub`, `DropdownMenuSubTrigger`, `DropdownMenuSubContent`
  - Colors: default soft highlight, danger item with pastel status error background
  - Checkbox & Radio item indicators with custom inline SVG checkmarks
  - Submenu cascading flyout with chevron indicators
  - Tests: `DropdownMenu.test.tsx` (3 tests passing)
  - Stories: `DropdownMenu.stories.tsx` (Storybook v10 with dynamic controls)

#### 4. Table
- **Path**: `src/components/Table/`
- **Status**: [x] COMPLETED
- **Features**:
  - Accessible responsive data table wrapper (`<div class="container"><table>...`)
  - Subcomponents: `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`, `TableEmpty`
  - Variants: `default`, `striped`, `hoverable`
  - Sizes: `sm`, `md`, `lg`
  - Bordered option with delicate soft lines (`--eta-border-default`)
  - Column sorting support with sort indicators (`asc`, `desc`, neutral) and `aria-sort`
  - Empty state helper (`TableEmpty`) with icon, title, and description
  - Tests: `Table.test.tsx` (4 tests passing)
  - Stories: `Table.stories.tsx` (Storybook v10 with interactive sorting and controls)

#### 5. Pagination
- **Path**: `src/components/Pagination/`
- **Status**: [x] COMPLETED
- **Features**:
  - Semantic `<nav role="navigation" aria-label="Pagination">` and `<ul role="list">`
  - Subcomponents: `Pagination`, `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`
  - Variants: `ghost`, `outline`
  - Active variants: `soft` (tinted pastel), `solid` (filled primary)
  - Sizes: `sm`, `md`, `lg`
  - Current page indicator with accessible `aria-current="page"`
  - Disabled previous/next handling with `aria-disabled="true"`
  - Radix `Slot` integration via `asChild` for router frameworks (Next.js Link, React Router)
  - Tests: `Pagination.test.tsx` (4 tests passing)
  - Stories: `Pagination.stories.tsx` (Storybook v10 with interactive page switcher and controls)

#### 6. FileDropzone
- **Path**: `src/components/FileDropzone/`
- **Status**: [x] COMPLETED
- **Features**:
  - Accessible drag & drop file upload with hidden input fallback
  - Subcomponents: `FileDropzone`, `FileDropzoneIcon`, `FileDropzoneTitle`, `FileDropzoneDescription`, `FileDropzoneFileList`, `FileDropzoneFileItem`
  - Drag-over highlight animation with soft scaling and primary border
  - File filtering: `accept`, `maxFiles`, `maxSize`, with rejection callback `onFileReject`
  - Keyboard activation via `Enter` or `Space` (`role="button"`, `tabIndex={0}`)
  - File preview list item with filename, human-readable file size formatter (`formatBytes`), and removal button
  - Tests: `FileDropzone.test.tsx` (7 tests passing)
  - Stories: `FileDropzone.stories.tsx` (Storybook v10 with interactive file queue and controls)

---

## 📋 Phase 4: Extended Form Controls, Feedback & Inputs (Target `v1.1.0`)

#### 1. FormField
- **Path**: `src/components/FormField/`
- **Status**: [x] COMPLETED
- **Features**:
  - Accessible form field container (`FormField`, `FormLabel`, `FormHelperText`, `FormErrorMessage`)
  - React Context binding for automatic `id`, `htmlFor`, `aria-describedby`, `aria-invalid`, and `aria-required`
  - Required indicator (`isRequired`) with soft danger asterisk and optional label (`optionalText`)
  - States: `isInvalid`, `isDisabled`, `isRequired`, `isReadOnly`
  - Tests: `src/components/FormField/FormField.test.tsx` (4 tests passing)
  - Stories: `src/components/FormField/FormField.stories.tsx` (Storybook v10)

#### 2. Progress & CircularProgress
- **Path**: `src/components/Progress/`
- **Status**: [x] COMPLETED
- **Features**:
  - Accessible `Progress` (linear bar) and `CircularProgress` (SVG ring) with `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`
  - Determinate (`value` 0–100) and `isIndeterminate` animated states
  - Semantic colors: `primary`, `secondary`, `success`, `warning`, `danger`, `info`
  - Sizes: `xs`, `sm`, `md`, `lg`, `xl`
  - Optional striped animation (`hasStripe`, `isAnimated`) and percentage label (`showValueLabel`)
  - Tests: `src/components/Progress/Progress.test.tsx` (4 tests passing)
  - Stories: `src/components/Progress/Progress.stories.tsx` (Storybook v10)

#### 3. NumberInput
- **Path**: `src/components/NumberInput/`
- **Status**: [x] COMPLETED
- **Features**:
  - Accessible numeric input (`role="spinbutton"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`)
  - Subcomponents: `NumberInput`, `NumberInputField`, `NumberInputStepper`, `NumberIncrementStepper`, `NumberDecrementStepper`
  - Value clamping (`min`, `max`), custom `step`, and decimal `precision`
  - Keyboard `ArrowUp` / `ArrowDown` stepping and `Home` / `End` min-max jump
  - Variants: `outline`, `filled`; Sizes: `sm`, `md`, `lg`; States: `isInvalid`, `disabled`, `readOnly`
  - Tests: `src/components/NumberInput/NumberInput.test.tsx` (4 tests passing)
  - Stories: `src/components/NumberInput/NumberInput.stories.tsx` (Storybook v10)

#### 4. PinInput (OTP Input)
- **Path**: `src/components/PinInput/`
- **Status**: [x] COMPLETED
- **Features**:
  - Multi-digit verification / OTP input (`PinInput`, `PinInputGroup`, `PinInputField`, `PinInputSeparator`)
  - Auto-advance focus on input, smart `Backspace` / arrow navigation, and full clipboard paste distribution
  - Input modes: `numeric` and `alphanumeric`; `mask` prop for secret PIN entry
  - Callbacks: `onChange` and `onComplete` (triggered when all slots are filled)
  - Sizes: `sm`, `md`, `lg`; Variants: `outline`, `filled`; States: `isInvalid`, `disabled`
  - Tests: `src/components/PinInput/PinInput.test.tsx` (4 tests passing)
  - Stories: `src/components/PinInput/PinInput.stories.tsx` (Storybook v10)

#### 5. Combobox (Autocomplete)
- **Path**: `src/components/Combobox/`
- **Status**: [x] COMPLETED
- **Features**:
  - Accessible searchable select (`role="combobox"`, `aria-expanded`, `aria-controls`, `aria-activedescendant`)
  - Subcomponents: `Combobox`, `ComboboxInput`, `ComboboxTrigger`, `ComboboxContent`, `ComboboxList`, `ComboboxItem`, `ComboboxEmpty`, `ComboboxGroup`
  - Single and multi-select (`multiple`) modes with keyboard arrow navigation (`ArrowDown`, `ArrowUp`, `Enter`, `Escape`)
  - Built-in case-insensitive search filtering, custom `filterFn`, clearable button, and empty state message
  - Sizes: `sm`, `md`, `lg`; Variants: `outline`, `filled`; Validation: `isInvalid`
  - Tests: `src/components/Combobox/Combobox.test.tsx` (4 tests passing)
  - Stories: `src/components/Combobox/Combobox.stories.tsx` (Storybook v10)

#### 6. DatePicker & Calendar
- **Path**: `src/components/DatePicker/`
- **Status**: [x] COMPLETED
- **Features**:
  - Zero-dependency accessible `Calendar`, `DatePicker`, and `DateRangePicker` using native `Intl.DateTimeFormat`
  - Month and year navigation header, weekday grid, today indicator, and outside-month day dimming
  - Date constraints: `minDate`, `maxDate`, `disabledDates` predicate
  - Range selection mode with soft pastel connector highlight between start and end dates
  - Popover trigger input with formatted date display (`dateFormat` presets, `locale`, and custom `formatDate`) and clear button
  - Tests: `src/components/DatePicker/DatePicker.test.tsx` (5 tests passing)
  - Stories: `src/components/DatePicker/DatePicker.stories.tsx` (Storybook v10 with interactive `dateFormat` & `locale` controls)

#### 7. Tag / Chip
- **Path**: `src/components/Tag/`
- **Status**: [x] COMPLETED
- **Features**:
  - Interactive & dismissible tag/chip (`Tag`, `TagLabel`, `TagCloseButton`, `TagGroup`)
  - Variants: `soft`, `solid`, `outline`
  - Semantic colors: `primary`, `secondary`, `success`, `warning`, `danger`, `info`, `neutral`
  - Sizes: `sm`, `md`, `lg`; Shapes: `rounded`, `pill`
  - Removable (`isClosable`, `onRemove`) and interactive filter chip toggle (`isSelected`, `onClick`)
  - Tests: `src/components/Tag/Tag.test.tsx` (3 tests passing)
  - Stories: `src/components/Tag/Tag.stories.tsx` (Storybook v10)

#### 8. Toggle & ToggleGroup (Segmented Control)
- **Path**: `src/components/ToggleGroup/`
- **Status**: [x] COMPLETED
- **Features**:
  - Accessible two-state `Toggle` button (`aria-pressed`) and `ToggleGroup` / `ToggleGroupItem`
  - Selection modes: `single` (radio-like with `role="radiogroup"`) and `multiple` (toolbar-like with `role="group"`)
  - Variants: `soft`, `outline`, `segmented` (pill container with elevated active indicator)
  - Sizes: `sm`, `md`, `lg`; Orientations: `horizontal`, `vertical`
  - Full keyboard arrow navigation and disabled state handling
  - Tests: `src/components/ToggleGroup/ToggleGroup.test.tsx` (3 tests passing)
  - Stories: `src/components/ToggleGroup/ToggleGroup.stories.tsx` (Storybook v10)

---

## 📋 Phase 5: Advanced Disclosure, Data Display & Spotlight (Target `v1.2.0`)

#### 1. AlertDialog
- **Path**: `src/components/AlertDialog/`
- **Status**: [ ] PENDING
- **Features**:
  - Accessible confirmation dialog (`role="alertdialog"`, `aria-modal="true"`) built on `@radix-ui/react-dialog`
  - Subcomponents: `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogBody`, `AlertDialogFooter`, `AlertDialogAction`, `AlertDialogCancel`
  - Prevents accidental outside-click dismissal by default to protect destructive user flows
  - Semantic intents (`danger`, `warning`, `info`, `primary`) with soft status icon badge
  - Tests: `src/components/AlertDialog/AlertDialog.test.tsx`
  - Stories: `src/components/AlertDialog/AlertDialog.stories.tsx`

#### 2. HoverCard
- **Path**: `src/components/HoverCard/`
- **Status**: [ ] PENDING
- **Features**:
  - Rich preview card triggered by pointer hover and keyboard focus
  - Subcomponents: `HoverCard`, `HoverCardTrigger`, `HoverCardContent`, `HoverCardArrow`
  - Configurable `openDelay` (default 200ms) and `closeDelay` (default 150ms) with hover-bridge persistence
  - Placements (`top`, `right`, `bottom`, `left`) and sizes (`sm`, `md`, `lg`)
  - Diffused soft elevation (`--eta-shadow-lg`) and smooth fade/scale animation
  - Tests: `src/components/HoverCard/HoverCard.test.tsx`
  - Stories: `src/components/HoverCard/HoverCard.stories.tsx`

#### 3. Collapsible
- **Path**: `src/components/Collapsible/`
- **Status**: [ ] PENDING
- **Features**:
  - Accessible single-panel expand/collapse primitive (`Collapsible`, `CollapsibleTrigger`, `CollapsibleContent`)
  - Controlled (`open`, `onOpenChange`) and uncontrolled (`defaultOpen`) modes
  - Automatic `aria-expanded`, `aria-controls`, and `data-state="open|closed"` attributes
  - Smooth animated transition and disabled state support
  - Tests: `src/components/Collapsible/Collapsible.test.tsx`
  - Stories: `src/components/Collapsible/Collapsible.stories.tsx`

#### 4. Stepper
- **Path**: `src/components/Stepper/`
- **Status**: [ ] PENDING
- **Features**:
  - Multi-step workflow progress component (`Stepper`, `Step`, `StepIndicator`, `StepTitle`, `StepDescription`, `StepSeparator`)
  - Orientations: `horizontal` and `vertical`; Sizes: `sm`, `md`, `lg`
  - Automatic step status calculation (`complete`, `active`, `upcoming`, `error`) from `activeStep` index
  - Built-in checkmark & error SVG indicators, custom icon override, and optional clickable steps (`onStepClick`)
  - Tests: `src/components/Stepper/Stepper.test.tsx`
  - Stories: `src/components/Stepper/Stepper.stories.tsx`

#### 5. Timeline
- **Path**: `src/components/Timeline/`
- **Status**: [ ] PENDING
- **Features**:
  - Chronological event & activity feed (`Timeline`, `TimelineItem`, `TimelinePoint`, `TimelineConnector`, `TimelineContent`, `TimelineTitle`, `TimelineTime`, `TimelineDescription`)
  - Semantic status point colors (`primary`, `secondary`, `success`, `warning`, `danger`, `info`, `neutral`)
  - Variants: `solid`, `soft`, `outline` indicator dots with custom icon slot
  - Layouts: `left` (standard) and `alternate`
  - Tests: `src/components/Timeline/Timeline.test.tsx`
  - Stories: `src/components/Timeline/Timeline.stories.tsx`

#### 6. Stat (Metric Card)
- **Path**: `src/components/Stat/`
- **Status**: [ ] PENDING
- **Features**:
  - Dashboard KPI and metric display (`Stat`, `StatLabel`, `StatValue`, `StatHelpText`, `StatTrend`, `StatIcon`, `StatGroup`)
  - `StatTrend` with directional indicator (`up`, `down`, `neutral`) and soft semantic badge styling
  - Variants: `surface` (elevated card), `outline`, `subtle`, `ghost`
  - Responsive `StatGroup` grid container
  - Tests: `src/components/Stat/Stat.test.tsx`
  - Stories: `src/components/Stat/Stat.stories.tsx`

#### 7. EmptyState
- **Path**: `src/components/EmptyState/`
- **Status**: [ ] PENDING
- **Features**:
  - Reusable zero-data / empty view placeholder (`EmptyState`, `EmptyStateIcon`, `EmptyStateTitle`, `EmptyStateDescription`, `EmptyStateActions`)
  - Sizes: `sm`, `md`, `lg`; Variants: `default`, `bordered` (dashed soft border), `surface`
  - Built-in calming soft SVG illustration fallback with custom icon & action button slots
  - Tests: `src/components/EmptyState/EmptyState.test.tsx`
  - Stories: `src/components/EmptyState/EmptyState.stories.tsx`

#### 8. Code & Kbd
- **Path**: `src/components/Code/`
- **Status**: [ ] PENDING
- **Features**:
  - `Kbd`: Tactile keyboard shortcut badge (`<Kbd>⌘</Kbd><Kbd>K</Kbd>`) with subtle 3D bottom border
  - `Code`: Inline monospace code highlight with `soft`, `outline`, and `solid` variants across semantic colors
  - `CodeBlock`: Multi-line preformatted code container with optional filename header, line numbers (`showLineNumbers`), and one-click Copy to Clipboard button
  - Tests: `src/components/Code/Code.test.tsx`
  - Stories: `src/components/Code/Code.stories.tsx`

#### 9. Command (Command Palette / Spotlight)
- **Path**: `src/components/Command/`
- **Status**: [ ] PENDING
- **Features**:
  - Composable Command Palette (`Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandSeparator`, `CommandShortcut`)
  - Instant search filtering, keyboard navigation (`ArrowUp`, `ArrowDown`, `Home`, `End`, `Enter`), and item selection (`onSelect`)
  - `CommandDialog` modal overlay with optional `⌘K` / `Ctrl+K` global shortcut binding
  - Soft glassmorphic backdrop and calm highlight states
  - Tests: `src/components/Command/Command.test.tsx`
  - Stories: `src/components/Command/Command.stories.tsx`
