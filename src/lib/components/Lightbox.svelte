<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		src: string;
		alt: string;
		caption: string;
	}

	let { src, alt, caption }: Props = $props();
	let dialog: HTMLDialogElement;
</script>

<button type="button" class="trigger" onclick={() => dialog.showModal()}>
	<img {src} {alt} />
	<span class="visually-hidden">Enlarge photo</span>
</button>

<!-- Like the original zoom: a click anywhere closes it. Escape closes it natively. -->
<dialog bind:this={dialog} aria-label={caption} onclick={() => dialog.close()}>
	<figure>
		<img {src} {alt} />
		<figcaption>{caption}</figcaption>
	</figure>
	<button type="button" class="close" onclick={() => dialog.close()}>
		<Icon name="close" />
		<span class="visually-hidden">Close photo</span>
	</button>
</dialog>

<style lang="scss">
	@use 'tokens' as *;

	.trigger {
		display: block;
		width: 100%;
		padding: 0;
		border: 0;
		background: none;
		cursor: zoom-in;
	}

	dialog {
		width: 100vw;
		max-width: none;
		height: 100vh;
		max-height: none;
		margin: 0;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: zoom-out;

		&::backdrop {
			background: rgba(0, 0, 0, 0.87);
		}

		&[open] {
			display: grid;
			place-items: center;
		}
	}

	figure {
		display: grid;
		justify-items: center;
		gap: 8px;
		padding: $gutter;
	}

	// Fill the screen height like the original zoom, without overflowing narrow screens.
	figure img {
		width: auto;
		height: calc(100vh - 80px);
		max-width: 100%;
		object-fit: contain;
	}

	figcaption {
		color: #fff;
		font-size: 14px;
	}

	.close {
		position: absolute;
		top: $gutter;
		right: $gutter;
		display: grid;
		place-items: center;
		padding: 4px;
		border: 0;
		background: none;
		color: #fff;
		cursor: pointer;
	}
</style>
