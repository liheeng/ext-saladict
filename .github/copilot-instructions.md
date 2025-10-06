# Copilot Instructions for Saladict

## Project Overview
- **Saladict** is a browser extension (Chrome/Firefox) for inline translation and dictionary lookup, with PDF support and a highly interactive UI.
- The codebase is TypeScript-first, using React for UI, Webpack for bundling, and Jest for testing.
- Major directories:
  - `src/` — Main source code, including helpers, components, background scripts, content scripts, and configuration.
  - `assets/` — Static assets and injected scripts.
  - `scripts/` — Build, test, and utility scripts.
  - `test/` — Test helpers and specs.

## Architecture & Patterns
- **WebExtension Structure:**
  - `src/background/` — Background scripts (event listeners, context menus, PDF sniffer, etc.)
  - `src/content/` — Content scripts injected into web pages.
  - `src/components/` — React components, including dictionary UIs.
  - `src/app-config/` — Centralized configuration (dictionaries, profiles, context menus).
  - `src/_helpers/` — Shared utilities (browser API, DOM, i18n, observables, etc.)
- **Dictionaries:**
  - Each dictionary is a subfolder in `src/components/dictionaries/`.
  - Must export `getSrcPage` and `search` in `engine.ts`.
  - Register new dictionaries in `src/app-config/dicts.ts` (alphabetical order).
  - Use helpers for data extraction and cleansing.
- **Communication:**
  - Use `@/_helpers/browser-api` for messaging between background, content, and UI scripts.
  - Do not use native `sendMessage` directly.

## Developer Workflows
- **Install & Build:**
  - `yarn install` — Install dependencies
  - `yarn pdf` — Prepare PDF support
  - `yarn build` — Full build (artifacts in `build/`)
  - `yarn start --wextentry [entry id]` — Dev server for specific entry
- **Testing:**
  - `yarn test` — Run Jest tests
  - Add tests for new dictionaries in `engine.spec.ts`
- **UI Development:**
  - `yarn storybook` — Run Storybook for component development
  - Use fixtures for mocking dictionary responses (`yarn fixtures`)

## Conventions
- **Code Style:** TypeScript + [StandardJS](https://standardjs.com/) (with ESLint/Prettier)
- **Commits:** [Conventional Commits](https://conventionalcommits.org/); use `yarn commit` or VSCode extension
- **SCSS:** Use ECSS-like naming in `_style.scss` for dictionary components
- **Localization:** Update `_locales/` for new dictionary names/options

## Key References
- [README.md](../README.md) — Project intro, build instructions
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Detailed dev and contribution guide
- `src/app-config/dicts.ts` — Register dictionaries
- `src/components/dictionaries/` — Dictionary implementations
- `src/_helpers/browser-api.ts` — Messaging utilities

---

If any section is unclear or missing, please provide feedback for further refinement.
