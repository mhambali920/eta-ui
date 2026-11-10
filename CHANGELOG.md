# Changelog

All notable changes to `@eta-ui/react` are documented in this file.

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
- `Progress` and `CircularProgress` with determinate and indeterminate states.
- `Spinner` and `Skeleton` (`SkeletonText`, `SkeletonCircle`) loading indicators.
- `Toast` and `useToast` hook with six viewport placement options.
- `EmptyState` placeholder for empty views and search results.
- `Dialog`, `AlertDialog`, and `Drawer` overlays with focus trapping and backdrop blur.
- `Tooltip`, `Popover`, `HoverCard`, and `Command` (`Cmd+K` palette) floating components.

#### Navigation and Disclosure
- `Tabs` with segmented, underline, and outline variants.
- `Accordion` and `Collapsible` disclosure panels.
- `Breadcrumb`, `Pagination`, and `Stepper` navigation components.

#### Forms and Data Display
- `FormField` and `useFormField` for linking labels, helper text, and error messages via ARIA attributes.
- `Select`, `Combobox`, `DatePicker`, `NumberInput`, `PinInput`, `ToggleGroup`, and `Slider` form controls.
- `DropdownMenu` with submenus, checkbox items, and radio items.
- `Table`, `FileDropzone`, `Tag`, `Timeline`, `Stat`, `Code`, and `CodeBlock` data display components.

#### Accessibility
- Minimum 4.5:1 contrast ratio (WCAG 2.1 AA) across light and dark themes.
- Full keyboard navigation and WAI-ARIA attributes across all interactive components.
