# eta-ui

> Accessible React component library with dynamic CSS-variable theming (WCAG 2.1 AA).

`@eta-ui/react` is a React UI kit built on Radix UI primitives, CSS custom properties (`--eta-*`), and zero-runtime CSS Modules. Colors, surfaces, border radii, and shadows are defined as CSS variables so you can switch themes or apply custom brand palettes dynamically while keeping a minimum 4.5:1 contrast ratio.

Key architectural details:

- Keyboard navigation, focus trapping, and WAI-ARIA attributes work out of the box through Radix UI.
- Light, dark, and system themes switch via CSS variables without runtime style recalculation.
- Styles ship as a single pre-compiled stylesheet (`@eta-ui/react/styles.css`), with no Tailwind or CSS-in-JS setup required.
- Bundles ship as tree-shakeable ESM and CommonJS modules with full TypeScript declarations (`.d.ts`).

---

## Installation

```bash
npm install @eta-ui/react
```

---

## Quick Start

Import `@eta-ui/react/styles.css` once at your application entry point (such as `main.tsx`, `_app.tsx`, or `layout.tsx`):

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

export default function InviteMemberCard() {
  return (
    <ThemeProvider defaultTheme="system">
      <Card style={{ maxWidth: 480, margin: '40px auto' }}>
        <CardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <CardTitle>Invite team member</CardTitle>
            <Badge variant="soft" color="primary">v0.3.1</Badge>
          </div>
        </CardHeader>

        <CardBody style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Alert status="info" title="Workspace access">
            New members can view shared boards and comment on active tasks.
          </Alert>

          <Input placeholder="colleague@company.com" type="email" />

          <Button variant="solid" color="primary">
            Send Invite
          </Button>
        </CardBody>
      </Card>
    </ThemeProvider>
  );
}
```

---

## Theme and Dark Mode

Wrap your root layout in `ThemeProvider` to manage light, dark, and system themes:

```tsx
import { ThemeProvider, ThemeToggle, useTheme } from '@eta-ui/react';

function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span>Workspace ({theme})</span>
      <ThemeToggle variant="segmented" size="sm" />
    </header>
  );
}
```

`ThemeProvider` saves the active theme to `localStorage` under the `eta-ui-theme` key and sets the `data-theme` attribute on `<html>`.

---

## Design Tokens

All colors, border radii, shadows, and transitions use `--eta-` CSS variables:

| CSS Variable | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| `--eta-bg-base` | `#FAF9F6` | `#181A20` | Primary page background |
| `--eta-bg-surface` | `#F3F1ED` | `#22252E` | Card, dialog, and panel surface |
| `--eta-bg-subtle` | `#EAE6DF` | `#2C303B` | Input background and hover fill |
| `--eta-color-primary` | `#6B9080` (Sage) | `#84A98C` (Mint) | Primary buttons, active tabs, focus ring |
| `--eta-color-secondary` | `#7E99A3` (Dusty Blue) | `#9BB1BC` | Secondary accents, badges, links |
| `--eta-text-heading` | `#2B2D42` | `#EDF2F4` | Headings and titles |
| `--eta-text-body` | `#5C6070` | `#B8C0CC` | Body copy and form labels |
| `--eta-text-muted` | `#8D99AE` | `#7D8597` | Captions, placeholders, disabled text |
| `--eta-border-default` | `#E5E3DC` | `#323642` | Borders and dividers |

---

## Color Presets

`@eta-ui/react` reads all color tokens from CSS custom properties. To switch palettes, override the variables in your global stylesheet (for example, `globals.css` or `index.css`) after importing `@eta-ui/react/styles.css`.

The eight presets below are organized into four muted palettes and four high-saturation palettes. All eight pass WCAG 2.1 AA contrast checks (>= 4.5:1) across surface, `solid`, `soft`, `outline`, and text states.

### 1. Muted Palettes

