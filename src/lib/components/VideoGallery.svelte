<script lang="ts">
	import type { Video } from '#lib/content.js';
	import Icon from './Icon.svelte';

	let { videos }: { videos: Video[] } = $props();

	// Until someone picks a video, the first one is in the player.
	let selectedId: string | null = $state(null);
	// The YouTube iframe is only created once someone asks to play; until then it's a thumbnail.
	let playing = $state(false);
	const current = $derived(videos.find((video) => video.id === selectedId) ?? videos[0]);

	function select(video: Video) {
		selectedId = video.id;
		playing = true;
	}

	function useFallbackThumbnail(event: Event) {
		// maxresdefault doesn't exist for every video; hqdefault always does.
		const img = event.currentTarget as HTMLImageElement;
		img.src = `https://i.ytimg.com/vi/${current.id}/hqdefault.jpg`;
	}
</script>

<div class="player">
	{#if playing}
		<iframe
			src="https://www.youtube-nocookie.com/embed/{current.id}?autoplay=1"
			title={current.title}
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		></iframe>
	{:else}
		<button type="button" class="poster" onclick={() => (playing = true)}>
			{#key current.id}
				<img
					src="https://i.ytimg.com/vi/{current.id}/maxresdefault.jpg"
					alt=""
					onerror={useFallbackThumbnail}
				/>
			{/key}
			<span class="play"><Icon name="play_arrow" /></span>
			<span class="poster-title">{current.title}</span>
			<span class="visually-hidden">Play video</span>
		</button>
	{/if}
</div>

<ul class="thumbnails" aria-label="More videos">
	{#each videos as video (video.id)}
		<li>
			<button
				type="button"
				class="thumbnail"
				aria-pressed={video.id === current.id}
				onclick={() => select(video)}
			>
				<img src="https://i.ytimg.com/vi/{video.id}/mqdefault.jpg" alt="" loading="lazy" />
				<span class="visually-hidden">Play: {video.title}</span>
			</button>
		</li>
	{/each}
</ul>

<style lang="scss">
	@use 'tokens' as *;

	.player {
		position: relative;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: #000;
		@include hoverable($shadow-3);

		iframe,
		.poster {
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			border: 0;
		}
	}

	.poster {
		padding: 0;
		background: #000;
		cursor: pointer;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}

	.play {
		position: absolute;
		top: 50%;
		left: 50%;
		display: grid;
		place-items: center;
		width: 68px;
		height: 48px;
		border-radius: 12px;
		background: rgba(33, 33, 33, 0.8);
		color: #fff;
		transform: translate(-50%, -50%);
		transition: background 0.2s;

		:global(.material-icons) {
			font-size: 36px;
		}

		.poster:hover &,
		.poster:focus-visible & {
			background: #f00;
		}
	}

	.poster-title {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		padding: 12px 16px 24px;
		background: linear-gradient(rgba(0, 0, 0, 0.6), transparent);
		color: #fff;
		font-size: 16px;
		text-align: left;
	}

	.thumbnails {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 15px;
		margin-top: 30px;

		@include desktop {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.thumbnail {
		position: relative;
		display: block;
		width: 100%;
		aspect-ratio: 16 / 9;
		padding: 0;
		border: 0;
		background: #000;
		box-shadow: $shadow-3;
		cursor: pointer;
		transition:
			transform 0.5s ease-out,
			box-shadow 0.5s ease-out;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		// Dim the videos that aren't playing.
		&::after {
			content: '';
			position: absolute;
			inset: 0;
			background: rgba(0, 0, 0, 0.356);
			transition: background 0.3s;
		}

		&:hover {
			box-shadow: 0 0 3px #000;
			transform: scale(1.03);
		}

		&:hover::after,
		&[aria-pressed='true']::after {
			background: transparent;
		}

		&[aria-pressed='true'] {
			outline: 3px solid $secondary;
			outline-offset: 2px;
		}
	}
</style>
