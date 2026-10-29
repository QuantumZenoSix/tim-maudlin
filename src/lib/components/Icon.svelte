<script lang="ts">
	// Decorative Material Icons glyph; give the surrounding control its own accessible name.
	let { name, class: className = '' }: { name: string; class?: string } = $props();
</script>

<span class="material-icons {className}" aria-hidden="true">{name}</span>