| Preset | Palette Description | Primary (Light / Dark) | Secondary (Light / Dark) | Base Surface (Light / Dark) |
| :--- | :--- | :--- | :--- | :--- |
| **Sage** *(Default)* | Botanical green on warm alabaster | `#6B9080` / `#84A98C` | `#7E99A3` / `#9BB1BC` | `#FAF9F6` / `#181A20` |
| **Ocean** | Muted coastal blue on cool grey-white | `#5B82A6` / `#7FA6C9` | `#6C9A9B` / `#8AB6B7` | `#F6F9FC` / `#151B23` |
| **Lavender** | Muted mauve and lilac on warm white | `#8474A1` / `#A697C4` | `#A67F98` / `#C29EB5` | `#FAF8FC` / `#1B1822` |
| **Terracotta** | Warm clay and sand on linen | `#B5725C` / `#D4937D` | `#9E8B76` / `#B8A693` | `#FCF9F6` / `#1F1A18` |

<details>
<summary><strong>Ocean (coastal blue and cool grey): Copy CSS</strong></summary>

```css
/* Light Mode */
:root {
  --eta-bg-base: #F6F9FC;
  --eta-bg-surface: #EDF3F8;
  --eta-bg-subtle: #E1EAF2;
  --eta-bg-hover: #D5E1EC;

  --eta-color-primary: #5B82A6;
  --eta-color-primary-hover: #476A8A;
  --eta-color-primary-subtle: rgba(91, 130, 166, 0.12);
  --eta-color-primary-focus: rgba(91, 130, 166, 0.25);

  --eta-color-secondary: #6C9A9B;
  --eta-color-secondary-hover: #578283;
  --eta-color-secondary-subtle: rgba(108, 154, 155, 0.12);

  --eta-border-default: #DAE3EC;
  --eta-border-focus: #5B82A6;
}

/* Dark Mode */
[data-theme="dark"],
.dark {
  --eta-bg-base: #151B23;
  --eta-bg-surface: #1E2631;
  --eta-bg-subtle: #283240;
  --eta-bg-hover: #323E4F;

  --eta-color-primary: #7FA6C9;
  --eta-color-primary-hover: #96B8D6;
  --eta-color-primary-subtle: rgba(127, 166, 201, 0.18);
  --eta-color-primary-focus: rgba(127, 166, 201, 0.35);

  --eta-color-secondary: #8AB6B7;
  --eta-color-secondary-hover: #A1C6C7;
  --eta-color-secondary-subtle: rgba(138, 182, 183, 0.18);

  --eta-border-default: #2D3846;
  --eta-border-focus: #7FA6C9;
}
```
</details>

<details>
<summary><strong>Lavender (muted mauve and lilac): Copy CSS</strong></summary>

```css
/* Light Mode */
:root {
  --eta-bg-base: #FAF8FC;
  --eta-bg-surface: #F3EFF8;
  --eta-bg-subtle: #E9E2F1;
  --eta-bg-hover: #DFD6EA;

  --eta-color-primary: #8474A1;
  --eta-color-primary-hover: #6D5D8A;
  --eta-color-primary-subtle: rgba(132, 116, 161, 0.12);
  --eta-color-primary-focus: rgba(132, 116, 161, 0.25);

  --eta-color-secondary: #A67F98;
  --eta-color-secondary-hover: #8E6981;
  --eta-color-secondary-subtle: rgba(166, 127, 152, 0.12);

  --eta-border-default: #E3DCEB;
  --eta-border-focus: #8474A1;
}

/* Dark Mode */
[data-theme="dark"],
.dark {
  --eta-bg-base: #1B1822;
  --eta-bg-surface: #25212F;
  --eta-bg-subtle: #302B3D;
  --eta-bg-hover: #3B354B;

  --eta-color-primary: #A697C4;
  --eta-color-primary-hover: #B8ABD2;
  --eta-color-primary-subtle: rgba(166, 151, 196, 0.18);
  --eta-color-primary-focus: rgba(166, 151, 196, 0.35);

  --eta-color-secondary: #C29EB5;
  --eta-color-secondary-hover: #D1B2C6;
  --eta-color-secondary-subtle: rgba(194, 158, 181, 0.18);

  --eta-border-default: #353042;
  --eta-border-focus: #A697C4;
}
```
</details>

<details>
<summary><strong>Terracotta (warm clay and linen sand): Copy CSS</strong></summary>

