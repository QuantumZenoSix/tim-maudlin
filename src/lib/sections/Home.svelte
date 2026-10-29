<script lang="ts">
	import TitleCard from '#lib/components/TitleCard.svelte';
	import { roles } from '#lib/content.js';
	import geometry from '#lib/assets/img/geo-03.jpg';
</script>

<header id="home-link" class="home">
	<div class="intro">
		<TitleCard title="Tim Maudlin" level={1} blocks={roles} accent="light" />
	</div>
	<div class="art" style="--art: url('{geometry}')"></div>
</header>

<style lang="scss">
	@use 'tokens' as *;

	.home {
		display: grid;
		// Phones keep the original split: title card beside a strip of the artwork.
		grid-template-columns: 56% 44%;
		min-height: calc(100svh - 56px);
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

	.art {
		background: $tertiary var(--art) center top / cover no-repeat;

		@include desktop {
			grid-column: 3;
		}
	}
</style>
