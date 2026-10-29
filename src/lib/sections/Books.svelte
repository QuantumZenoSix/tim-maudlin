<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import RevealCard from '#lib/components/RevealCard.svelte';
	import Section from '#lib/components/Section.svelte';
	import { books } from '#lib/content.js';
	import { choreograph, phoneAssembly } from '#lib/motion.js';
	import backdrop from '#lib/assets/img/pubs/Philosophy-of-Physics-01.jpg';

	const idPrefix = $props.id();
	let selected = $state(0);
	let aboutOpen = $state(false);
	const book = $derived(books[selected]);
	const tabs: HTMLButtonElement[] = [];

	function selectBook(index: number) {
		selected = index;
		// An open "About the Book" panel belongs to the previous book.
		aboutOpen = false;
	}

	// Arrow keys, Home and End move between years (WAI-ARIA tabs pattern, automatic activation).
	function onTabKeydown(event: KeyboardEvent) {
		const last = books.length - 1;
		const next = {
			ArrowRight: selected === last ? 0 : selected + 1,
			ArrowLeft: selected === 0 ? last : selected - 1,
			Home: 0,
			End: last
		}[event.key];
		if (next === undefined) return;
		event.preventDefault();
		selectBook(next);
		tabs[next].focus();
	}

	// The book card assembles from pieces: the cover drops in at 3x, the card text falls from far
	// above, the card and year tabs slide in from the right, and the backdrop pans in from the left.
	const motion = choreograph({
		desktop: [
			{ target: 'title-card', range: ['top bottom', 'top top'], from: { yPercent: -1000 } },
			{
				target: 'card',
				range: ['top bottom', 'top 30%'],
				from: { opacity: 0, yPercent: 200, xPercent: 500 }
			},
			{ target: 'tabs', range: ['top bottom', 'top top'], from: { opacity: 0.5, xPercent: 500 } },
			{
				target: 'title-block',
				range: ['top bottom', 'top top'],
				from: { opacity: 0.5, yPercent: -1500 }
			},
			{
				target: 'card-body',
				range: ['top bottom', 'top top'],
				from: { opacity: 0.5, yPercent: -1500 }
			},
			{
				target: 'panel',
				range: ['top bottom', 'bottom bottom'],
				from: { opacity: 0, backgroundPosition: '-100vw 0' }
			},
			{
				target: 'card-media',
				range: ['top bottom', 'top top'],
				from: { opacity: 0, yPercent: -600, scale: 3 }
			},
			{ target: 'fab', range: ['top bottom', 'top top'], from: { opacity: 0, xPercent: -1000 } },
			{
				target: 'panel-inner',
				range: ['bottom bottom', 'bottom top'],
				to: { yPercent: 100, scale: 0.8 }
			},
			{ target: 'intro', range: ['top top', 'bottom top'], to: { yPercent: 100 } }
		],
		phone: phoneAssembly([
			{
				target: 'card-media',
				trigger: 'card',
				range: ['top 90%', 'top 55%'],
				from: { scale: 1.4, opacity: 0 }
			},
			{
				target: 'tabs',
				trigger: 'self',
				range: ['top 98%', 'top 75%'],
				from: { xPercent: 30, opacity: 0 }
			}
		])
	});
</script>

<Section
	id="publications-I-link"
	title="Publications I"
	blocks={[{ primary: 'Published Books' }]}
	panel={{
		image: backdrop,
		position: 'left bottom',
		fill: 'rgba(185, 185, 185, 0.6)',
		padBottom: '20px'
	}}
	tall
	{motion}
>
	<!-- Clips the card's pieces to this column while they fly in, as on the original site. -->
	<div class="column">
		<div id="{idPrefix}-panel" role="tabpanel" aria-labelledby="{idPrefix}-tab-{selected}">
			<RevealCard
				revealTitle="About the Book"
				triggerIcon="more_horiz"
				triggerLabel="About the book"
				bind:open={aboutOpen}
			>
				{#snippet media()}
					<img src={book.cover} alt="Cover of {book.title}" />
				{/snippet}

				<h3 class="book-title">{book.title} ({book.year})</h3>
				<p>{book.publisher}</p>

				{#snippet reveal()}
					<span class="accent-bar"></span>
					<div class="description">
						{#each book.description as paragraph, index (index)}
							<p>{paragraph}</p>
						{/each}
					</div>
					<a class="buy" href={book.link} target="_blank" rel="external noopener">
						Buy <Icon name="shop" />
					</a>
				{/snippet}
			</RevealCard>
		</div>

		<div class="tabs" role="tablist" aria-label="Books by year" data-motion="tabs">
			{#each books as item, index (item.year)}
				<button
					bind:this={tabs[index]}
					id="{idPrefix}-tab-{index}"
					type="button"
					role="tab"
					aria-selected={index === selected}
					aria-controls="{idPrefix}-panel"
					tabindex={index === selected ? 0 : -1}
					onclick={() => selectBook(index)}
					onkeydown={onTabKeydown}
				>
					{item.year}
				</button>
			{/each}
		</div>
	</div>
</Section>

<style lang="scss">
	@use 'tokens' as *;

	// The original column had 12px side padding inside its clipping box; the negative margin
	// keeps the card at full width while matching that box.
	.column {
		@include desktop {
			margin: 0 -12px;
			padding: 0 12px;
			overflow: hidden;
		}
	}

	.book-title {
		margin-bottom: 8px;
		font-size: 24px;
		font-weight: 300;
		line-height: 32px;
	}

	.accent-bar {
		display: inline-block;
		width: 50px;
		margin-top: 15px;
		border-bottom: 5px solid #000;
	}

	.description {
		margin: 25px 0;
		line-height: 22px;

		p + p {
			margin-top: 12px;
		}

		p:first-child::first-letter {
			font-size: 2rem;
		}
	}

	.buy {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 36px;
		margin-top: 15px;
		padding: 0 16px;
		border-radius: 2px;
		background: $secondary;
		color: #fff;
		font-size: 14px;
		letter-spacing: 0.5px;
		text-transform: uppercase;
		box-shadow: $shadow-1;
	}

	.tabs {
		display: flex;
		margin-top: 16px;
		background: #fff;

		button {
			flex: 1;
			height: 48px;
			padding: 0 10px;
			border: 0;
			border-bottom: 2px solid transparent;
			background: none;
			color: rgba(238, 110, 115, 0.7);
			font-size: 12px;
			cursor: pointer;
			transition:
				color 0.28s,
				background-color 0.28s;

			@include xl {
				font-size: 14px;
			}

			&:hover,
			&[aria-selected='true'] {
				color: #ee6e73;
			}

			&[aria-selected='true'] {
				border-bottom-color: #f6b2b5;
				background: rgba(246, 178, 181, 0.2);
			}
		}
	}
</style>
