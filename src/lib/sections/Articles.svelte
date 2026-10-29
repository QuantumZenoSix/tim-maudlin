<script lang="ts">
	import Icon from '#lib/components/Icon.svelte';
	import Section from '#lib/components/Section.svelte';
	import { featuredReads, publicationProfiles } from '#lib/content.js';
	import { choreograph, phoneAssembly } from '#lib/motion.js';
	import backdrop from '#lib/assets/img/geo-04.jpg';

	// The panel grows into place while its backdrop rises from far below; as the section leaves,
	// the panel sinks, shrinks and fades. (The panel's entry and exit run in this order.)
	const motion = choreograph({
		desktop: [
			{
				target: 'panel',
				trigger: 'panel',
				range: ['top bottom', 'top top'],
				from: { opacity: 0, backgroundPosition: '30% -210vh', scale: 0.8 }
			},
			{ target: 'title-card', range: ['top bottom', 'top top'], from: { yPercent: -1000 } },
			{
				target: 'title-block',
				range: ['top bottom', 'top top'],
				from: { opacity: 0.5, yPercent: -1500 }
			},
			{
				target: 'panel-inner',
				trigger: 'panel-inner',
				range: ['top center', 'top top'],
				from: { opacity: 0 }
			},
			{ target: 'intro', range: ['top top', 'bottom top'], to: { yPercent: 100 } },
			{
				target: 'panel',
				range: ['top top', 'bottom top'],
				to: { opacity: 0, yPercent: 85, scale: 0.9 }
			}
		],
		phone: phoneAssembly()
	});
</script>

<Section
	id="publications-II-link"
	title="Publications II"
	blocks={[{ primary: 'Published Articles & More' }]}
	panel={{
		image: backdrop,
		position: 'center top',
		fill: 'rgba(185, 185, 185, 0.6)',
		gapBelow: '50px'
	}}
	{motion}
>
	<!-- Sharing a `name` makes the two panels an accordion: opening one closes the other. -->
	<div class="accordion">
		<details name="articles">
			<summary><Icon name="import_contacts" />Featured Reads</summary>
			<ul class="body">
				{#each featuredReads as read (read.link)}
					<li>
						<p class="source">{read.source}:</p>
						<a href={read.link} target="_blank" rel="external noopener">
							<Icon name="label_outline" />
							<span>{read.title}</span>
						</a>
					</li>
				{/each}
			</ul>
		</details>
		<details name="articles">
			<summary><Icon name="collections_bookmark" />Articles &amp; other Published work</summary>
			<div class="body">
				<p class="intro">Here you can find the latest publications available:</p>
				<ul>
					{#each publicationProfiles as profile (profile.link)}
						<li>
							<a class="underlined" href={profile.link} target="_blank" rel="external noopener">
								<Icon name="label_outline" />
								<span>{profile.source}</span>
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</details>
	</div>
</Section>

<style lang="scss">
	@use 'tokens' as *;

	.accordion {
		border: 1px solid #ddd;
		border-bottom: 0;
		box-shadow: $shadow-1;
	}

	summary {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 16px;
		border-bottom: 1px solid #ddd;
		background: #fff;
		line-height: 24px;
		cursor: pointer;
		list-style: none;

		&::-webkit-details-marker {
			display: none;
		}

		:global(.material-icons) {
			width: 2rem;
			font-size: 1.6rem;
		}
	}

	.body {
		padding: 32px;
		border-bottom: 1px solid #ddd;
		background: rgba(255, 255, 255, 0.475);
	}

	.source {
		margin: 15px 0 7px;
		text-decoration: underline;
		line-height: 25px;

		li:first-child & {
			margin-top: 0;
		}
	}

	.intro {
		margin-bottom: 25px;
	}

	a {
		display: inline-flex;
		align-items: center;
		gap: 15px;
		color: #000;
		font-style: italic;

		:global(.material-icons) {
			font-size: 16px;
		}
	}

	.underlined span {
		text-decoration: underline;
	}

	li + li .underlined {
		margin-top: 15px;
	}
</style>
