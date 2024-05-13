<script lang="ts">
	import type { Snippet } from 'svelte';
	import Spinner from './Spinner.svelte';

	type Props = {
		loading?: boolean;
		children: Snippet;
	};

	let { loading = false, children }: Props = $props();
</script>

<button
	class="relative flex items-center justify-center rounded-md bg-black px-6 py-2 py-2 font-medium text-white"
	disabled={loading}
>
	{#if loading}
		<Spinner className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2" />
	{/if}

	<span class={loading ? 'opacity-0' : ''}>{@render children()}</span>
</button>
