import type { Page } from '@playwright/test';

export const desktop = { viewport: { width: 1440, height: 900 } };

// iPhone 13 in Chromium (the device preset would switch to WebKit, which isn't installed).
export const phone = {
	viewport: { width: 390, height: 844 },
	deviceScaleFactor: 3,
	isMobile: true,
	hasTouch: true
};

// The section ids (kept from the original site, so old links still work).
export const SECTIONS = [
	'home-link',
	'about-tim-link',
	'publications-I-link',
	'publications-II-link',
	'media-link',
	'contact-link'
];

/** Jump to a scroll position and let ScrollTrigger apply it. */
export async function scrollTo(page: Page, y: number) {
	await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
	await page.evaluate(
		() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))
	);
}

/** Document position of the first element matching `selector`. */
export function pageTop(page: Page, selector: string) {
	return page
		.locator(selector)
		.first()
		.evaluate((el) => el.getBoundingClientRect().top + scrollY);
}

/**
 * Every `[data-motion]` element under `selector` that is currently moved, scaled or faded by the
 * scroll animations, described as "name: transform opacity". Empty means everything is at rest.
 * By default sub-pixel offsets and 0.5% of scale or opacity are tolerated; `tolerance` loosens that
 * (`px` of offset, and a fraction of scale and opacity).
 */
export function displaced(
	page: Page,
	selector: string,
	tolerance: { px: number; fraction: number } = { px: 0.5, fraction: 0.005 }
) {
	return page.evaluate(
		([selector, { px, fraction }]) => {
			const elements = [
				...document.querySelectorAll<HTMLElement>(
					`${selector}[data-motion], ${selector} [data-motion]`
				)
			];
			return elements.flatMap((el) => {
				const style = getComputedStyle(el);
				const m =
					style.transform === 'none'
						? [1, 0, 0, 1, 0, 0]
						: style.transform.slice(7, -1).split(',').map(Number);
				const moved =
					Math.abs(m[0] - 1) > fraction ||
					Math.abs(m[3] - 1) > fraction ||
					Math.abs(m[4]) > px ||
					Math.abs(m[5]) > px;
				const faded = Math.abs(Number(style.opacity) - 1) > Math.max(fraction, 0.01);
				return moved || faded ? [`${el.dataset.motion}: ${style.transform} ${style.opacity}`] : [];
			});
		},
		[selector, tolerance] as const
	);
}
