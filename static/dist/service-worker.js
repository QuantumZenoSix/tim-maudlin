// The old Vue site registered a Workbox service worker here that cached the whole site, so returning
// visitors would keep seeing the old version. Browsers check this file for updates when such a
// visitor comes back; this version removes the old cache and itself, then reloads open pages so
// they reach the redirect to the new site.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			const names = await caches.keys();
			await Promise.all(
				names.filter((name) => name.startsWith('tim-maudlin')).map((name) => caches.delete(name))
			);
			await self.registration.unregister();
			const pages = await self.clients.matchAll({ type: 'window' });
			await Promise.all(pages.map((page) => page.navigate(page.url)));
		})()
	);
});
