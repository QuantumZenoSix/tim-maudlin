<script lang="ts">
	import { navItems } from '#lib/content.js';
	import Icon from './Icon.svelte';

	let drawer: HTMLDialogElement;
	let menuButton: HTMLButtonElement;
	let drawerOpen = $state(false);

	function openDrawer() {
		drawer.showModal();
		drawerOpen = true;
	}

	function onDrawerClick(event: MouseEvent) {
		// A click on the dialog element itself (not its content) is a click on the backdrop.
		// Clicking a link closes too; the browser then follows the link to its section.
		if (event.target === drawer || (event.target as Element).closest('a')) drawer.close();
	}

	function onDrawerClose() {
		drawerOpen = false;
		menuButton.focus({ preventScroll: true });
	}
</script>

<nav class="rail" aria-label="Sections">
	<ul>
		{#each navItems as item (item.id)}
			<li>
				<a href="#{item.id}">
					<span aria-hidden="true">{item.numeral}</span>
					<span class="visually-hidden">{item.label}</span>
					<span class="tooltip" aria-hidden="true">{item.label}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>

<div class="topbar">
	<button
		bind:this={menuButton}
		type="button"
		class="menu-button"
		aria-haspopup="dialog"
		aria-expanded={drawerOpen}
		onclick={openDrawer}
	>
		<Icon name="menu" />
		<span class="visually-hidden">Open menu</span>
	</button>
</div>

<dialog
	bind:this={drawer}
	class="drawer"
	aria-label="Sections"
	onclick={onDrawerClick}
	onclose={onDrawerClose}
>
	<nav aria-label="Sections">
		<ul>
			{#each navItems as item (item.id)}
				<li><a href="#{item.id}">{item.label}</a></li>
			{/each}
		</ul>
	</nav>
</dialog>

<style lang="scss">
	@use 'tokens' as *;

	.rail {
		display: none;

		@include desktop {
			position: fixed;
			top: 0;
			left: 0;
			z-index: 5;
			display: block;
			width: 84px;
			height: 100vh;
			background: rgba(0, 0, 0, 0.576);
			box-shadow: $shadow-2;
		}

		ul {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 0 10px;
		}

		li {
			margin-top: 20px;
		}

		a {
			position: relative;
			display: block;
			padding: 0 15px;
			color: #fff;
			line-height: 64px;
		}
	}

	.tooltip {
		position: absolute;
		top: 50%;
		left: calc(100% + 8px);
		padding: 10px 8px;
		border-radius: 2px;
		background: #323232;
		color: #fff;
		font-size: 14px;
		line-height: 1.2;
		white-space: nowrap;
		opacity: 0;
		pointer-events: none;
		transform: translate(-6px, -50%);
		transition:
			opacity 0.2s,
			transform 0.2s;

		a:hover &,
		a:focus-visible & {
			opacity: 1;
			transform: translate(0, -50%);
		}
	}

	.topbar {
		display: flex;
		align-items: center;
		height: 56px;
		padding: 0 $gutter;
		background: #0a0a0a;
		box-shadow: $shadow-2;

		@include desktop {
			display: none;
		}
	}

	.menu-button {
		display: grid;
		place-items: center;
		padding: 4px;
		border: 0;
		background: none;
		color: #fff;
		cursor: pointer;
	}

	.drawer {
		width: min(300px, 85vw);
		max-width: none;
		height: 100vh;
		max-height: none;
		margin: 0;
		padding: 16px 0;
		border: 0;
		background: #fff;
		box-shadow: $shadow-2;

		&::backdrop {
			background: rgba(0, 0, 0, 0.5);
		}

		@media (prefers-reduced-motion: no-preference) {
			&[open] {
				animation: slide-in 0.25s ease-out;
			}
		}

		a {
			display: block;
			padding: 0 32px;
			color: $text;
			font-size: 14px;
			font-weight: 500;
			line-height: 48px;

			&:hover {
				background: rgba(0, 0, 0, 0.05);
			}
		}
	}

	@keyframes slide-in {
		from {
			transform: translateX(-100%);
		}
	}
</style>
