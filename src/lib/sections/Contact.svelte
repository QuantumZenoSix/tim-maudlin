<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import Section from '#lib/components/Section.svelte';
	import { contactEmail } from '#lib/content.js';
	import { choreograph, phoneAssembly } from '#lib/motion.js';
	import backdrop from '#lib/assets/img/geo-02.jpg';

	// The panel drops in from above with its backdrop sliding down; title and subtitle fall into
	// place separately, then the card fades in.
	const motion = choreograph({
		desktop: [
			{ target: 'title-card', range: ['top bottom', 'top top'], from: { yPercent: -1000 } },
			{
				target: 'title-block',
				range: ['top bottom', 'top top'],
				from: { opacity: 0.5, yPercent: -1500 }
			},
			{
				target: 'panel',
				range: ['top bottom', 'top top'],
				from: { backgroundPosition: '30% -210vh', yPercent: -200 }
			},
			{ target: 'panel-inner', range: ['top 50%', 'bottom bottom'], from: { opacity: 0 } }
		],
		phone: phoneAssembly()
	});
</script>

<Section
	id="contact-link"
	title="Contact"
	blocks={[{ primary: 'Send a Message' }]}
	panel={{ image: backdrop, position: 'left top', fill: 'rgba(23, 23, 23, 0.745)' }}
	{motion}
>
	<div class="contact-card">
		<p>Get in touch by email.</p>
		<a class="email" href="mailto:{contactEmail}">
			Send an email <Icon name="send" />
		</a>
	</div>
</Section>

<style lang="scss">
	@use 'tokens' as *;

	.contact-card {
		padding: 25px;
		border-radius: 3px;
		background: rgba(61, 61, 61, 0.829);
		color: #fff;
		@include hoverable($shadow-4);
	}

	.email {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 36px;
		margin-top: 20px;
		padding: 0 16px;
		border-radius: 2px;
		background: $secondary;
		color: #fff;
		font-size: 14px;
		letter-spacing: 0.5px;
		text-transform: uppercase;
		box-shadow: $shadow-1;
	}
</style>
