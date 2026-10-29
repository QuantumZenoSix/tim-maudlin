import { expect, test } from '@playwright/test';
import { desktop, pageTop, phone, scrollTo } from './helpers.js';

/** How far the page is from having its section `id` at the top of the screen. */
async function distanceFrom(page: import('@playwright/test').Page, id: string) {
	const [y, top] = await Promise.all([page.evaluate(() => scrollY), pageTop(page, `#${id}`)]);
	return Math.abs(y - top);
}

test.describe('desktop rail', () => {
	test.use(desktop);

	test('scrolls to the section and puts it in the URL', async ({ page }) => {
		await page.goto('');
		await page.locator('nav.rail a[href="#publications-I-link"]').click();
		await expect.poll(() => distanceFrom(page, 'publications-I-link')).toBeLessThanOrEqual(4);
		await expect(page).toHaveURL(/#publications-I-link$/);
	});

	test('takes about as long as the original 1.3 s scroll', async ({ page }) => {
		await page.goto('');
		await page.locator('nav.rail a[href="#publications-I-link"]').click();
		// Halfway through, the page should be on its way but not there yet.
		await page.waitForTimeout(650);
		const midway = await distanceFrom(page, 'publications-I-link');
		expect(midway).toBeGreaterThan(100);
	});

	test('scrolling by hand cancels the animation', async ({ page }) => {
		await page.goto('');
		await page.locator('nav.rail a[href="#contact-link"]').click();
		await page.waitForTimeout(400);
		await page.mouse.move(700, 450);
		for (let i = 0; i < 5; i++) {
			await page.mouse.wheel(0, -300);
			await page.waitForTimeout(60);
		}
		await page.waitForTimeout(1500);
		expect(await distanceFrom(page, 'contact-link')).toBeGreaterThan(100);
		await expect(page).not.toHaveURL(/#contact-link$/);
	});

	test('a link to a section opens at that section', async ({ page }) => {
		await page.goto('#media-link');
		await expect.poll(() => distanceFrom(page, 'media-link')).toBeLessThanOrEqual(4);
	});

	test('old links to /tim-maudlin/dist/ redirect, keeping the section', async ({ page }) => {
		await page.goto('dist/#media-link');
		await expect(page).toHaveURL(/\/tim-maudlin\/#media-link$/);
		await expect.poll(() => distanceFrom(page, 'media-link')).toBeLessThanOrEqual(4);
	});
});

test.describe('phone menu', () => {
	test.use(phone);

	test('opens, closes on a link, and scrolls to the section', async ({ page }) => {
		await page.goto('');
		await expect(page.locator('nav.rail')).toBeHidden();

		const drawer = page.locator('dialog.drawer');
		await page.getByRole('button', { name: 'Open menu' }).tap();
		await expect(drawer).toHaveAttribute('open');

		await drawer.getByRole('link', { name: 'Media' }).tap();
		await expect(drawer).not.toHaveAttribute('open');
		await expect.poll(() => distanceFrom(page, 'media-link')).toBeLessThanOrEqual(4);
		await expect(page).toHaveURL(/#media-link$/);
	});

	test('tapping the backdrop closes it', async ({ page }) => {
		await page.goto('');
		await scrollTo(page, 0);
		const drawer = page.locator('dialog.drawer');
		await page.getByRole('button', { name: 'Open menu' }).tap();
		await expect(drawer).toHaveAttribute('open');
		await page.mouse.click(370, 400);
		await expect(drawer).not.toHaveAttribute('open');
		await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
	});
});
