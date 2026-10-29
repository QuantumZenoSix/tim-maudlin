<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import Lightbox from '#lib/components/Lightbox.svelte';
	import RevealCard from '#lib/components/RevealCard.svelte';
	import Section from '#lib/components/Section.svelte';
	import { profile, type InfoItem } from '#lib/content.js';
	import portrait from '#lib/assets/img/profile.jpg';

	const lists: { heading: string; icon: string; items: InfoItem[] }[] = [
		{ heading: 'Education', icon: 'school', items: profile.education },
		{ heading: 'Memberships', icon: 'turned_in_not', items: profile.memberships },
		{ heading: 'Awards', icon: 'class', items: profile.awards }
	];
</script>

<Section
	id="about-tim-link"
	title="About Tim"
	blocks={[{ primary: 'Professor of Philosophy', secondary: 'New York University' }]}
	panel={{}}
	width="narrow"
>
	<RevealCard
		revealTitle="Additional Information"
		triggerIcon="add"
		triggerLabel="Additional information"
		tone="red"
	>
		{#snippet media()}
			<Lightbox src={portrait} alt="Professor Tim Maudlin" caption="Professor Maudlin" />
		{/snippet}

		<p class="bio">{profile.bio}</p>

		{#snippet reveal()}
			{#each lists as list (list.heading)}
				<h4>{list.heading}</h4>
				<ul>
					{#each list.items as item (item.text)}
						<li>
							<Icon name={list.icon} />
							<span>
								{#if item.href}
									<a href={item.href} target="_blank" rel="external noopener">{item.text}</a>
								{:else}
									{item.text}
								{/if}
								{#if item.note}<em>{item.note}</em>{/if}
							</span>
						</li>
					{/each}
				</ul>
			{/each}
			<ul class="chips" aria-label="Interests">
				{#each profile.interests as interest (interest.label)}
					<li class="chip">
						<img src={interest.image} alt={interest.alt} />
						{interest.label}
					</li>
				{/each}
			</ul>
		{/snippet}
	</RevealCard>
</Section>

<style lang="scss">
	@use 'tokens' as *;

	.bio {
		font-family: $font-body;
		line-height: 1.3;
		letter-spacing: 0.1px;
		color: #000;

		&::first-letter {
			float: left;
			margin-right: 4px;
			font-size: 4rem;
			line-height: 0.8;
			text-shadow: 0 0 1px rgb(24, 24, 24);
		}
	}

	h4 {
		margin-top: 20px;
		font-size: 1.2rem;
	}

	ul {
		margin: 8px 0 0 15px;
	}

	li {
		display: flex;
		gap: 15px;
		margin-top: 3px;
		line-height: 1.3;

		:global(.material-icons) {
			flex: none;
			margin-top: 2px;
			font-size: 16px;
		}

		a {
			color: #000;
			text-decoration: underline;
		}

		em {
			display: block;
		}
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		margin: 35px 0 0;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		height: 32px;
		padding: 0 12px 0 0;
		border-radius: 16px;
		background: #e4e4e4;
		color: rgba(0, 0, 0, 0.6);
		font-size: 13px;
		font-weight: 500;
		@include hoverable(none);

		img {
			width: 32px;
			height: 32px;
			border-radius: 50%;
			object-fit: cover;
		}
	}
</style>
