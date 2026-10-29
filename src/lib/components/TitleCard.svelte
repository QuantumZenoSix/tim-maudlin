<script lang="ts">
	import type { TitleBlock } from '#lib/content.js';

	interface Props {
		title: string;
		/** Id for the heading, so a section can use it as its accessible name. */
		headingId?: string;
		/** The page title is the only h1; section titles are h2. */
		level?: 1 | 2;
		blocks: TitleBlock[];
		accent?: 'light' | 'secondary';
	}

	let { title, headingId, level = 2, blocks, accent = 'secondary' }: Props = $props();
</script>

<div class="title-card accent-{accent}">
	<svelte:element this={`h${level}`} id={headingId} class="title">{title}</svelte:element>
	{#each blocks as block (block.primary)}
		<div class="block">
			<p class="primary">{block.primary}</p>
			{#if block.secondary}
				<p class="secondary">{block.secondary}</p>
			{/if}
			<span class="accent-bar"></span>
		</div>
	{/each}
</div>

<style lang="scss">
	@use 'tokens' as *;

	.title-card {
		display: inline-block;
		max-width: 100%;
		padding: 15px 20px;
		border-radius: 2px;
		box-shadow: $shadow-1;
	}

	.title {
		margin: 0;
		font-family: $font-display;
		font-size: 2.5rem;
		line-height: 1.1;
		color: $title-light;
		text-shadow: 0 0 3px rgba(0, 0, 0, 0.7);
	}

	.block {
		padding: 24px;
		font-family: $font-serif;
		line-height: 1.15;
		color: #fff;
	}

	.primary {
		padding: 13px 0;
	}

	.secondary {
		font-style: italic;
		color: $text-muted-light;
	}

	.accent-bar {
		display: inline-block;
		width: 50px;
		margin-top: 15px;
		border-bottom: 5px solid $secondary;
	}

	.accent-light .accent-bar {
		border-bottom-color: rgb(214, 214, 214);
	}
</style>
