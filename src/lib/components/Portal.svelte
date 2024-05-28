<script lang="ts">
	import { children } from '$lib/portal.svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type Props = HTMLAttributes<HTMLDivElement>;
	let { ...props }: Props = $props();
</script>

<div {...props}>
	{#each children as [_, child]}
		{@render child()}
	{/each}
</div>