```css
/* Light Mode */
:root {
  --eta-bg-base: #FCF9F6;
  --eta-bg-surface: #F6EFEA;
  --eta-bg-subtle: #EDE3DC;
  --eta-bg-hover: #E4D7CE;

  --eta-color-primary: #B5725C;
  --eta-color-primary-hover: #9B5D48;
  --eta-color-primary-subtle: rgba(181, 114, 92, 0.12);
  --eta-color-primary-focus: rgba(181, 114, 92, 0.25);

  --eta-color-secondary: #9E8B76;
  --eta-color-secondary-hover: #867460;
  --eta-color-secondary-subtle: rgba(158, 139, 118, 0.12);

  --eta-border-default: #E7DCD4;
  --eta-border-focus: #B5725C;
}

/* Dark Mode */
[data-theme="dark"],
.dark {
  --eta-bg-base: #1F1A18;
  --eta-bg-surface: #2A2320;
  --eta-bg-subtle: #362E2A;
  --eta-bg-hover: #423833;

  --eta-color-primary: #D4937D;
  --eta-color-primary-hover: #E0A895;
  --eta-color-primary-subtle: rgba(212, 147, 125, 0.18);
  --eta-color-primary-focus: rgba(212, 147, 125, 0.35);

  --eta-color-secondary: #B8A693;
  --eta-color-secondary-hover: #C8B8A7;
  --eta-color-secondary-subtle: rgba(184, 166, 147, 0.18);

  --eta-border-default: #3B322E;
  --eta-border-focus: #D4937D;
}
```
</details>

---

### 2. High-Saturation Palettes (WCAG 2.1 AA >= 4.5:1)

These four presets pair high-saturation primary colors with slate and off-white surfaces. Each combination (`solid` buttons with inverse text, `soft` variant buttons over 12% and 16% subtle fills, `outline` borders, and body text) passes `@storybook/addon-a11y` color-contrast checks without relying on pure `#FFFFFF` or `#000000`.

| Preset | Palette Description | Primary (Light / Dark) | Secondary (Light / Dark) | Base Surface (Light / Dark) | Min. Contrast |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Cobalt** | Deep blue on cool slate | `#1D4ED8` / `#60A5FA` | `#0369A1` / `#38BDF8` | `#F8FAFC` / `#0B1120` | `4.56:1` (L) / `4.92:1` (D) |
| **Emerald** | Forest green on mint-tinted slate | `#047253` / `#34D399` | `#0D6E66` / `#2DD4BF` | `#F6FBF9` / `#0C1914` | `4.58:1` (L) / `5.70:1` (D) |
| **Crimson** | Ruby red on warm quartz | `#BE123C` / `#FB7185` | `#9D174D` / `#F472B6` | `#FCF8F9` / `#191013` | `4.67:1` (L) / `4.90:1` (D) |
| **Violet** | Deep purple on cool iris | `#5B21B6` / `#A78BFA` | `#6D28D9` / `#C084FC` | `#F9F8FE` / `#13101C` | `5.20:1` (L) / `4.82:1` (D) |

<details>
<summary><strong>Cobalt (deep blue on cool slate): Copy CSS</strong></summary>

