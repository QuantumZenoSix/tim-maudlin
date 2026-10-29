import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
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
