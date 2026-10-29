import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
	css: {
		preprocessorOptions: {
			// Lets component styles write `@use 'tokens' as *;`
			scss: { loadPaths: [fileURLToPath(new URL('./src/lib/styles', import.meta.url))] }
		}
	},
	plugins: [
		sveltekit({
			// Compiles <style lang="scss"> blocks.
			preprocess: vitePreprocess(),
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// GitHub Pages serves unknown paths with 404.html instead of its own error page.
			adapter: adapter({ fallback: '404.html' }),
			// Served from https://<owner>.github.io/tim-maudlin/ (project Pages site).
			paths: { base: '/tim-maudlin' }
		})
	]
});
