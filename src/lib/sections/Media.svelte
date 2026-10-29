<script lang="ts">
	import Section from '#lib/components/Section.svelte';
	import VideoGallery from '#lib/components/VideoGallery.svelte';
	import { videos } from '#lib/content.js';
	import { choreograph, phoneAssembly } from '#lib/motion.js';

	// The videos slide in from the left while the title drops in; on leaving, the title rises
	// away and the panel sinks and fades.
	const motion = choreograph({
		desktop: [
			{
				target: 'panel-inner',
				range: ['top center', 'bottom bottom'],
				from: { opacity: 0, xPercent: -100, scale: 0.8 }
			},
			{ target: 'title-card', range: ['top bottom', 'top top'], from: { yPercent: -1000 } },
			{
				target: 'intro',
				trigger: 'intro',
				range: ['top top', 'bottom top'],
				to: { yPercent: -100 }
			},
			{ target: 'panel', range: ['bottom bottom', 'bottom top'], to: { opacity: 0, yPercent: 100 } }
		],
		phone: phoneAssembly()
	});
</script>

<Section
	id="media-link"
	title="Media"
	blocks={[{ primary: 'Talks, Lectures, and Interviews' }]}
	panel={{ color: 'rgb(185, 185, 185)' }}
	width="wide"
	{motion}
>
	<VideoGallery {videos} />
</Section>
