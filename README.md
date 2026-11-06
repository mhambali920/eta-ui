# eta-ui

> Accessible React UI Kit with a calming, soft color scheme (WCAG AA Compliant).

`eta-ui` is a modern component library designed with soft pastel aesthetics. It avoids harsh pure whites (`#FFFFFF`) and pure blacks (`#000000`) to reduce eye strain, while ensuring all text and interactive elements satisfy WCAG AA contrast requirements (>= 4.5:1).

Built on top of accessible headless primitives (Radix UI), CSS Variables (`--eta-*`), and zero-runtime CSS Modules.

---

## Features

- **Soft & Eye-Friendly Aesthetics**: Muted pastel color palette calibrated for focus and comfortable viewing.
- **Accessible by Default**: Powered by Radix UI primitives with built-in keyboard navigation, ARIA attributes, and focus management.
- **Dynamic Dark Mode**: Automatic support for Light, Dark, and System modes using CSS custom properties (`--eta-*`).
- **Fully Typed**: Written in TypeScript with complete type declarations (`.d.ts`).
- **Zero-Config Styling**: Bundles pre-compiled CSS with scoped CSS Modules. No Tailwind or runtime CSS-in-JS setup required.
- **Tree-Shakeable**: Optimized ESM and CJS bundles built with esbuild.

---

## Installation

```bash
npm install @eta-ui/react
```

---

## Quick Start

Import the stylesheet once at your application's entry point (e.g. `main.tsx`, `_app.tsx`, or `layout.tsx`):

```tsx
import '@eta-ui/react/styles.css';
import {
  ThemeProvider,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Input,
  Badge,
  Alert,
} from '@eta-ui/react';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Card style={{ maxWidth: 480, margin: '40px auto' }}>
        <CardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <CardTitle>Welcome to @eta-ui/react</CardTitle>
            <Badge variant="soft" color="primary">v0.1.0</Badge>
          </div>
        </CardHeader>

        <CardBody style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Alert status="info" title="Soft Color Palette">
            Muted colors with high contrast for comfortable long-session viewing.
          </Alert>

          <Input placeholder="Enter your email address..." />

          <Button variant="solid" color="primary">
            Get Started
          </Button>
        </CardBody>
      </Card>
    </ThemeProvider>
  );
}
```

---

## Theme & Dark Mode

Wrap your root layout with `ThemeProvider` to enable seamless theme switching with persistence:

```tsx
import { ThemeProvider, ThemeToggle, useTheme } from '@eta-ui/react';

function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>My Workspace</span>
      <ThemeToggle variant="segmented" size="sm" />
    </header>
  );
}
```

`ThemeProvider` automatically persists the selected theme in `localStorage` under `eta-ui-theme` and updates the `data-theme` attribute on `<html>`.

---

## Design Tokens

All colors, radii, shadows, and transitions are exposed as CSS variables prefixed with `--eta-`:

| CSS Variable | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| `--eta-bg-base` | `#FAF9F6` | `#181A20` | Primary page background |
| `--eta-bg-surface` | `#F3F1ED` | `#22252E` | Card, dialog, and panel surface |
| `--eta-bg-subtle` | `#EAE6DF` | `#2C303B` | Input background & subtle hover states |
| `--eta-color-primary` | `#6B9080` (Sage) | `#84A98C` (Mint) | Primary buttons, active tabs, focus ring |
| `--eta-color-secondary` | `#7E99A3` (Dusty Blue) | `#9BB1BC` | Secondary accents, badges, links |
| `--eta-text-heading` | `#2B2D42` | `#EDF2F4` | Headings and titles |
| `--eta-text-body` | `#5C6070` | `#B8C0CC` | Paragraphs and labels |
| `--eta-text-muted` | `#8D99AE` | `#7D8597` | Captions, placeholders, disabled text |
| `--eta-border-default` | `#E5E3DC` | `#323642` | Borders and dividers |

---

## Component Catalog

### Core Primitives
- **Button & IconButton**: `solid`, `soft`, `outline`, `ghost` variants with semantic colors and loading states.
- **Form Inputs**: `Input` and `Textarea` with adornments, soft focus rings, and validation states.
- **Selection**: `Checkbox`, `Radio` & `RadioGroup`, and `Switch`.
- **Data Display**: `Badge`, `Avatar`, and `AvatarGroup`.
- **Containers**: `Card` (`CardHeader`, `CardTitle`, `CardDescription`, `CardBody`, `CardFooter`).
- **Typography & Layout**: `Heading`, `Text`, `Container`, and `Divider`.
- **Theme**: `ThemeProvider`, `useTheme()`, and `ThemeToggle`.

### Feedback
- **Alert / Callout**: Semantic soft status boxes (`info`, `success`, `warning`, `error`).
- **Spinner**: Smooth rotating loading indicator with customizable sizes and colors.
- **Skeleton**: Soft pastel shimmer and pulse placeholders (`SkeletonText`, `SkeletonCircle`).
- **Toast**: Floating transient notifications via `@radix-ui/react-toast` with `useToast()` hook.

### Overlay
- **Dialog / Modal**: Accessible dialogs with diffused backdrop blur and focus trap.
- **Drawer / Sheet**: Slide-out panels from `right`, `left`, `top`, or `bottom`.
- **Tooltip**: Floating helper text with `dark` and `soft` variants.
- **Popover**: Floating interactive content panel with header, body, and footer.

### Navigation
- **Tabs**: Segmented, underlined, or outlined tab navigation with keyboard support.
- **Accordion**: Accessible collapsible sections with smooth height animations.
- **Breadcrumb**: Accessible hierarchical path navigation.
- **Pagination**: Accessible page navigation controls with active variants and `asChild` router support.

### Advanced Form & Data
- **Select**: Headless select with custom styled triggers, options, scroll controls, and groups.
- **Slider**: Single and dual-thumb range sliders with semantic pastel accents.
- **DropdownMenu**: Contextual actions, nested submenus, checkable & radio menu items.
- **Table**: Responsive styled data table with column sorting and empty state illustrations.
- **FileDropzone**: Drag & drop file upload with validation filters and file list preview.

---

## Interactive Documentation (Storybook)

To explore and test all components interactively:

```bash
npm run storybook
```

This starts Storybook at `http://localhost:6006` with live property controls and accessibility audits.

---

## License

MIT &copy; [mhambali920](https://github.com/mhambali920)
