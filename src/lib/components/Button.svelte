<script lang="ts">
	import type { Snippet } from 'svelte';
	import Spinner from './Spinner.svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = {
		loading?: boolean;
		icon?: string;
		children: Snippet;
	} & HTMLButtonAttributes;

	let { loading = false, children, icon, ...props }: Props = $props();
</script>

<button disabled={loading} {...props}>
	{#if loading}
		<Spinner className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2" />
	{/if}

	<span class={loading ? 'opacity-0' : ''}>{@render children()}</span>
	<span class={icon}></span>
</button>

<style>
	button {
		--apply: 'relative flex items-center justify-center bg-black gap-2 rounded-md px-6 py-2 py-2 font-medium text-white';
	}
</style>
