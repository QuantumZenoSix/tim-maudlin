## Project Description:

This website was built for Tim Maudlin, a Professor of Philosophy from NYU and it serves as a introduction to him and his work. I reached out to Tim because I'm an admirer of his work and offered a pro bono site for him. The site was completely designed and developed by me without the use of any templates or mockups.

https://quantumzenosix.github.io/tim-maudlin/dist/

## Technologies used

- SvelteKit 3 / Svelte 5 with TypeScript, built as a fully static, prerendered site (`@sveltejs/adapter-static`).
- SCSS for styling, with shared design tokens in `src/lib/styles/_tokens.scss`.
- GSAP with the ScrollTrigger plugin for scroll animation.
- Google Fonts (Playfair Display SC, Nanum Myeongjo) and Google Material Icons.
- Playwright for browser tests; ESLint and Prettier for code quality.

The site was originally built with Vue 3, Vue CLI and Materialize CSS. That version's build output is still in `dist/` until the SvelteKit deployment replaces it.

## Requirements

- Node.js 22.17 or newer. `.npmrc` sets `engine-strict`, so `npm install` refuses older versions.
- Run all commands from the repository root.

## Running the site

| Command           | What it does                                                                | URL                                |
| ----------------- | --------------------------------------------------------------------------- | ---------------------------------- |
| `npm install`     | Installs dependencies. Needed after cloning or when `package.json` changes. |                                    |
| `npm run dev`     | Development server with instant reload on edits.                            | http://localhost:5173/tim-maudlin/ |
| `npm run build`   | Production build into `build/` (static HTML, CSS, JS and images).           |                                    |
| `npm run preview` | Serves the production build, the closest match to what GitHub Pages serves. | http://localhost:4173/tim-maudlin/ |

The `/tim-maudlin/` path is intentional: the site is published under that path on GitHub Pages (`paths.base` in `vite.config.ts`), so it is served the same way locally. Visiting the server root redirects there.

`npm run preview` serves the build that existed when it started. After running `npm run build` again, restart the preview server, or the page will request files that no longer exist.

## Checks and tests

| Command            | What it does                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| `npm run check`    | TypeScript and Svelte type checking.                                                                   |
| `npm run lint`     | Formatting (Prettier) and code rules (ESLint).                                                         |
| `npm run format`   | Fixes formatting automatically.                                                                        |
| `npm run test:e2e` | Builds the site, starts a preview server on port 4173 and runs the browser tests in `src/**/*.e2e.ts`. |

The first `npm run test:e2e` downloads a headless Chromium (about 120 MB) into `~/.cache/ms-playwright/`. The tests need port 4173, so stop any running `npm run preview` first.

## Where things are

- `src/lib/content.ts`: all text, links, books, videos and the contact email. Edit content here; every section renders from it.
- `src/lib/sections/`: the page sections (Home, About, Books, Articles, Media, Contact).
- `src/lib/components/`: shared pieces (navigation, flip-over card, lightbox, video gallery, section layout).
- `src/lib/styles/`: design tokens (`_tokens.scss`) and global styles (`global.scss`).
- `vite.config.ts`: build settings (base path, static adapter, Sass).

## Comparing with the old site

While the old Vue build is still in `dist/`, it can be served next to the new one:

```
python3 -m http.server 8765 --directory dist
```

Then open http://localhost:8765/.
