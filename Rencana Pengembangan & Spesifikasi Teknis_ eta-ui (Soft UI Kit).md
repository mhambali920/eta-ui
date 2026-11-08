# **Rencana Pengembangan & Spesifikasi Teknis: eta-ui**

**Nama Package NPM:** `eta-ui`  
**Tema Visual:** Soft / Muted Pastel UI Kit (WCAG AA Accessible)  
**Target Ekosistem:** React (\>= 18.0.0) \+ TypeScript \+ CSS Variables

# **1\. Ringkasan Eksekutif & Visi Produk**

eta-ui adalah pustaka komponen antarmuka pengguna (UI Kit) modern yang didesain khusus dengan estetika warna lembut (soft color scheme). Fokus utama eta-ui adalah memberikan pengalaman visual yang tenang, ramah mata, dan tetap memenuhi standar aksesibilitas WCAG AA (rasio kontras minimal 4.5:1 untuk teks normal), sekaligus menawarkan performa tinggi (tree-shakeable, ukuran bundle ringan, dan dukungan TypeScript penuh).

## **Prinsip Desain Utama**

* Soft & Calming Aesthetics: Menghindari warna putih murni (\#FFFFFF) dan hitam pekat (\#000000) untuk mengurangi ketegangan mata (eye strain).  
* Accessible by Default: Dibangun di atas headless primitives (Radix UI) sehingga navigasi keyboard, screen reader, dan focus management langsung berfungsi otomatis.  
* Zero-Config & Mudah Dikustomisasi: Seluruh token warna dan geometri berbasis CSS Variables (--eta-\*) sehingga pengguna dapat mengubah tema atau mengaktifkan Dark Mode tanpa kompilasi ulang.

# **2\. Sistem Token & Fondasi Desain (Soft Color Scheme)**

Seluruh token di dalam eta-ui menggunakan prefix \--eta- untuk mencegah bentrok (collision) dengan stylesheet proyek pengguna.

## **2.1 Tabel Palet Warna Utama (Light & Dark Mode)**

| Kategori Token | Nama CSS Variable | Nilai Light Mode (Hex) | Nilai Dark Mode (Hex) | Kegunaan Utama |
| :---- | :---- | :---- | :---- | :---- |
| Background Base | `--eta-bg-base` | `#FAF9F6` (Warm Alabaster) | `#181A20` (Deep Slate) | Latar belakang utama halaman |
| Surface / Card | `--eta-bg-surface` | `#F3F1ED` (Soft Sand) | `#22252E` (Muted Charcoal) | Latar komponen Card, Modal, dan Panel |
| Surface Subtle | `--eta-bg-subtle` | `#EAE6DF` (Warm Stone) | `#2C303B` (Soft Graphite) | Hover state pada elemen netral / latar input |
| Primary Accent | `--eta-color-primary` | `#6B9080` (Sage Green) | `#84A98C` (Soft Mint) | Tombol utama, status aktif, focus ring |
| Primary Hover | `--eta-color-primary-hover` | `#557567` (Deep Sage) | `#95B89D` (Light Sage) | State hover untuk elemen Primary |
| Secondary Accent | `--eta-color-secondary` | `#7E99A3` (Dusty Blue) | `#9BB1BC` (Muted Sky) | Elemen sekunder, link, dan badge informatif |
| Text Heading | `--eta-text-heading` | `#2B2D42` (Charcoal Ink) | `#EDF2F4` (Soft Cloud) | Judul dan teks berhirarki tinggi |
| Text Body | `--eta-text-body` | `#5C6070` (Slate Grey) | `#B8C0CC` (Muted Silver) | Teks paragraf utama dan label form |
| Text Muted | `--eta-text-muted` | `#8D99AE` (Cool Grey) | `#7D8597` (Dim Slate) | Placeholder, caption, dan teks non-aktif |
| Border Default | `--eta-border-default` | `#E5E3DC` (Soft Hairline) | `#323642` (Dark Hairline) | Garis pembatas card, input, dan tabel |

## **2.2 Tabel Warna Semantik (Status & Feedback)**

| Status | CSS Variable Latar & Teks | Light Mode (Bg / Text) | Dark Mode (Bg / Text) |
| :---- | :---- | :---- | :---- |
| Success | `--eta-status-success-bg` / `--eta-status-success-text` | Bg: `#D8F3DC` / Text: `#1B4332` | Bg: `rgba(82, 183, 136, 0.16)` / Text: `#95D5B2` |
| Warning | `--eta-status-warning-bg` / `--eta-status-warning-text` | Bg: `#FFF3B0` / Text: `#7F4F24` | Bg: `rgba(255, 209, 102, 0.16)` / Text: `#FFE082` |
| Error / Danger | `--eta-status-error-bg` / `--eta-status-error-text` | Bg: `#FFCAD4` / Text: `#641220` | Bg: `rgba(255, 133, 161, 0.16)` / Text: `#FFCCD5` |
| Info | `--eta-status-info-bg` / `--eta-status-info-text` | Bg: `#D8E2DC` / Text: `#1D3557` | Bg: `rgba(142, 202, 230, 0.16)` / Text: `#BAE6FD` |

## **2.3 Geometri, Radius, dan Elevasi**

* **Border Radius:**  
  * `--eta-radius-sm`: `6px` (Checkbox, Tag kecil)  
  * `--eta-radius-md`: `8px` (Button, Input, Select)  
  * `--eta-radius-lg`: `12px` (Card, Modal, Alert)  
  * `--eta-radius-full`: `9999px` (Badge Pill, Avatar, Switch)  
* **Box Shadow (Diffused Soft Elevation):**  
  * `--eta-shadow-sm`: `0 2px 8px -2px rgba(43, 45, 66, 0.05)`  
  * `--eta-shadow-md`: `0 8px 24px -4px rgba(43, 45, 66, 0.06)`  
  * `--eta-shadow-lg`: `0 16px 36px -6px rgba(43, 45, 66, 0.08)`

## **2.4 Arsitektur & Strategi Dark Mode**

`eta-ui` mendukung 3 mode tema: `light`, `dark`, dan `system` (mengikuti preferensi OS pengguna melalui `prefers-color-scheme: dark`).

* **Selector Tema Fleksibel:** Variabel Dark Mode diaktifkan secara otomatis melalui atribut `[data-theme="dark"]` atau class `.dark` pada elemen `<html>` / `<body>`.  
* **Automatic System Fallback:** Jika pengguna memilih mode `system` (atau belum menentukan atribut), CSS `@media (prefers-color-scheme: dark)` akan menerapkan palet *Soft Dark* pada `:root:not([data-theme="light"])`.  
* **Komponen `ThemeProvider` & Hook `useTheme()`:** Menyediakan *context* React bawaan untuk mengganti tema secara dinamis, menyimpan preferensi ke `localStorage` (`eta-ui-theme`), dan mencegah *flash of unstyled content* (FOUC) pada aplikasi SSR (Next.js/Remix).  
* **Koreksi Elevasi di Dark Mode:** Pada Dark Mode, *box-shadow* disesuaikan dengan *subtle border highlight* (`1px solid var(--eta-border-default)`) dan bayangan yang lebih pekat agar pemisahan antar *surface* (`#181A20` ke `#22252E`) tetap terlihat jelas namun tetap lembut di mata.

# **3\. Arsitektur Teknis & Struktur Direktori**

## **3.1 Tech Stack**

* **Core Library:** React 18+ & TypeScript 5+  
* **Headless A11y Primitives:** `@radix-ui/react-*`  
* **Styling Engine:** Native CSS (CSS Modules \+ CSS Variables) \+ `clsx` / `class-variance-authority` (CVA) untuk manajemen varian komponen yang terisolasi dan *zero-config*.  
* **Bundler:** `tsup` (berbasis esbuild) untuk kompilasi super cepat ke format ESM (`.mjs`), CommonJS (`.cjs`), dan Type Declarations (`.d.ts`).  
* **Dokumentasi & Sandbox:** Storybook 8 \+ `@storybook/addon-a11y`.  
* **Unit Testing:** Vitest \+ React Testing Library.

## **3.2 Struktur Folder Proyek (`eta-ui`)**

```
eta-ui/
├── .changeset/              # Konfigurasi manajemen versi & changelog otomatis
├── .github/workflows/       # Pipeline CI/CD (test.yml, release.yml)
├── .storybook/              # Konfigurasi Storybook & preview tema soft
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   ├── Button.test.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   ├── Input/
│   │   ├── Card/
│   │   └── ...
│   ├── theme/
│   │   ├── ThemeProvider.tsx
│   │   └── useTheme.ts
│   ├── styles/
│   │   ├── tokens.css       # Definisi variabel --eta-* (Light & Dark)
│   │   └── reset.css        # Scoped CSS normalizer
│   ├── utils/
│   │   └── cn.ts            # Helper penggabung className
│   └── index.ts             # Barrel export seluruh komponen & tipe
├── package.json
├── tsconfig.json
├── tsup.config.ts
└── README.md
```

# **4\. Roadmap Pengembangan Komponen (Bertahap)**

## **Fase 1: Core Primitives (Target Rilis `v0.1.0` \- MVP)**

1. **Button & IconButton:** Varian `solid`, `soft` (tinted), `outline`, `ghost`; ukuran `sm`, `md`, `lg`; dukungan state `isLoading` dan `disabled`.  
2. **Form Inputs:** `Input`, `Textarea`, `Checkbox`, `Radio`, dan `Switch` dengan efek *focus ring* lembut (`0 0 0 3px rgba(107, 144, 128, 0.25)`).  
3. **Data Display Dasar:** `Badge`, `Avatar` (dengan *fallback* inisial), `Card` (`CardHeader`, `CardBody`, `CardFooter`).  
4. **Typography & Layout:** `Heading`, `Text`, `Divider`, dan `Container`.  
5. **Theme & Dark Mode System:** `ThemeProvider`, hook `useTheme()`, dan komponen siap pakai `ThemeToggle` (tombol peralihan Light/Dark/System dengan animasi ikon halus).

## **Fase 2: Feedback & Navigasi (Target Rilis `v0.2.0`)**

1. **Feedback:** `Alert` / `Callout`, `Toast` (Notifikasi mengambang), `Spinner`, dan `Skeleton` (efek *shimmer* pastel yang halus).  
2. **Overlay:** `Modal` / `Dialog`, `Drawer` / `Sheet`, `Tooltip`, dan `Popover`.  
3. **Navigasi:** `Tabs`, `Accordion`, dan `Breadcrumb`.

## **Fase 3: Komponen Lanjutan & Kompleks (Target Rilis `v1.0.0`)**

1. **Form Lanjutan:** `Select`, `Slider`, dan `FileDropzone`.  
2. **Data & Struktur:** `Table` (dengan state kosong & sorting), `Pagination`, dan `DropdownMenu`.

## **Fase 4: Extended Form Controls, Feedback & Inputs (Target Rilis `v1.1.0`)**

1. **Form Wrappers & Inputs Khusus:** `FormField` (`FormLabel`, `FormHelperText`, `FormErrorMessage`), `NumberInput`, `PinInput` (OTP), `Combobox` (Autocomplete), dan `DatePicker` / `Calendar`.  
2. **Progress & Selection Chips:** `Progress` & `CircularProgress`, `Tag` / `Chip` (dismissible & filterable), serta `Toggle` & `ToggleGroup` (Segmented Control).

## **Fase 5: Advanced Disclosure, Data Display & Spotlight (Target Rilis `v1.2.0`)**

1. **Disclosure & Overlay Lanjutan:** `AlertDialog` (konfirmasi aksi destruktif), `HoverCard` (preview konten saat hover), dan `Collapsible`.  
2. **Workflow & Data Visualization:** `Stepper` (multi-step wizard), `Timeline` (kronologi aktivitas), `Stat` (kartu metrik/KPI dashboard), dan `EmptyState`.  
3. **Developer & Power-User Primitives:** `Code` / `CodeBlock` & `Kbd` (keyboard shortcut badge), serta `Command` (Command Palette / Spotlight `⌘K`).

# **5\. Konfigurasi Build & Publikasi ke NPM**

## **5.1 Spesifikasi `package.json`**

Berikut adalah konfigurasi standar untuk memastikan `eta-ui` mendukung *tree-shaking*, kompatibel dengan SSR (Next.js/Remix), dan hanya mengunggah file produksi ke NPM:

```
{
  "name": "eta-ui",
  "version": "0.1.0",
  "description": "Accessible React UI Kit with a calming soft color scheme",
  "keywords": ["react", "ui-kit", "design-system", "soft-ui", "pastel", "component-library", "eta-ui"],
  "license": "MIT",
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "sideEffects": ["**/*.css"],
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ],
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.mjs"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./styles.css": "./dist/index.css"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint src --ext .ts,.tsx",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "storybook": "storybook dev -p 6006",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "npm run build && changeset publish"
  }
}
```

## **5.2 Konfigurasi Bundler (`tsup.config.ts`)**

```
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  minify: true,
});
```

# **6\. Alur Rilis (Release Checklist) & Otomatisasi CI/CD**

1. **Verifikasi Nama di NPM:** Pastikan nama `eta-ui` tersedia dengan menjalankan `npm view eta-ui` di terminal (jika sudah terpakai, alternatif gunakan *scope* organisasi seperti `@eta-ui/react`).  
2. **Quality Gate Sebelum Merge:**  
   * Seluruh pengujian unit (`npm test`) dan validasi tipe (`npm run typecheck`) lulus 100%.  
   * Audit kontras warna di Storybook (`@storybook/addon-a11y`) tidak menunjukkan pelanggaran (0 violations).  
3. **Manajemen Versi dengan Changesets:**  
   * Jalankan `npx changeset` setiap kali membuat fitur atau perbaikan komponen.  
   * Pilih tipe semver (`patch`, `minor`, atau `major`) dan tuliskan ringkasan perubahan.  
4. **Publikasi Otomatis via GitHub Actions:**  
   * Simpan token akses NPM (`NPM_TOKEN` dengan tipe *Automation*) di **GitHub Repository Secrets**.  
   * Gunakan `changesets/action@v1` pada workflow `.github/workflows/release.yml` untuk membuat *Version Packages PR* secara otomatis dan mempublikasikan `eta-ui` ke registri NPM begitu PR digabungkan ke branch `main`.  
5. **Cara Penggunaan oleh Konsumen (Contoh di `README.md`):**

```
import { Button, Card } from 'eta-ui';
import 'eta-ui/styles.css';

export default function App() {
  return (
    <Card>
      <Button variant="soft">Simpan Perubahan</Button>
    </Card>
  );
}
```

