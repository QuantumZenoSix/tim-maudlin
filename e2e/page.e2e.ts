import { expect, test } from '@playwright/test';
import { SECTIONS, desktop, phone, scrollTo } from './helpers.js';

for (const [label, device] of [
	['desktop', desktop],
	['phone', phone]
] as const) {
	test.describe(label, () => {
		test.use(device);

		test('renders every section without errors', async ({ page }) => {
			const errors: string[] = [];
			page.on('pageerror', (error) => errors.push(error.message));
			page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
			page.on('requestfailed', (request) =>
				errors.push(`${request.failure()?.errorText} ${request.url()}`)
			);

			await page.goto('');
			await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Tim Maudlin/);
			for (const id of SECTIONS) await expect(page.locator(`#${id}`)).toBeAttached();

			// Scroll through so every image and animation gets a chance to load and run.
			const height = await page.evaluate(() => document.documentElement.scrollHeight);
			for (let y = 0; y < height; y += 400) await scrollTo(page, y);
			await page.waitForLoadState('networkidle');

			// Fonts and icons come from Google; ignore them failing in an offline test run.
			expect(errors.filter((e) => !/fonts\.(googleapis|gstatic)\.com/.test(e))).toEqual([]);
		});

		test('never scrolls sideways', async ({ page }) => {
			await page.goto('');
			const height = await page.evaluate(() => document.documentElement.scrollHeight);
			for (let y = 0; y < height; y += 400) {
				await scrollTo(page, y);
				const overflow = await page.evaluate(
					() => document.documentElement.scrollWidth - document.documentElement.clientWidth
				);
				expect(overflow, `at scrollY ${y}`).toBe(0);
			}
		});
	});
}

// Content the owner still has to supply. Skipped locally so work in progress stays green; in CI
// (the deploy workflow) it fails, so placeholders can't go live.
test.describe('ready to publish', () => {
	test.skip(!process.env.CI, 'only enforced in CI');

	test('has no placeholder content', async ({ page }) => {
		await page.goto('');
		expect(await page.content()).not.toContain('REPLACE_WITH');
	});

	test('has all five videos, like the original', async ({ page }) => {
		await page.goto('');
		await expect(page.locator('#media-link .thumbnail')).toHaveCount(5);
	});
});
