<script lang="ts">
	import Section from '#lib/components/Section.svelte';
	import VideoGallery from '#lib/components/VideoGallery.svelte';
	import { videos } from '#lib/content.js';
</script>

<Section
	id="media-link"
	title="Media"
	blocks={[{ primary: 'Talks, Lectures, and Interviews' }]}
	panel={{}}
	width="wide"
>
	<VideoGallery {videos} />
</Section>
