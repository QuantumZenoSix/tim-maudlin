<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import Section from '#lib/components/Section.svelte';
	import { contactEmail } from '#lib/content.js';
	import backdrop from '#lib/assets/img/geo-02.jpg';
</script>

<Section
	id="contact-link"
	title="Contact"
	blocks={[{ primary: 'Send a Message' }]}
	panel={{ image: backdrop, position: 'center top', overlay: 'rgba(23, 23, 23, 0.75)' }}
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
