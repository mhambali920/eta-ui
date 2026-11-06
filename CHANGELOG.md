# Changelog

All notable changes to `eta-ui` will be documented in this file.

## 0.1.0

### Initial Release

- First public release of **`eta-ui`** - An accessible React UI Kit with a calming soft/muted pastel color scheme.
- **Core Primitives**:
  - `Button` & `IconButton`: Solid, soft, outline, ghost variants, loading spinner, polymorphic `asChild`.
  - `Input` & `Textarea`: Soft focus rings, left/right adornments, character counter, auto-resize.
  - `Checkbox`, `Radio` & `RadioGroup`, `Switch`: Custom SVG indicators, keyboard roving focus.
  - `Badge`, `Avatar`, `AvatarGroup`: Pill/rounded shapes, status indicators, initials fallback, overlapping stack.
  - `Card`: Subcomponents (`CardHeader`, `CardTitle`, `CardDescription`, `CardBody`, `CardFooter`) with soft diffused shadows.
  - `Heading`, `Text`, `Container`, `Divider`: Semantic typography and responsive layout containers.
  - `ThemeProvider`, `useTheme()`, `ThemeToggle`: Persistent theme switching across Light, Dark, and System modes.
- **Feedback & Overlay**:
  - `Alert` / `Callout`: Soft tinted status callouts (`info`, `success`, `warning`, `error`).
  - `Spinner`: Smooth rotating SVG indicator.
  - `Skeleton`: Soft pastel shimmer and pulse placeholders (`SkeletonText`, `SkeletonCircle`).
  - `Toast`: Imperative `useToast()` hook with 6 viewport placement options.
  - `Dialog` / `Modal`: Radix Dialog with diffused backdrop blur.
  - `Drawer` / `Sheet`: 4-direction slide-out sheet (`right`, `left`, `top`, `bottom`).
  - `Tooltip`: Shorthand and composable tooltips with dark and soft variants.
  - `Popover`: Diffused soft floating interactive content panels.
- **Navigation**:
  - `Tabs`: Segmented, underline, and outline variants with full keyboard navigation.
  - `Accordion`: Single and multiple collapsible sections with rotating chevrons.
  - `Breadcrumb`: Accessible semantic path navigation with `asChild` router integration.
  - `Pagination`: Accessible page navigation controls with active variants.
- **Advanced Form & Data**:
  - `Select`: Headless Radix Select with customizable options, trigger, and scroll buttons.
  - `Slider`: Single and dual-thumb range sliders with pastel accents.
  - `DropdownMenu`: Contextual action menus with submenus, checkbox items, and keyboard navigation.
  - `Table`: Responsive styled data table with column sorting and empty state illustration.
  - `FileDropzone`: Drag & drop file upload with file type/size validation and file queue list.
- **Accessibility**:
  - 100% WCAG AA contrast ratio compliance (`>= 4.5:1`).
  - Full keyboard accessibility and WAI-ARIA attributes across all primitives.
