# Changelog

All notable changes to `@eta-ui/react` are documented in this file.

## 0.4.0

### Minor Changes

- Add 7 new accessible Soft UI components and harmonize Storybook categories:
  - `ContextMenu`: Contextual right-click action menu built on `@radix-ui/react-context-menu` with submenus, shortcuts, and checkbox/radio items.
  - `ScrollArea`: Smooth custom scrollbars built on `@radix-ui/react-scroll-area` supporting vertical, horizontal, and bidirectional scrolling with Soft UI theming.
  - `Rating`: Pure interactive SVG star rating supporting 0.5 half-precision, keyboard roving navigation, and read-only states.
  - `AspectRatio`: Media container preserving fixed aspect ratios (`16:9`, `4:3`, `1:1`) to eliminate layout shifts.
  - `Menubar`: Desktop application top navigation menu built on `@radix-ui/react-menubar` with shortcuts and nested submenus.
  - `TreeView`: Accessible hierarchical tree view for nested files, folders, and category navigation.
  - `Sidebar`: Responsive compound application sidebar with icon-rail collapse, floating variant, mobile drawer mode, and floating popover submenu when collapsed.
  - Standardize all 52 Storybook stories into 6 clean, semantic categories (`Layout`, `Forms`, `Data Display`, `Navigation`, `Overlay`, `Feedback`).

## 0.3.1

### Patch Changes

- Fix square border artifact (`border-radius: inherit` on `.group .container`) in `AvatarGroup` by moving the circular cutout ring to `.group .root` and adding `max` and `size` Storybook controls on the `Group` story.

## 0.3.0

### Minor Changes

- Harmonize component size scales across all 46 components and complete Storybook controls:
  
  - Establish a unified two-tier size standard (`sm | md | lg` at `32px / 40px / 48px` for interactive, form, navigation, and selection components; `xs | sm | md | lg | xl` for media, loaders, and typography).
  - Align height, padding, font size, and border radius across `Button`, `IconButton`, `Input`, `Select`, `Combobox`, `DatePicker`, `NumberInput`, `PinInput`, `ToggleGroup`, `Tabs`, `Pagination`, `ThemeToggle`, `Badge`, `Tag`, `Checkbox`, `Radio`, `Switch`, and `Slider`.
  - Add `size` (`sm | md | lg`) support to `Alert`, `Breadcrumb`, `Collapsible`, `DropdownMenu`, `Command`, `FileDropzone`, `Stat`, `Timeline`, `CodeBlock`, `Divider`, `Tooltip`, `Toast`, `FormField`, `RadioGroup`, `AvatarGroup`, and `Pagination`, plus `xs | sm | md | lg | xl` presets on `SkeletonCircle`.
  - Complete `argTypes` and default `args` across all 46 Storybook stories (`*.stories.tsx`) for full interactive control coverage.

## 0.2.0

### Minor Changes

- 6edce60: Add 17 new components across forms, overlays, disclosure, and data display, along with dynamic CSS-variable theme presets:
  
  - Forms and inputs: `FormField` (`useFormField`), `NumberInput`, `PinInput`, `Combobox`, `DatePicker` (`Calendar`, `DateRangePicker`), `Tag` (`Chip`), and `ToggleGroup` (`Toggle`).
  - Overlays and disclosure: `AlertDialog`, `HoverCard`, `Collapsible`, and `Command` (`CommandDialog`).
  - Feedback and data display: `Progress` (`CircularProgress`), `Stepper`, `Timeline`, `Stat` (`StatGroup`), `EmptyState`, and `Code` (`CodeBlock`, `Kbd`).
  - Documentation and theming: Add 8 WCAG 2.1 AA CSS custom property theme presets (4 muted palettes and 4 high-saturation palettes) and component catalog tables in `README.md`.

## 0.1.0

### Initial Release

First public release of `@eta-ui/react`, an accessible React component library built with dynamic CSS custom properties (`--eta-*`), zero-runtime CSS Modules, and Radix UI primitives.

#### Core Primitives
- `Button` and `IconButton` with `solid`, `soft`, `outline`, and `ghost` variants, loading states, and `asChild` composition.
- `Input` and `Textarea` with left and right adornments, character counter, auto-resize, and validation states.
- `Checkbox`, `Radio`, `RadioGroup`, and `Switch` with custom SVG indicators and keyboard roving focus.
- `Badge`, `Avatar`, and `AvatarGroup` with status dots, initials fallback, and stacked layout.
- `Card` container with `CardHeader`, `CardTitle`, `CardDescription`, `CardBody`, and `CardFooter`.
- `Heading`, `Text`, `Container`, and `Divider` for typography and page layout.
- `ThemeProvider`, `useTheme`, and `ThemeToggle` for persistent light, dark, and system theme switching.

#### Feedback and Overlays
- `Alert` for `info`, `success`, `warning`, and `error` status messages.
- `Spinner` and `Skeleton` (`SkeletonText`, `SkeletonCircle`) loading indicators.
- `Toast` and `useToast` hook with six viewport placement options.
- `Dialog` and `Drawer` overlays with focus trapping and backdrop blur.
- `Tooltip` and `Popover` floating components.

#### Navigation
- `Tabs` with segmented, underline, and outline variants.
- `Accordion` collapsible disclosure sections.
- `Breadcrumb` and `Pagination` navigation components.

#### Forms and Data Display
- `Select` and `Slider` form controls.
- `DropdownMenu` with submenus, checkbox items, and radio items.
- `Table` and `FileDropzone` data and upload components.

#### Accessibility
- Minimum 4.5:1 contrast ratio (WCAG 2.1 AA) across light and dark themes.
- Full keyboard navigation and WAI-ARIA attributes across all interactive components.
