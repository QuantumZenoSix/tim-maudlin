# How this site works

A guide for someone who knows HTML, CSS and some JavaScript but has never used Svelte. It explains the tools, walks through how the page is put together, and ends with recipes for common changes. For commands, tests and deployment, see the [README](../README.md).

## The short version

The site is one page. At build time, SvelteKit turns the components in `src/` into a plain HTML file plus CSS, JavaScript and images, all in `build/`. GitHub Pages serves those files as they are; there is no server running code. In the browser, the JavaScript takes over the already-rendered HTML to make the widgets work (menus, cards, tabs), and GSAP animates the sections as you scroll.

## The tools and what each one does

| Tool           | Role                                                                                                                                                                                                              |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Svelte**     | The component language. A `.svelte` file holds one piece of UI: its script, its markup and its styles. Svelte is a compiler: it turns components into small JavaScript, with no framework shipped to the browser. |
| **SvelteKit**  | The application framework around Svelte: decides which file renders which URL (routing), prerenders pages to HTML, and handles the base path. This project uses version 3.                                        |
| **Vite**       | The build tool and dev server. It runs the Svelte compiler, compiles SCSS, bundles imports and hashes file names. Its config, `vite.config.ts`, also holds the SvelteKit config.                                  |
| **TypeScript** | Types in `<script lang="ts">` blocks and `.ts` files. `npm run check` reports type errors; the build itself doesn't.                                                                                              |
| **SCSS**       | CSS with variables and mixins, in `<style lang="scss">` blocks.                                                                                                                                                   |
| **GSAP**       | The animation library behind the scroll effects (`ScrollTrigger`) and the nav link scrolling (`ScrollToPlugin`).                                                                                                  |
| **Playwright** | Drives a real browser to test the built site.                                                                                                                                                                     |

A note on older material: Svelte 5 (2024) replaced much of Svelte 3/4's syntax. Many tutorials and Stack Overflow answers still show the old forms. If you see `export let`, `$:`, `on:click`, `<slot>` or `createEventDispatcher`, that's Svelte 4; this project uses the Svelte 5 equivalents described below (`$props()`, `$derived`, `onclick`, snippets, callback props).

## From files to page

```
src/
  app.html                  The HTML shell: <head>, fonts, meta tags. %sveltekit.head% and
                            %sveltekit.body% are where SvelteKit inserts the rendered page.
  routes/
    +layout.ts              `export const prerender = true`: render to HTML at build time.
    +layout.svelte          Wraps every page: global styles, <title>, favicon.
    +page.svelte            The page at "/": the nav, then the six sections in order.
  lib/
    content.ts              All the words, links, books and videos.
    sections/               One component per section (Home, About, Books, Articles, Media, Contact).
    components/             Pieces the sections share (Section layout, RevealCard, Lightbox, ...).
    motion.ts               The scroll animation engine.
    styles/                 _tokens.scss (colours, fonts, breakpoints), global.scss (resets).
    assets/img/             Images imported by components (Vite fingerprints them).
static/                     Copied into build/ untouched (favicon, robots.txt, the old-address redirect).
```

**Routing by file name.** SvelteKit builds URLs from the folders in `src/routes/`. Files starting with `+` are special: `+page.svelte` is a page, `+layout.svelte` wraps the pages below it, and `+layout.ts` sets options for them. This site has only one route (`/`), so routing barely matters here, but that's why those names look odd.

