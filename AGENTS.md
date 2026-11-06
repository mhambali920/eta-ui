# AGENTS.md - Autonomous Vibe Coding Protocol for eta-ui

This document defines the autonomous protocol for AI agents working in this repository.

## 🤖 Core Philosophy: Zero-Confirmation Autonomous Execution
- **Execute end-to-end**: When instructed to implement or advance goals, execute autonomously without pausing to ask confirmation for intermediate steps (e.g. creating files, running tests, refactoring, fixing errors).
- **No Confirmation for Lightweight Operations**: DILARANG meminta konfirmasi bolak-balik hanya untuk menjalankan perintah-perintah ringan (seperti `npm test`, `vitest`, `npx tsc`, `tsup`, `node scripts/*`, `node scripts/scaffold-component.mjs *`, `node scripts/verify-component.mjs *`, linting, formatting, atau verifikasi build). Lakukan seluruh perintah tersebut secara mandiri dan otomatis.
- **Self-Healing Loop**: If a test or build fails, read the terminal output, identify the cause, fix the code, and re-test until green. Never ask the user "how should I fix this?" for standard code/syntax/type errors.
- **Destructive Action Boundary**: Minta konfirmasi HANYA jika hendak melakukan tindakan yang berpotensi merusak (*destructive actions*), seperti menghapus file/direktori penting pengguna (`rm`), membersihkan riwayat git, atau aksi non-reversible lainnya.
- **Strict Git Boundary**: **NEVER run `git commit`** unless explicitly requested in the user prompt. Leave changes uncommitted for user review.

---

## 🎯 Per-Component Goal Workflow
Each UI component is an atomic goal tracked in `GOALS.md`. To implement a component:

1. **Read Goal Specification**: Check the target component specifications in `GOALS.md` and `Rencana Pengembangan & Spesifikasi Teknis_ eta-ui (Soft UI Kit).md`.
2. **Scaffold / Create Files**:
   - `src/components/<ComponentName>/<ComponentName>.tsx`
   - `src/components/<ComponentName>/<ComponentName>.module.css`
   - `src/components/<ComponentName>/<ComponentName>.test.tsx`
   - `src/components/<ComponentName>/<ComponentName>.stories.tsx`
   - `src/components/<ComponentName>/index.ts`
3. **Apply Soft UI Tokens**:
   - Use CSS variables (`--eta-bg-base`, `--eta-color-primary`, `--eta-radius-*`, `--eta-shadow-*`).
   - Never hardcode pure `#000000` or `#ffffff`.
   - Ensure WCAG AA accessible contrast ratio (>= 4.5:1).
   - Support dark mode automatically.
4. **Export in Barrel**:
   - Add export to `src/index.ts`.
5. **Run Verification Command**:
   ```bash
   node scripts/verify-component.mjs <ComponentName>
   ```
6. **Update Tracking**:
   - Mark `[x] COMPLETED` in `GOALS.md`.
7. **Report**:
   - Provide a concise summary of what was built and verified.
