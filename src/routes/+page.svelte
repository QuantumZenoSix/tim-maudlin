<script lang="ts">
	import SiteNav from '#lib/components/SiteNav.svelte';
	import { credit } from '#lib/content.js';
	import About from '#lib/sections/About.svelte';
	import Articles from '#lib/sections/Articles.svelte';
	import Books from '#lib/sections/Books.svelte';
	import Contact from '#lib/sections/Contact.svelte';
	import Home from '#lib/sections/Home.svelte';
	import Media from '#lib/sections/Media.svelte';
</script>

<SiteNav />

<main>
	<Home />
	<About />
	<Books />
	<Articles />
	<Media />
	<Contact />
</main>

<footer>
	<p>{credit.text} <a href={credit.href} rel="external">{credit.name}</a></p>
</footer>

<style lang="scss">
	footer {
		padding: 12px;
		background: #000;
		color: #fff;
		font-size: 12px;
		letter-spacing: 0.4px;
		text-align: center;
	}
</style>