```css
/* Light Mode */
:root {
  --eta-bg-base: #F8FAFC;
  --eta-bg-surface: #F1F5F9;
  --eta-bg-subtle: #E2E8F0;
  --eta-bg-hover: #CBD5E1;

  --eta-color-primary: #1D4ED8;
  --eta-color-primary-hover: #1E40AF;
  --eta-color-primary-subtle: rgba(29, 78, 216, 0.12);
  --eta-color-primary-focus: rgba(29, 78, 216, 0.28);

  --eta-color-secondary: #0369A1;
  --eta-color-secondary-hover: #075985;
  --eta-color-secondary-subtle: rgba(3, 105, 161, 0.12);

  --eta-text-heading: #0F172A;
  --eta-text-body: #334155;
  --eta-text-muted: #475569;
  --eta-text-inverse: #F8FAFC;

  --eta-border-default: #CBD5E1;
  --eta-border-focus: #1D4ED8;
}

/* Dark Mode */
[data-theme="dark"],
.dark {
  --eta-bg-base: #0B1120;
  --eta-bg-surface: #151F32;
  --eta-bg-subtle: #1E293B;
  --eta-bg-hover: #334155;

  --eta-color-primary: #60A5FA;
  --eta-color-primary-hover: #93C5FD;
  --eta-color-primary-subtle: rgba(96, 165, 250, 0.16);
  --eta-color-primary-focus: rgba(96, 165, 250, 0.35);

  --eta-color-secondary: #38BDF8;
  --eta-color-secondary-hover: #7DD3FC;
  --eta-color-secondary-subtle: rgba(56, 189, 248, 0.16);

  --eta-text-heading: #F8FAFC;
  --eta-text-body: #CBD5E1;
  --eta-text-muted: #94A3B8;
  --eta-text-inverse: #0B1120;

  --eta-border-default: #26354D;
  --eta-border-focus: #60A5FA;
}
```
</details>

<details>
<summary><strong>Emerald (forest green on mint-tinted slate): Copy CSS</strong></summary>

```css
/* Light Mode */
:root {
  --eta-bg-base: #F6FBF9;
  --eta-bg-surface: #EDF7F2;
  --eta-bg-subtle: #DCECE3;
  --eta-bg-hover: #C6DFD2;

  --eta-color-primary: #047253;
  --eta-color-primary-hover: #065F46;
  --eta-color-primary-subtle: rgba(4, 114, 83, 0.12);
  --eta-color-primary-focus: rgba(4, 114, 83, 0.28);

  --eta-color-secondary: #0D6E66;
  --eta-color-secondary-hover: #115E59;
  --eta-color-secondary-subtle: rgba(13, 110, 102, 0.12);

  --eta-text-heading: #062C22;
  --eta-text-body: #1F4B3F;
  --eta-text-muted: #3B695C;
  --eta-text-inverse: #F6FBF9;

  --eta-border-default: #C6DFD2;
  --eta-border-focus: #047253;
}

/* Dark Mode */
[data-theme="dark"],
.dark {
  --eta-bg-base: #0C1914;
  --eta-bg-surface: #142921;
  --eta-bg-subtle: #1E3A2F;
  --eta-bg-hover: #294D3F;

  --eta-color-primary: #34D399;
  --eta-color-primary-hover: #6EE7B7;
  --eta-color-primary-subtle: rgba(52, 211, 153, 0.16);
  --eta-color-primary-focus: rgba(52, 211, 153, 0.35);

  --eta-color-secondary: #2DD4BF;
  --eta-color-secondary-hover: #5EEAD4;
  --eta-color-secondary-subtle: rgba(45, 212, 191, 0.16);

  --eta-text-heading: #ECFDF5;
  --eta-text-body: #A7F3D0;
  --eta-text-muted: #86EFAC;
  --eta-text-inverse: #0C1914;

  --eta-border-default: #234236;
  --eta-border-focus: #34D399;
}
```
</details>

<details>
<summary><strong>Crimson (ruby red on warm quartz): Copy CSS</strong></summary>

```css
/* Light Mode */
:root {
  --eta-bg-base: #FCF8F9;
  --eta-bg-surface: #FFF1F2;
  --eta-bg-subtle: #FFE4E6;
  --eta-bg-hover: #FECDD3;

  --eta-color-primary: #BE123C;
  --eta-color-primary-hover: #9F1239;
  --eta-color-primary-subtle: rgba(190, 18, 60, 0.12);
  --eta-color-primary-focus: rgba(190, 18, 60, 0.28);

  --eta-color-secondary: #9D174D;
  --eta-color-secondary-hover: #831843;
  --eta-color-secondary-subtle: rgba(157, 23, 77, 0.12);

  --eta-text-heading: #2A0A12;
  --eta-text-body: #4C1D29;
  --eta-text-muted: #6E3B49;
  --eta-text-inverse: #FCF8F9;

  --eta-border-default: #F5D0D6;
  --eta-border-focus: #BE123C;
}

/* Dark Mode */
[data-theme="dark"],
.dark {
  --eta-bg-base: #191013;
  --eta-bg-surface: #26181D;
  --eta-bg-subtle: #362229;
  --eta-bg-hover: #472D36;

  --eta-color-primary: #FB7185;
  --eta-color-primary-hover: #FDA4AF;
  --eta-color-primary-subtle: rgba(251, 113, 133, 0.16);
  --eta-color-primary-focus: rgba(251, 113, 133, 0.35);

  --eta-color-secondary: #F472B6;
  --eta-color-secondary-hover: #F9A8D4;
  --eta-color-secondary-subtle: rgba(244, 114, 182, 0.16);

  --eta-text-heading: #FFF1F2;
  --eta-text-body: #FECDD3;
  --eta-text-muted: #FDA4AF;
  --eta-text-inverse: #191013;

  --eta-border-default: #3D262E;
  --eta-border-focus: #FB7185;
}
```
</details>

