<script lang="ts">
	import { onDestroy, type Snippet } from 'svelte';
	import { addChildren, removeChildren } from '$lib/portal.svelte';

	type Props = {
		children: Snippet;
		key?: string;
	};
	let { children, key }: Props = $props();

	const id = addChildren(children, key);

	onDestroy(() => {
		removeChildren(id);
	});
</script>
