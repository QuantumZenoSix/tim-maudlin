# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A single-page personal site for Tim Maudlin (NYU philosophy professor). SvelteKit 3 / Svelte 5 (runes) with TypeScript, prerendered to static files with `adapter-static`, and published by GitHub Actions to https://quantumzenosix.github.io/tim-maudlin/. It replaced a Vue 3 / Materialize site whose build is still in `dist/` until the new deployment is live; `dist/` is not part of the new app.

## Commands

```
npm run dev        # http://localhost:5173/tim-maudlin/
npm run build      # into build/
npm run preview    # serves build/ at http://localhost:4173/tim-maudlin/; restart it after every build
npm run check      # svelte-check (types)
npm run lint       # prettier --check + eslint
npm run format     # prettier --write
npm run test:e2e   # builds, serves on port 4173, runs Playwright (Chromium) on e2e/*.e2e.ts
npx playwright test e2e/motion.e2e.ts      # one file
npx playwright test -g "phone menu"        # tests matching a title
CI=1 npx playwright test                   # also runs the publish checks (no placeholder content)
```

Node 22.17+. Port 4173 must be free for the tests.

## SvelteKit 3 specifics

- Kit config lives in `vite.config.ts` (`sveltekit({...})`); there is no `svelte.config.js`. Base path is `/tim-maudlin` (`paths.base`), so asset and link URLs go through `asset()`/`resolve()` from `$app/paths`.
- `src/lib` is imported via the `#lib` subpath import and needs explicit extensions: `#lib/content.js`, `#lib/components/Section.svelte`.
- ESLint's `svelte/no-navigation-without-resolve` flags plain links: external links take `rel="external"`, internal ones `resolve()`.
- Sass partials in `src/lib/styles` are on the load path: components start their style block with `@use 'tokens' as *;`.

## Architecture

- `src/routes/+page.svelte` renders the nav and the six sections in order from `src/lib/sections/`. All copy, links, books and videos are in `src/lib/content.ts`. Section ids (`home-link`, `about-tim-link`, `publications-I-link`, ...) are kept from the old site so old links still work.
- `Section.svelte` is the shared layout (title card on the left, panel on the right). Widgets use native elements: `<dialog>` for the phone menu and lightbox, `<details name>` for the accordion, `RevealCard` for the flip-over cards.
- **Scroll choreography (`src/lib/motion.ts`).** The scattered, misplaced look mid-scroll is intentional: pieces fall into place as each section arrives. Each section passes a list of steps to `choreograph()`, which runs them with GSAP ScrollTrigger inside `gsap.matchMedia()`:
  - Steps target elements by `data-motion` name within their own section. Renaming or removing a `data-motion` attribute silently drops that part of the effect (dev builds warn).
  - Desktop steps are transcribed value for value from the original site; keep them faithful unless asked. Phones get the lighter `phoneAssembly()`. Reduced motion matches neither query, so nothing animates.
  - `keepScrollOnBreakpointChange()` works around GSAP resetting the scroll to the top when the breakpoint swaps the animation sets.
- Nav links scroll with `scrollToSection()` (GSAP ScrollToPlugin, 1.3 s like the original, cancelled by manual scrolling). There is deliberately no CSS `scroll-behavior: smooth`; it would fight the script.
- `static/dist/` keeps the old address working: `index.html` redirects `/tim-maudlin/dist/#x` to `/tim-maudlin/#x`, and `service-worker.js` is a kill switch for the old site's Workbox service worker. Keep both.

## Tests

Playwright specs in `e2e/` run desktop (1440×900) and phone (390×844, emulated in Chromium) sizes. Sections animate as they scroll, so tests scroll a section into place (`pageTop` + `scrollTo` from `e2e/helpers.ts`) before interacting or measuring; `displaced()` lists elements that are not at rest. The `ready to publish` checks in `e2e/page.e2e.ts` run only with `CI` set and block deploys while content is a placeholder.

## Deployment

`.github/workflows/deploy.yml` runs check, lint and the tests on pull requests; on push to `master` it also uploads `build/` and deploys to GitHub Pages (Settings → Pages → Source: GitHub Actions). The build is not committed.
