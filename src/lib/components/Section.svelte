<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TitleBlock } from '#lib/content.js';
	import TitleCard from './TitleCard.svelte';

	interface Props {
		id: string;
		title: string;
		blocks: TitleBlock[];
		/** Right-hand panel backdrop. `overlay` is a translucent colour laid over `image`. */
		panel: { color?: string; image?: string; position?: string; overlay?: string };
		/** Width of the content column inside the panel on desktop. */
		width?: 'narrow' | 'medium' | 'wide';
		class?: string;
		children: Snippet;
	}

	let {
		id,
		title,
		blocks,
		panel,
		width = 'medium',
		class: className = '',
		children
	}: Props = $props();

	const panelStyle = $derived(
		[
			panel.color && `--panel-color: ${panel.color}`,
			panel.image && `--panel-image: url('${panel.image}')`,
			panel.position && `--panel-position: ${panel.position}`,
			panel.overlay && `--panel-overlay: ${panel.overlay}`
		]
			.filter(Boolean)
			.join('; ')
	);
</script>

<section {id} class="section {className}" aria-labelledby="{id}-title">
	<div class="intro">
		<TitleCard {title} headingId="{id}-title" {blocks} />
	</div>
	<div class="panel" style={panelStyle}>
		<div class="content width-{width}">
			{@render children()}
		</div>
	</div>
</section>

<style lang="scss">
	@use 'tokens' as *;

	.section {
		background: $primary;

		@include desktop {
			display: grid;
			// 1/12 offset, 4/12 title column, 7/12 panel: the original Materialize grid.
			grid-template-columns: 8.333% 33.333% 1fr;
			min-height: 100vh;
		}
	}

	.intro {
		padding: 48px $gutter 32px;

		@include desktop {
			grid-column: 2;
			display: flex;
			align-items: center;
			padding: 0 12px;
		}
	}

	.panel {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40px $gutter;
		background-color: var(--panel-color, #{$tertiary});
		background-image: var(--panel-image, none);
		background-position: var(--panel-position, center top);
		background-size: cover;
		background-repeat: no-repeat;

		// Translucent wash between the photo and the content.
		&::before {
			content: '';
			position: absolute;
			inset: 0;
			background: var(--panel-overlay, transparent);
		}

		@include desktop {
			grid-column: 3;
			padding: 70px 0;
		}
	}

	.content {
		position: relative;
		width: 100%;

		@include desktop {
			&.width-narrow {
				width: 55.5%;
			}

			&.width-medium {
				width: 63.8%;
			}

			&.width-wide {
				width: 83.3%;
			}
		}
	}
</style>