**What happens on `npm run build`.** Vite compiles every component, then SvelteKit runs the page once, in Node, and saves the resulting HTML to `build/index.html` (that's _prerendering_). The browser later downloads that HTML, shows it immediately, and loads the JavaScript, which attaches event handlers and state to the existing markup (_hydration_). Two consequences:

- Code at the top of a component's `<script>` runs twice: once in Node at build time, once in the browser. Anything that touches `window` or `document` must wait until the component is in the browser: in an event handler, an `$effect`, or an attachment (see below). That's why the scroll animations are set up through `{@attach}`, which only runs in the browser.
- The HTML works before the JavaScript arrives. For instance, nav links are real `<a href="#...">` links that still jump to the section if the script hasn't loaded.

**The base path.** The site is served from `https://quantumzenosix.github.io/tim-maudlin/`, not from the domain root, so every internal URL needs the `/tim-maudlin` prefix. `paths.base` in `vite.config.ts` sets it, and code never writes it by hand: `asset('icon.jpg')` (for files in `static/`) and `resolve('#about-tim-link')` (for links) from `$app/paths` add it. Images imported from `src/lib/assets` get the right URL automatically.

**`#lib` imports.** `import Section from '#lib/components/Section.svelte'` means `src/lib/components/Section.svelte`, via `imports` in `package.json`. TypeScript files are imported with a `.js` extension (`#lib/content.js` for `content.ts`); that's the Node module convention, and the import fails without an extension.

**Generated files.** `.svelte-kit/` is created by SvelteKit (`npm install` and `npm run dev` regenerate it) and is not committed. It's where `import type { LayoutProps } from './$types'` in `+layout.svelte` comes from.

## Anatomy of a component

A `.svelte` file has up to three parts. `Lightbox.svelte`, slightly trimmed:

```svelte
<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		src: string;
		alt: string;
		caption: string;
	}

	let { src, alt, caption }: Props = $props();
	let dialog: HTMLDialogElement;
</script>

<button type="button" class="trigger" onclick={() => dialog.showModal()}>
	<img {src} {alt} />
</button>

<dialog bind:this={dialog} aria-label={caption} onclick={() => dialog.close()}>
	<figure>
		<img {src} {alt} />
		<figcaption>{caption}</figcaption>
	</figure>
</dialog>

<style lang="scss">
	.trigger {
		cursor: zoom-in;
	}
</style>
```

- **`<script>`** runs when the component is created. Imports, props, state and functions go here.
- **Markup** is HTML with `{expressions}` in curly braces. `{src}` as an attribute is shorthand for `src={src}`.
- **`<style>`** is _scoped_: `.trigger` here only matches elements in this component, so class names never clash across files. To style an element rendered by a child component (e.g. the `<span>` from `Icon`), wrap the selector in `:global(...)`, as in `RevealCard.svelte`.
- A component is used like a tag, `<Lightbox src={photo} alt="..." caption="..." />`, with its props as attributes.

## Runes: props and state

Svelte 5 marks reactive values with _runes_, functions starting with `$`. These are the ones in use here.

**`$props()`** declares a component's inputs. The `Props` interface types them, and defaults go in the destructuring:

```ts
let { title, level = 2, blocks }: Props = $props(); // TitleCard.svelte
```

**`$state(...)`** declares a value the markup depends on. Assigning to it updates the page; there's no `setState`:

```ts
let selected = $state(0); // Books.svelte: which year tab is selected
function selectBook(index: number) {
	selected = index; // the tab styles and the shown book update
}
```

A plain `let` without `$state` (like `dialog` above, or `tabs` in `Books.svelte`) is fine for values the markup doesn't need to react to.

**`$derived(...)`** is a value computed from state, recomputed when that state changes:

```ts
const book = $derived(books[selected]); // Books.svelte
```

**`$bindable()`** lets a parent bind to a prop, so changes flow both ways. `RevealCard` declares `open = $bindable(false)`, and `Books.svelte` passes `bind:open={aboutOpen}`; when the visitor picks another year, `Books` sets `aboutOpen = false` and the card's panel closes.

**`$props.id()`** gives a unique id per component instance, the same on the server and in the browser. It's used to wire up ARIA attributes (`aria-controls`, `aria-labelledby`) between elements.

The compiler only allows runes in `.svelte` files (and `.svelte.ts` files). `vite.config.ts` turns on runes mode for the whole project.

## Template syntax

**Lists:** `{#each items as item (key)}...{/each}`. The `(key)` tells Svelte which DOM element belongs to which item when the list changes.

```svelte
{#each navItems as item (item.id)}
	<li><a href="#{item.id}">{item.label}</a></li>
{/each}
```

**Conditions:** `{#if cond}...{:else}...{/if}`. Elements inside are created and destroyed, not hidden.

**Events:** attributes like `onclick={handler}` or `onkeydown={(event) => ...}`, the same names as the DOM properties.

**Classes and styles:** `class:tall={tall}` (or `class:tall` when the variable has the same name) toggles a class; `class="width-{width}"` builds one from a value.

**`bind:this={variable}`** stores the DOM element in a variable once it exists, for calling methods like `dialog.showModal()` or `button.focus()`.

**Transitions:** `transition:slide={{ duration: 300 }}` on an element inside an `{#if}` animates it in and out. The accordion in `Articles.svelte` uses `slide`; the "About the Book" panel in `RevealCard.svelte` uses `fly`. Both set `duration` to 0 when the visitor prefers reduced motion.

**`{#key value}...{/key}`** recreates its contents when `value` changes. `VideoGallery.svelte` uses it so a new thumbnail `<img>` is created for each video.

**`{@const x = ...}`** declares a local constant inside a block.

### Snippets: passing markup to a component

A component that wraps content (like `Section`, which draws the title card and the panel) receives that content as a _snippet_. Anything between a component's opening and closing tags becomes its `children` snippet, which it places with `{@render children()}`:

```svelte
<!-- Contact.svelte -->
<Section id="contact-link" title="Contact" ...>
	<div class="contact-card">...</div>
</Section>

<!-- Section.svelte -->
<div class="content">
	{@render children()}
</div>
```

A component can take several snippets. `RevealCard` has `media`, `children` and `reveal`, and `Books.svelte` fills them with `{#snippet media()}...{/snippet}` blocks inside the `<RevealCard>` tags.

Snippets also work as local, reusable chunks of markup within one file, with parameters. `Articles.svelte` defines `{#snippet item(key, icon, title, body)}` once and renders it twice for the two accordion panels.

### Attachments: running code on an element

`{@attach fn}` calls `fn(element)` once the element is in the page (in the browser only), and calls the function it returns when the element is removed. It's Svelte's hook for handing an element to a non-Svelte library. Here it's how a section gets its scroll animation:

```svelte
<section {id} class="section" {@attach motion}>
```

`motion` comes from `choreograph(...)` in `motion.ts`, which returns such a function: it sets up the GSAP triggers on attach and returns `() => media.revert()` to remove them.

## Where content and styles come from

**Content.** Sections don't contain copy; they import it from `src/lib/content.ts`, which exports typed arrays and objects (`navItems`, `books`, `videos`, `contactEmail`, ...). Editing text or adding a book doesn't require touching any component.

**Images.** `import thinkerImage from '#lib/assets/img/thinker.jpg'` gives a URL string. In the build, Vite copies the file under a content-hashed name (`thinker.a1b2c3.jpg`), so browsers can cache it forever and a changed image gets a new URL. Files in `static/` are not processed that way; they're referenced with `asset()`.

**Styles.** Shared values live in `src/lib/styles/_tokens.scss`: colours (`$primary`, `$secondary`), fonts, shadows, the `$desktop` breakpoint (992px) and mixins. Each component's style block starts with `@use 'tokens' as *;` to use them:

```scss
@use 'tokens' as *;

.title {
	font-family: $font-display;

	@include desktop {
		font-size: 3rem; // only at 992px and wider
	}
}
```

Styles are written mobile-first: base rules are for phones, `@include desktop { ... }` adds the two-column layout. `global.scss` (imported once in `+layout.svelte`) holds the resets and utility classes like `.visually-hidden`.

## How the page is put together

`+page.svelte` renders `<SiteNav />` and then the six sections. Every section except Home uses the same layout component:

```svelte
<!-- Books.svelte, abbreviated -->
<Section
	id="publications-I-link"
	title="Publications I"
	blocks={[{ primary: 'Published Books' }]}
	panel={{ image: backdrop, fill: 'rgba(185, 185, 185, 0.6)' }}
	{motion}
>
	...the book card and year tabs...
</Section>
```

`Section.svelte` draws a dark title card on the left (`TitleCard`) and a panel with a background image on the right, and places the section's own content in the panel. On phones the two stack.

The section ids (`home-link`, `about-tim-link`, `publications-I-link`, ...) come from the old site. Old links and bookmarks point at them, so don't rename them.

**Widgets use native HTML where possible**, which brings keyboard and screen-reader support for free:

| Widget             | Built with                                                         | File                             |
| ------------------ | ------------------------------------------------------------------ | -------------------------------- |
| Phone menu         | `<dialog>` with `showModal()`                                      | `components/SiteNav.svelte`      |
| Photo lightbox     | `<dialog>`                                                         | `components/Lightbox.svelte`     |
| Book year tabs     | buttons with the ARIA tabs pattern (arrow keys move between years) | `sections/Books.svelte`          |
| Flip-over cards    | a button that shows a panel sliding over the card                  | `components/RevealCard.svelte`   |
| Articles accordion | buttons with `aria-expanded` and a `slide` transition              | `sections/Articles.svelte`       |
| Video player       | a thumbnail button; the YouTube iframe only loads when played      | `components/VideoGallery.svelte` |

## The scroll animations

As you scroll, each section's pieces start scattered (shifted, scaled, faded) and fall into place as the section reaches the top of the screen. This "assembly" look is the design, not a glitch; the desktop version reproduces the original site value for value (`site_overview.gif` shows it).

Each section describes its animation as a list of steps and passes it to `choreograph()`:

```ts
// Contact.svelte
const motion = choreograph({
	desktop: [
		{ target: 'title-card', range: ['top bottom', 'top top'], from: { yPercent: -1000 } },
		{ target: 'panel-inner', range: ['top 50%', 'bottom bottom'], from: { opacity: 0 } }
	],
	phone: phoneAssembly()
});
```

- **`target`** names an element by its `data-motion` attribute, looked up inside this section only. `Section.svelte` provides `intro`, `panel`, `panel-inner` and `content`; `TitleCard` provides `title-card` and `title-block`; `RevealCard` provides `card`, `card-media`, `card-body` and `fab`. If you rename or remove a `data-motion` attribute, the step that targets it silently does nothing (the dev server prints a warning in the browser console).
- **`range`** is when the step plays, as GSAP ScrollTrigger positions: `'top bottom'` means "when the section's top reaches the bottom of the screen", `'top top'` "when it reaches the top". Between those two points, the animation is tied to the scroll position (scrubbed), so scrolling back plays it in reverse.
- **`from`** animates from these values to where the element normally sits; **`to`** animates from where it sits to these values (used as a section leaves).
- **Desktop and phone** get separate step lists. Phones use the lighter `phoneAssembly()`: short slides and fades, so nothing overlaps on a narrow screen. Visitors who prefer reduced motion match neither list, so for them nothing moves.

Nav links don't use the browser's smooth scrolling: `scrollToSection()` in `motion.ts` scrolls over 1.3 seconds, as the original did, because the animations were tuned to that speed. That's also why there's no `scroll-behavior: smooth` in the CSS; it would fight the script.

## Recipes

**Change text, links or the contact email:** edit `src/lib/content.ts`. Run `npm run dev` and the page updates as you save.

**Add a book:** put the cover image in `src/lib/assets/img/pubs/` (the cards use the `-cropped` versions), import it at the top of `content.ts`, and add an entry to `books` (the `Book` interface shows the fields). The year tabs are generated from the list.

**Add a video:** add `{ id, title }` to `videos` in `content.ts`, where `id` is the YouTube video id (the `v=` part of the URL). The first video is the one in the player on load; the layout fits four thumbnails in a row.

**Add a nav entry or section:** a new section needs a component in `src/lib/sections/` (copy `Contact.svelte` as a starting point), a line in `+page.svelte`, and an entry in `navItems` in `content.ts`. Add its id to `SECTIONS` in `e2e/helpers.ts` so the tests cover it.

**Change colours or fonts:** `src/lib/styles/_tokens.scss`. Fonts are loaded from Google Fonts in `src/app.html`.

**Before committing:** `npm run format`, then `npm run check`, `npm run lint` and `npm run test:e2e`. CI runs the same checks and won't deploy if one fails.

## Gotchas

- **Links.** ESLint (`svelte/no-navigation-without-resolve`) flags any plain `href`, because it may be missing the base path. Internal links go through `resolve()`; external ones carry `rel="external"`, which tells SvelteKit (and the rule) that the link leaves the site.
- **Base path.** A hard-coded `/icon.jpg` or `/#contact-link` works nowhere: the site lives under `/tim-maudlin/`. Use `asset()` and `resolve()`.
- **Browser-only code.** `window`, `document` and GSAP measurements belong in event handlers or attachments, not at the top of a component script, which also runs in Node at build time.
- **Preview after a build.** `npm run preview` serves the build that existed when it started. Restart it after `npm run build`.
- **Height changes and animations.** Scroll ranges are measured in pixels. `motion.ts` re-measures when the page height changes (an accordion opening, for example), so no manual refresh is needed, but an animation that looks offset after a layout change is likely a measurement issue.

## Further reading

- [Svelte tutorial](https://svelte.dev/tutorial): interactive, the quickest way in. The "Basic Svelte" and "Basic SvelteKit" parts cover nearly everything this site uses.
- [Svelte docs](https://svelte.dev/docs/svelte): runes, template syntax, snippets, attachments, transitions.
- [SvelteKit docs](https://svelte.dev/docs/kit): routing, prerendering, `$app/paths`.
- [GSAP ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/): what `start`, `end` and `scrub` mean.
