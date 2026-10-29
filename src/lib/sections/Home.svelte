<script lang="ts">
	import TitleCard from '#lib/components/TitleCard.svelte';
	import { roles } from '#lib/content.js';
	import { choreograph } from '#lib/motion.js';
	import geometry from '#lib/assets/img/geo-03.jpg';

	// As the page scrolls away from Home, the title card sinks and fades, then the artwork follows.
	const motion = choreograph({
		desktop: [
			{ target: 'intro', range: ['top top', 'bottom top'], to: { opacity: 0, y: 700 } },
			{
				target: 'art',
				trigger: 'art',
				range: ['bottom bottom', 'bottom top'],
				to: { opacity: 0, y: 500 }
			}
		],
		phone: [
			{ target: 'intro', range: ['top top', 'bottom top'], to: { opacity: 0, y: 120 } },
			{
				target: 'art',
				trigger: 'art',
				range: ['bottom bottom', 'bottom top'],
				to: { opacity: 0, y: 120 }
			}
		]
	});
</script>

<header id="home-link" class="home" {@attach motion}>
	<div class="intro" data-motion="intro">
		<TitleCard title="Tim Maudlin" level={1} blocks={roles} accent="light" />
	</div>
	<!-- The grey panel stays put while the artwork on it fades and sinks away. -->
	<div class="art-panel">
		<div class="art" data-motion="art" style="--art: url('{geometry}')"></div>
	</div>
</header>

<style lang="scss">
	@use 'tokens' as *;

	.home {
		display: grid;
		// Phones keep the original split: title card beside a strip of the artwork.
		grid-template-columns: 56% 44%;
		min-height: calc(100svh - 56px);
		overflow: hidden;
		background: $primary;

		@include desktop {
			grid-template-columns: 8.333% 33.333% 1fr;
			height: 100vh;
			min-height: 0;
		}
	}

	.intro {
		display: flex;
		align-items: center;
		padding: 24px 0 24px 4px;

		@include desktop {
			grid-column: 2;
			padding: 0;
		}

		// The phone layout has little width; let the long institute name wrap tightly.
		:global(.title-card) {
			@media (max-width: #{$desktop - 1px}) {
				padding: 15px 12px;
			}
		}
	}

	.art-panel {
		display: flex;
		background: $tertiary;

		@include desktop {
			grid-column: 3;
		}
	}

	.art {
		flex: 1;
		background: var(--art) left top / cover no-repeat;
	}
</style>
