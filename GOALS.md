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
- [ ] **Alert / Callout**: Semantic soft status boxes (Success, Warning, Error, Info)
- [ ] **Toast**: Floating transient notifications
- [ ] **Spinner & Skeleton**: Soft pastel shimmer loading indicators
- [ ] **Modal / Dialog**: Radix-based accessible modal dialog
- [ ] **Drawer / Sheet**: Slide-out panels
- [ ] **Tooltip & Popover**: Floating helper content
- [ ] **Tabs & Accordion**: Accessible collapsible panels
- [ ] **Breadcrumb**: Path navigation

---

## 📋 Phase 3: Advanced Form & Data (Target `v1.0.0`)
- [ ] **Select / Combobox**: Searchable accessible dropdown
- [ ] **Datepicker & Slider**
- [ ] **FileDropzone**: Drag & drop file upload
- [ ] **Table**: Soft styled data table with sorting and empty states
- [ ] **Pagination & DropdownMenu**
