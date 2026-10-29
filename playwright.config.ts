import { defineConfig } from '@playwright/test';

export default defineConfig({
	webServer: { command: 'npm run build && npm run preview', port: 4173 },
	// Matches paths.base in vite.config.ts; tests use relative URLs like page.goto('').
	use: { baseURL: 'http://localhost:4173/tim-maudlin/' },
	testDir: 'e2e',
	testMatch: '**/*.e2e.ts'
});
