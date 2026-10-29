<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Attachment } from 'svelte/attachments';
	import type { TitleBlock } from '#lib/content.js';
	import TitleCard from './TitleCard.svelte';

	interface Props {
		id: string;
		title: string;
		blocks: TitleBlock[];
		/**
		 * Right-hand panel backdrop: `color` (default none) and `image` sit behind a full-size
		 * inner layer painted with `fill` (often translucent), which holds the content. On desktop,
		 * `padBottom` extends the backdrop below the content and `gapBelow` leaves page background
		 * under the panel; both reproduce the original section heights the scroll ranges rely on.
		 */
		panel: {
			color?: string;
			image?: string;
			position?: string;
			fill?: string;
			padBottom?: string;
			gapBelow?: string;
		};
		/** Width of the content column inside the panel on desktop. */
		width?: 'narrow' | 'medium' | 'wide';
		/** 110vh instead of 100vh on desktop, as in the original About and Books sections. */
		tall?: boolean;
		/** Scroll choreography, see `#lib/motion`. */
		motion?: Attachment<HTMLElement>;
		children: Snippet;
	}

	let {
		id,
		title,
		blocks,
		panel,
		width = 'medium',
		tall = false,
		motion,
		children
	}: Props = $props();

	const panelStyle = $derived(
		[
			panel.color && `--panel-color: ${panel.color}`,
			panel.image && `--panel-image: url('${panel.image}')`,
			panel.position && `--panel-position: ${panel.position}`,
			panel.fill && `--panel-fill: ${panel.fill}`,
			panel.padBottom && `--panel-pad-bottom: ${panel.padBottom}`,
			panel.gapBelow && `--panel-gap-below: ${panel.gapBelow}`
		]
			.filter(Boolean)
			.join('; ')
	);
</script>

<section {id} class="section" class:tall aria-labelledby="{id}-title" {@attach motion}>
	<div class="intro" data-motion="intro">
		<TitleCard {title} headingId="{id}-title" {blocks} />
	</div>
	<div class="panel" data-motion="panel" style={panelStyle}>
		<div class="panel-inner" data-motion="panel-inner">
			<div class="content width-{width}" data-motion="content">
				{@render children()}
			</div>
		</div>
	</div>
</section>

<style lang="scss">
	@use 'tokens' as *;

	.section {
		// Clips pieces while they're scattered outside the section, as on the original site.
		overflow: hidden;
		background: $primary;

		@include desktop {
			display: grid;
			// 1/12 offset, 4/12 title column, 7/12 panel: the original Materialize grid.
			grid-template-columns: 8.333% 33.333% 1fr;
		}
	}

	.intro {
		padding: 48px $gutter 32px;

		// The title is centred in the section's first screenful, not its full height.
		@include desktop {
			grid-column: 2;
			align-self: start;
			display: flex;
			align-items: center;
			height: 100vh;
			padding: 0 12px;
		}
	}

	.panel {
		display: flex;
		// No colour by default: when the scroll animations pan the image away, the page shows
		// through, as on the original site.
		background-color: var(--panel-color, transparent);
		background-image: var(--panel-image, none);
		background-position: var(--panel-position, left top);
		background-size: cover;
		background-repeat: no-repeat;

		@include desktop {
			grid-column: 3;
			margin-bottom: var(--panel-gap-below, 0);
			padding-bottom: var(--panel-pad-bottom, 0);
		}
	}

	.panel-inner {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
		padding: 40px $gutter;
		background: var(--panel-fill, transparent);

		// The section's height comes from here (plus the panel's padBottom/gapBelow), as on the
		// original site; the scroll ranges are measured against it.
		@include desktop {
			min-height: 100vh;
			padding: 70px 0;

			.tall & {
				min-height: 110vh;
			}
		}
	}

	.content {
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
