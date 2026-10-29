import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import { desktop, pageTop, scrollTo } from './helpers.js';

test.use(desktop);

test.beforeEach(async ({ page }) => {
	await page.goto('');
});

// Sections assemble as they scroll into place, so interact with one only once it has arrived, as a
// visitor would. Scrolling an element into view alone could leave it mid-flight.
async function arrive(page: Page, id: string) {
	await scrollTo(page, await pageTop(page, `#${id}`));
}

test('book year tabs follow the WAI-ARIA tabs pattern', async ({ page }) => {
	const books = page.locator('#publications-I-link');
	const tabs = books.getByRole('tab');

	await tabs.first().focus();
	await page.keyboard.press('ArrowRight');
	await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
	await expect(tabs.nth(1)).toBeFocused();

	await page.keyboard.press('End');
	await expect(tabs.last()).toBeFocused();
	await expect(books.locator('.book-title')).toContainText('1994');

	await page.keyboard.press('Home');
	await expect(tabs.first()).toHaveAttribute('aria-selected', 'true');
});

test('book reveal opens, closes with Escape, and manages focus', async ({ page }) => {
	const books = page.locator('#publications-I-link');
	const fab = books.locator('.fab');

	await fab.click();
	await expect(fab).toHaveAttribute('aria-expanded', 'true');
	await expect(books.locator('.reveal .close')).toBeFocused();

	await page.keyboard.press('Escape');
	await expect(books.locator('.reveal')).toHaveCount(0);
	await expect(fab).toBeFocused();
});

test('choosing another year closes an open reveal', async ({ page }) => {
	const books = page.locator('#publications-I-link');
	await books.locator('.fab').click();
	await expect(books.locator('.reveal')).toBeVisible();
	await books.getByRole('tab').nth(2).click();
	await expect(books.locator('.reveal')).toHaveCount(0);
});

test('the reveal button is clickable across its whole face', async ({ page }) => {
	// The card body sits on its own animation layer; the button must stay above it.
	await arrive(page, 'publications-I-link');
	const fab = page.locator('#publications-I-link .fab');
	const box = (await fab.boundingBox())!;
	const hit = await page.evaluate(
		({ x, y }) => document.elementFromPoint(x, y)?.closest('.fab') !== null,
		{ x: box.x + box.width / 2, y: box.y + box.height - 4 }
	);
	expect(hit).toBe(true);
});

test('article accordion keeps one panel open', async ({ page }) => {
	const details = page.locator('#publications-II-link details');
	await details.nth(0).locator('summary').click();
	await details.nth(1).locator('summary').click();
	await expect(details.nth(0)).not.toHaveAttribute('open');
	await expect(details.nth(1)).toHaveAttribute('open');
});

test('photo lightbox opens and closes with Escape', async ({ page }) => {
	await arrive(page, 'about-tim-link');
	const about = page.locator('#about-tim-link');
	const dialog = about.locator('dialog');
	await about.getByRole('button', { name: 'Enlarge photo' }).click();
	await expect(dialog).toHaveAttribute('open');
	await page.keyboard.press('Escape');
	await expect(dialog).not.toHaveAttribute('open');
});

test('video gallery loads YouTube only once a video is chosen', async ({ page }) => {
	const media = page.locator('#media-link');
	await expect(media.locator('iframe')).toHaveCount(0);

	const thumbnail = media.locator('.thumbnail').nth(1);
	await thumbnail.click();
	await expect(thumbnail).toHaveAttribute('aria-pressed', 'true');
	await expect(media.locator('iframe')).toHaveAttribute(
		'src',
		/youtube-nocookie\.com.*hC3ckLqsL5M/
	);
});
