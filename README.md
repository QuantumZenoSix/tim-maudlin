## Project Description:

This website was built for Tim Maudlin, a Professor of Philosophy from NYU and it serves as a introduction to him and his work. I reached out to Tim because I'm an admirer of his work and offered a pro bono site for him. The site was completely designed and developed by me without the use of any templates or mockups.

https://quantumzenosix.github.io/tim-maudlin/

## Technologies used

- SvelteKit 3 / Svelte 5 with TypeScript, built as a fully static, prerendered site (`@sveltejs/adapter-static`).
- SCSS for styling, with shared design tokens in `src/lib/styles/_tokens.scss`.
- GSAP with the ScrollTrigger plugin for scroll animation.
- Google Fonts (Playfair Display SC, Nanum Myeongjo) and Google Material Icons.
- Playwright for browser tests; ESLint and Prettier for code quality.

The site was originally built with Vue 3, Vue CLI and Materialize CSS, and served from `/tim-maudlin/dist/`. That version's build output stays in `dist/` until the new deployment is live (see [Deployment](#deployment)).

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

| Command            | What it does                                                                                |
| ------------------ | ------------------------------------------------------------------------------------------- |
| `npm run check`    | TypeScript and Svelte type checking.                                                        |
| `npm run lint`     | Formatting (Prettier) and code rules (ESLint).                                              |
| `npm run format`   | Fixes formatting automatically.                                                             |
| `npm run test:e2e` | Builds the site, starts a preview server on port 4173 and runs the browser tests in `e2e/`. |

The first `npm run test:e2e` downloads a headless Chromium (about 120 MB) into `~/.cache/ms-playwright/`. The tests need port 4173, so stop any running `npm run preview` first.

The tests run at desktop and phone sizes and cover:

- `e2e/widgets.e2e.ts`: the book year tabs, the flip-over cards, the article accordion, the photo lightbox and the video gallery.
- `e2e/navigation.e2e.ts`: nav links scroll to their section at the original speed, update the URL and can be cancelled by scrolling; the phone menu.
- `e2e/motion.e2e.ts`: the scroll assembly. Sections are assembled when they arrive, blocks land without overlapping on phones, nothing moves with reduced motion, and switching between desktop and phone widths keeps the visitor's place.
- `e2e/page.e2e.ts`: no errors, missing files or sideways scrolling.

Some checks run only in CI (`CI=1 npm run test:e2e` runs them locally). They fail while the contact email or the fifth video is still a placeholder, so placeholder content can't be deployed.

To run one file or test: `npx playwright test e2e/motion.e2e.ts` or `npx playwright test -g "phone menu"`. Add `--ui` to watch them run.

## Where things are

- `src/lib/content.ts`: all text, links, books, videos and the contact email. Edit content here; every section renders from it.
- `src/lib/sections/`: the page sections (Home, About, Books, Articles, Media, Contact).
- `src/lib/components/`: shared pieces (navigation, flip-over card, lightbox, video gallery, section layout).
- `src/lib/motion.ts`: the scroll animation engine and the nav link scrolling. Each section lists its own animation steps, which target elements by their `data-motion` attribute; renaming or removing one of those attributes drops that part of the effect.
- `src/lib/styles/`: design tokens (`_tokens.scss`) and global styles (`global.scss`).
- `vite.config.ts`: build settings (base path, static adapter, Sass).
- `static/`: files copied into the build as they are. `static/dist/` takes over the old site's address (see below).
- `e2e/`: browser tests.
- `.github/workflows/deploy.yml`: tests and deployment.

## Deployment

GitHub Actions publishes the site to GitHub Pages (`.github/workflows/deploy.yml`):

- Every pull request runs the type check, lint and browser tests.
- Every push to `master` runs the same checks, then publishes `build/` to https://quantumzenosix.github.io/tim-maudlin/. Nothing is published if a check fails, including the publish checks for placeholder content.
- A deploy can also be started by hand from the repository's Actions tab ("Run workflow").

The repository's Settings → Pages → Source must be set to "GitHub Actions". The built site isn't committed; Actions builds it each time.

### The old address

The old site lived at `/tim-maudlin/dist/`. Two files in `static/dist/` keep that address working:

- `index.html` redirects to the new site, keeping the section in the link (`/tim-maudlin/dist/#media-link` goes to `/tim-maudlin/#media-link`).
- `service-worker.js` replaces the old site's service worker, which cached the whole old site in returning visitors' browsers. When they come back, it clears that cache, removes itself and reloads the page, which then redirects.

Keep both for as long as old links and returning visitors matter.

## Comparing with the old site

While the old Vue build is still in `dist/`, it can be served next to the new one:

```
python3 -m http.server 8765 --directory dist
```

Then open http://localhost:8765/. `dist/` can be deleted once the new deployment is live.
