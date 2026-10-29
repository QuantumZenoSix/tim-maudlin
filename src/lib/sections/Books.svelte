<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import RevealCard from '#lib/components/RevealCard.svelte';
	import Section from '#lib/components/Section.svelte';
	import { books } from '#lib/content.js';
	import backdrop from '#lib/assets/img/pubs/Philosophy-of-Physics-01.jpg';

	const idPrefix = $props.id();
	let selected = $state(0);
	const book = $derived(books[selected]);
	const tabs: HTMLButtonElement[] = [];

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
		selected = next;
		tabs[next].focus();
	}
</script>

<Section
	id="publications-I-link"
	title="Publications I"
	blocks={[{ primary: 'Published Books' }]}
	panel={{ image: backdrop, position: 'center bottom', overlay: 'rgba(185, 185, 185, 0.6)' }}
>
	<div id="{idPrefix}-panel" role="tabpanel" aria-labelledby="{idPrefix}-tab-{selected}">
		<!-- A new card per book, so an open "About the Book" panel closes when the year changes. -->
		{#key book}
			<RevealCard
				revealTitle="About the Book"
				triggerIcon="more_horiz"
				triggerLabel="About the book"
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
		{/key}
	</div>

	<div class="tabs" role="tablist" aria-label="Books by year">
		{#each books as item, index (item.year)}
			<button
				bind:this={tabs[index]}
				id="{idPrefix}-tab-{index}"
				type="button"
				role="tab"
				aria-selected={index === selected}
				aria-controls="{idPrefix}-panel"
				tabindex={index === selected ? 0 : -1}
				onclick={() => (selected = index)}
				onkeydown={onTabKeydown}
			>
				{item.year}
			</button>
		{/each}
	</div>
</Section>

<style lang="scss">
	@use 'tokens' as *;

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
