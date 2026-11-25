---
'@eta-ui/react': minor
---

Add Next.js App Router and Tailwind CSS v4 compatibility: scope component CSS Modules class names in `tsup`, ship `@eta-ui/react/styles.layer.css` with `@layer base` and `@layer components`, prepend `"use client"` module directives, add SSR `<ThemeScript />` anti-flicker helper, and expose `--eta-font-sans` for `next/font` integration.