<details>
<summary><strong>Violet (deep purple on cool iris): Copy CSS</strong></summary>

```css
/* Light Mode */
:root {
  --eta-bg-base: #F9F8FE;
  --eta-bg-surface: #F3EFFE;
  --eta-bg-subtle: #E9E3FC;
  --eta-bg-hover: #DDD6FE;

  --eta-color-primary: #5B21B6;
  --eta-color-primary-hover: #4C1D95;
  --eta-color-primary-subtle: rgba(91, 33, 182, 0.12);
  --eta-color-primary-focus: rgba(91, 33, 182, 0.28);

  --eta-color-secondary: #6D28D9;
  --eta-color-secondary-hover: #5B21B6;
  --eta-color-secondary-subtle: rgba(109, 40, 217, 0.12);

  --eta-text-heading: #1E1035;
  --eta-text-body: #3B275E;
  --eta-text-muted: #58427C;
  --eta-text-inverse: #F9F8FE;

  --eta-border-default: #D8D0F5;
  --eta-border-focus: #5B21B6;
}

/* Dark Mode */
[data-theme="dark"],
.dark {
  --eta-bg-base: #13101C;
  --eta-bg-surface: #1E192D;
  --eta-bg-subtle: #2B2440;
  --eta-bg-hover: #393054;

  --eta-color-primary: #A78BFA;
  --eta-color-primary-hover: #C4B5FD;
  --eta-color-primary-subtle: rgba(167, 139, 250, 0.16);
  --eta-color-primary-focus: rgba(167, 139, 250, 0.35);

  --eta-color-secondary: #C084FC;
  --eta-color-secondary-hover: #D8B4FE;
  --eta-color-secondary-subtle: rgba(192, 132, 252, 0.16);

  --eta-text-heading: #F5F3FF;
  --eta-text-body: #DDD6FE;
  --eta-text-muted: #C4B5FD;
  --eta-text-inverse: #13101C;

  --eta-border-default: #312949;
  --eta-border-focus: #A78BFA;
}
```
</details>

---

## Component Catalog

### Core Primitives

| Component | Description |
| :--- | :--- |
| `Button`, `IconButton` | `solid`, `soft`, `outline`, and `ghost` variants with semantic colors, loading spinner, and `asChild` support |
| `Input`, `Textarea` | Text fields with left/right adornments, character counter, auto-resize, and validation states |
| `Checkbox`, `Radio`, `RadioGroup`, `Switch` | Selection controls with keyboard roving focus and custom SVG indicators |
| `Badge`, `Avatar`, `AvatarGroup` | Status badges, user avatars with initials fallback, and stacked avatar groups |
| `Card` | Surface container with `CardHeader`, `CardTitle`, `CardDescription`, `CardBody`, and `CardFooter` |
| `Heading`, `Text`, `Container`, `Divider` | Typography elements, max-width layout wrapper, and horizontal or vertical dividers |
| `Sidebar`, `SidebarProvider`, `SidebarTrigger` | Responsive compound application sidebar with icon-rail collapse, floating, and mobile drawer modes |
| `ScrollArea`, `ScrollBar` | Custom smooth scroll container built on `@radix-ui/react-scroll-area` with Soft UI styling |
| `AspectRatio` | Container preserving fixed aspect ratios (`16:9`, `4:3`, `1:1`) to eliminate layout shifts |
| `ThemeProvider`, `useTheme`, `ThemeToggle` | Context provider, hook, and toggle control for light, dark, and system themes |

