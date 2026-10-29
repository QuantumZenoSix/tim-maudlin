<script lang="ts">
	import { asset } from '$app/paths';
	import '#lib/styles/global.scss';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<title>Tim Maudlin</title>
	<link rel="icon" href={asset('icon.jpg')} />
</svelte:head>

{@render children()}
