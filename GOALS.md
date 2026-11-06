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
- **Status**: [ ] PENDING
- **Features**:
  - Headless a11y primitives (Radix UI)
  - Soft pastel checked states & focus outline
  - Custom label alignment and disabled styling

---

#### 4. Data Display (Badge & Avatar)
- **Path**: `src/components/Badge/`, `src/components/Avatar/`
- **Status**: [ ] PENDING
- **Features**:
  - Badge variants: `soft`, `solid`, `outline` with semantic colors (success, warning, error, info)
  - Avatar: Image source with fallback initials, rounded shapes (`md`, `full`)

---

#### 5. Card Container
- **Path**: `src/components/Card/`
- **Status**: [ ] PENDING
- **Features**:
  - Subcomponents: `Card`, `CardHeader`, `CardBody`, `CardFooter`
  - Elevation: Soft diffused shadows (`--eta-shadow-sm`, `md`, `lg`)
  - Border highlight for dark mode support

---

#### 6. Typography & Layout
- **Path**: `src/components/Typography/`, `src/components/Layout/`
- **Status**: [ ] PENDING
- **Features**:
  - `Heading` (h1-h6 tags, font sizes, soft charcoal ink)
  - `Text` (body, muted, small)
  - `Divider` (subtle hairline)
  - `Container` (max-width responsive container)

---

#### 7. ThemeToggle
- **Path**: `src/components/ThemeToggle/`
- **Status**: [ ] PENDING
- **Features**:
  - Interactive toggle button between Light, Dark, and System modes
  - Smooth icon transition

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
