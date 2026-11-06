# eta-ui

> Accessible React UI Kit with a calming soft color scheme (WCAG AA Compliant).

Built on top of Headless primitives, CSS Variables (`--eta-*`), TypeScript, and zero-runtime CSS modules.

## Installation

```bash
npm install eta-ui
```

## Quick Start

Import styles once in your root layout:
```tsx
import 'eta-ui/styles.css';
import { ThemeProvider, Button, Input, Textarea } from 'eta-ui';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <Button variant="soft" size="md">
        Simpan Perubahan
      </Button>

      <Input
        placeholder="Cari sesuatu..."
        leftAdornment={<span>🔍</span>}
      />

      <Textarea
        placeholder="Tulis catatan Anda..."
        resize="vertical"
      />
    </ThemeProvider>
  );
}
```

## Autonomous Workflow & Automation
This repository contains an automated component development pipeline:
- `GOALS.md`: Tracks goals per UI component.
- `AGENTS.md`: Agent protocol for uninterrupted autonomous vibe coding.
- `scripts/verify-component.mjs`: Automated TypeScript, Vitest, and bundler verification runner per component.
- `scripts/scaffold-component.mjs`: Component generator.

## Storybook & Dokumentasi Komponen
Untuk melihat, menguji interaktivitas, dan melakukan audit aksesibilitas (a11y) seluruh komponen di Storybook 8:
```bash
npm run storybook
```
Buka browser di `http://localhost:6006`.

### Verification
```bash
# Verify single component
node scripts/verify-component.mjs Button
node scripts/verify-component.mjs Input
node scripts/verify-component.mjs Textarea

# Verify full project
npm run verify:all
```
