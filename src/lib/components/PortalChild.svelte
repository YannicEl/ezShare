<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';
	import { addChildren, removeChildren } from '$lib/portal.svelte';

	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();

	const id = addChildren(children);

	onDestroy(() => {
		removeChildren(id);
	});
</script>
