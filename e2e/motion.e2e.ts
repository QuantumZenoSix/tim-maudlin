// The scroll "assembly": pieces start scattered and fall into place as a section arrives. These
// tests check where things end up (landed, not overlapping, or not moving at all), not the
// in-between frames, which are a visual design matter.
import { expect, test } from '@playwright/test';
import { SECTIONS, desktop, displaced, pageTop, phone, scrollTo } from './helpers.js';

// Home only drifts away as the page leaves it; every other section assembles as it arrives.
const ASSEMBLED = SECTIONS.slice(1);

test.describe('desktop', () => {
	test.use(desktop);

	for (const id of ASSEMBLED) {
		test(`#${id} is assembled when it reaches the top`, async ({ page }) => {
			await page.goto('');
			await scrollTo(page, await pageTop(page, `#${id}`));
			// The section's own pieces (its intro drifts away as soon as it passes the top, by design).
			// A few steps of the original choreography finish a little after this point (About's bio,
			// Articles' panel), so allow them a few pixels and percent.
			await expect
				.poll(() => displaced(page, `#${id} [data-motion=panel-inner]`, { px: 6, fraction: 0.05 }))
				.toEqual([]);
		});
	}

	test('pieces are scattered while a section approaches', async ({ page }) => {
		// Guards against the choreography silently not running at all.
		await page.goto('');
		await scrollTo(page, (await pageTop(page, '#publications-I-link')) - 450);
		expect(await displaced(page, '#publications-I-link')).not.toEqual([]);
	});
});

test.describe('phone', () => {
	test.use(phone);

	for (const id of ASSEMBLED) {
		test(`#${id}: every block lands and nothing overlaps`, async ({ page }) => {
			await page.goto('');
			const height = page.viewportSize()!.height;

			// The title card lands once it's in the upper quarter of the screen.
			await scrollTo(
				page,
				(await pageTop(page, `#${id} [data-motion=title-card]`)) - height * 0.25
			);
			await expect.poll(() => displaced(page, `#${id} [data-motion=intro]`)).toEqual([]);

			// Each animated block in the panel lands once its own top is at 40% of the screen (or the
			// page is scrolled as far as it goes).
			const names = await page
				.locator(`#${id} [data-motion=panel] [data-motion]`)
				.evaluateAll((elements) => [...new Set(elements.map((el) => el.dataset.motion!))]);
			for (const name of names) {
				const selector = `#${id} [data-motion=${name}]`;
				await scrollTo(page, (await pageTop(page, selector)) - height * 0.4);
				await expect
					.poll(() => displaced(page, selector).then((d) => d.filter((s) => s.startsWith(name))))
					.toEqual([]);
			}

			const [card, content] = await Promise.all([
				page.locator(`#${id} [data-motion=title-card]`).boundingBox(),
				page.locator(`#${id} [data-motion=content]`).boundingBox()
			]);
			expect(card!.y + card!.height).toBeLessThanOrEqual(content!.y);
		});
	}
});

test.describe('reduced motion', () => {
	for (const [label, device] of [
		['desktop', desktop],
		['phone', phone]
	] as const) {
		test(`nothing moves while scrolling (${label})`, async ({ browser }) => {
			const context = await browser.newContext({ ...device, reducedMotion: 'reduce' });
			const page = await context.newPage();
			await page.goto('');
			const height = await page.evaluate(() => document.documentElement.scrollHeight);
			for (let y = 0; y < height; y += 300) {
				await scrollTo(page, y);
				expect(await displaced(page, 'body'), `at scrollY ${y}`).toEqual([]);
			}
			await context.close();
		});
	}

	test('nav links jump instead of animating', async ({ browser }) => {
		const context = await browser.newContext({ ...desktop, reducedMotion: 'reduce' });
		const page = await context.newPage();
		await page.goto('');
		await page.locator('nav.rail a[href="#contact-link"]').click();
		// One frame later the jump is done, and the URL is updated.
		await expect(page).toHaveURL(/#contact-link$/, { timeout: 500 });
		await context.close();
	});
});

test('switching between desktop and phone widths leaves nothing stranded', async ({ page }) => {
	await page.setViewportSize(desktop.viewport);
	await page.goto('');
	const booksTop = await pageTop(page, '#publications-I-link');
	await scrollTo(page, booksTop - 450);

	// Desktop scatters pieces by hundreds of percent and scales them up to 3x; the phone version
	// moves them less than 200px and scales them up to 1.4x, so anything beyond is a leftover.
	await page.setViewportSize(phone.viewport);
	await expect
		.poll(() =>
			page.locator('[data-motion]').evaluateAll((elements) =>
				elements
					.map((el) => new DOMMatrix(getComputedStyle(el).transform))
					.filter((m) => Math.abs(m.e) > 200 || Math.abs(m.f) > 200 || m.a > 1.5)
					.map(String)
			)
		)
		.toEqual([]);

	await page.setViewportSize(desktop.viewport);
	await scrollTo(page, await pageTop(page, '#publications-I-link'));
	await expect
		.poll(() => displaced(page, '#publications-I-link [data-motion=panel-inner]'))
		.toEqual([]);
});

test('switching between desktop and phone widths keeps the visitor’s place', async ({ page }) => {
	// E.g. rotating a tablet. Swapping the animation sets used to leave the page at the top.
	await page.setViewportSize(desktop.viewport);
	await page.goto('');
	await scrollTo(page, 1440);
	for (const viewport of [phone.viewport, desktop.viewport]) {
		await page.setViewportSize(viewport);
		await page.waitForTimeout(500);
		expect(await page.evaluate(() => scrollY)).toBeGreaterThan(1000);
	}
});