### Feedback

| Component | Description |
| :--- | :--- |
| `Alert` | Status callouts for `info`, `success`, `warning`, and `error` messages |
| `Progress`, `CircularProgress` | Linear and circular progress indicators with determinate and indeterminate states |
| `Spinner` | SVG loading spinner with configurable size and color tokens |
| `Skeleton`, `SkeletonText`, `SkeletonCircle` | Shimmer and pulse loading placeholders |
| `Toast`, `useToast` | Transient notifications built on `@radix-ui/react-toast` with six viewport positions |
| `EmptyState` | Placeholder layout with icon slot, title, description, and action buttons |

### Overlays

| Component | Description |
| :--- | :--- |
| `Dialog` | Modal dialog with backdrop blur, focus trap, and Escape key dismissal |
| `AlertDialog` | Confirmation modal that requires an explicit confirm or cancel action |
| `Drawer` | Slide-out panel anchored to `right`, `left`, `top`, or `bottom` |
| `Tooltip` | Hover and focus helper label with `dark` and `soft` variants |
| `Popover` | Floating content panel with optional header, body, and footer slots |
| `HoverCard` | Preview card triggered on pointer hover or keyboard focus |
| `ContextMenu` | Right-click contextual action menu built on `@radix-ui/react-context-menu` |
| `Command` | Searchable command palette (`Cmd+K`) with grouped items and keyboard navigation |

### Navigation and Disclosure

| Component | Description |
| :--- | :--- |
| `Tabs` | Segmented, underlined, and outlined tab bars with arrow-key navigation |
| `Accordion` | Single or multi-panel collapsible sections |
| `Collapsible` | Single expandable disclosure primitive |
| `Breadcrumb` | Hierarchical path links with `asChild` router integration |
| `Pagination` | Page navigation controls with ellipsis truncation and `asChild` link support |
| `Menubar` | Desktop-grade application menu bar built on `@radix-ui/react-menubar` with submenus and shortcuts |
| `TreeView`, `TreeItem` | Accessible hierarchical tree view for nested files, folders, and category structures |
| `Stepper` | Horizontal and vertical multi-step progress indicator |

### Forms and Data Display

| Component | Description |
| :--- | :--- |
| `FormField`, `useFormField` | Field wrapper that links `FormLabel`, `FormHelperText`, and `FormErrorMessage` via ARIA attributes |
| `Select` | Custom select menu with grouped options and scroll buttons |
| `Combobox` | Searchable autocomplete select supporting single and multiple values |
| `DatePicker` | Calendar popover date selector with min/max bounds and locale formatting |
| `NumberInput` | Numeric input with step buttons and Up/Down arrow key handling |
| `PinInput` | Multi-slot verification code input with auto-advance and clipboard paste support |
| `ToggleGroup` | Single or multiple segmented toggle buttons built on `@radix-ui/react-toggle-group` |
| `Slider` | Single-thumb and range sliders |
| `Rating` | Interactive star rating component with half-precision, keyboard control, and read-only states |
| `DropdownMenu` | Action menu with nested submenus, checkbox items, and radio groups |
| `Table` | Data table with sortable columns and empty state display |
| `FileDropzone` | Drag-and-drop file uploader with MIME type and size validation |
| `Tag` | Interactive chip with optional remove button (`onRemove`) and selection state |
| `Timeline` | Vertical chronological feed for events and activity logs |
| `Stat` | Metric card displaying a label, value, helper text, and trend indicator (`up`, `down`, `neutral`) |
| `Code`, `CodeBlock` | Inline code span and multi-line code block with line numbers and copy button |

---

## Interactive Documentation (Storybook)

Run Storybook locally to inspect component props, test keyboard interactions, and run accessibility checks:

```bash
npm run storybook
```

Storybook starts at `http://localhost:6006`.

---

## License

MIT &copy; [mhambali920](https://github.com/mhambali920)
