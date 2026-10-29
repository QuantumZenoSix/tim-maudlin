<script lang="ts">
	import type { Snippet } from 'svelte';
	import { tick } from 'svelte';
	import { prefersReducedMotion } from 'svelte/motion';
	import { fly } from 'svelte/transition';
	import Icon from './Icon.svelte';

	interface Props {
		/** Top of the card, usually an image. The reveal button sits on its bottom edge. */
		media: Snippet;
		/** Card body below the media. */
		children: Snippet;
		/** Contents of the panel that slides up over the card. */
		reveal: Snippet;
		revealTitle: string;
		triggerIcon: string;
		triggerLabel: string;
		tone?: 'red' | 'grey';
	}

	let {
		media,
		children,
		reveal,
		revealTitle,
		triggerIcon,
		triggerLabel,
		tone = 'grey'
	}: Props = $props();

	const panelId = $props.id();
	let open = $state(false);
	let trigger: HTMLButtonElement;
	let closeButton: HTMLButtonElement | undefined = $state();

	async function show() {
		open = true;
		await tick();
		closeButton?.focus();
	}

	function hide() {
		open = false;
		trigger.focus();
	}
</script>

<article class="card">
	<div class="media">
		{@render media()}
		<button
			bind:this={trigger}
			type="button"
			class="fab"
			aria-expanded={open}
			aria-controls={open ? panelId : undefined}
			onclick={show}
		>
			<Icon name={triggerIcon} />
			<span class="visually-hidden">{triggerLabel}</span>
		</button>
	</div>
	<div class="body">
		{@render children()}
	</div>
	{#if open}
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions (Escape closes the panel) -->
		<div
			id={panelId}
			class="reveal tone-{tone}"
			role="region"
			aria-label={revealTitle}
			transition:fly={{
				// Slides up from the bottom of the card, like the original Materialize card reveal.
				y: '100%',
				opacity: 1,
				duration: prefersReducedMotion.current ? 0 : 300
			}}
			onkeydown={(event) => event.key === 'Escape' && hide()}
		>
			<div class="reveal-header">
				<h3 class="reveal-title">{revealTitle}</h3>
				<button bind:this={closeButton} type="button" class="close" onclick={hide}>
					<Icon name="close" />
					<span class="visually-hidden">Close {revealTitle}</span>
				</button>
			</div>
			{@render reveal()}
		</div>
	{/if}
</article>

<style lang="scss">
	@use 'tokens' as *;

	.card {
		position: relative;
		overflow: hidden;
		background: #fff;
		border-radius: 2px;
		@include hoverable($shadow-2);
	}

	.media {
		position: relative;

		:global(img) {
			width: 100%;
			border-radius: 2px 2px 0 0;
		}
	}

	.body {
		padding: 24px;
	}

	.fab {
		position: absolute;
		right: 24px;
		bottom: -20px;
		z-index: 1;
		display: grid;
		place-items: center;
		width: 40px;
		height: 40px;
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: $fab-red;
		color: #fff;
		box-shadow: $shadow-1;
		cursor: pointer;

		:global(.material-icons) {
			font-size: 1.6rem;
		}

		// Materialize "pulse": a ring that keeps expanding from the button.
		@media (prefers-reduced-motion: no-preference) {
			&::before {
				content: '';
				position: absolute;
				inset: 0;
				z-index: -1;
				border-radius: inherit;
				background: inherit;
				animation: pulse 1s cubic-bezier(0.24, 0, 0.38, 1) infinite;
			}
		}
	}

	@keyframes pulse {
		0% {
			opacity: 1;
			transform: scale(1);
		}

		50% {
			opacity: 0;
			transform: scale(1.5);
		}

		100% {
			opacity: 0;
			transform: scale(1.5);
		}
	}

	.reveal {
		position: absolute;
		inset: 0;
		z-index: 2;
		overflow-y: auto;
		padding: 24px;
		background: #d6d6d6;

		&.tone-red {
			background: $reveal-red;
		}
	}

	.reveal-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
	}

	.reveal-title {
		font-size: 24px;
		font-weight: 300;
		line-height: 32px;
		color: #212121;
	}

	.tone-red .reveal-title {
		font-family: $font-serif;
		font-weight: 700;
	}

	.close {
		display: grid;
		place-items: center;
		padding: 4px;
		border: 0;
		background: none;
		color: #212121;
		cursor: pointer;
	}
</style>
