<script lang="ts">
	import { onMount } from 'svelte';
	import Button from './Button.svelte';
	import { page } from '$app/state';

	type Props = {
		publicId: string;
	};
	let { publicId }: Props = $props();

	let url = $derived(`${page.url.origin}/${publicId}`);
	let copied = $state(false);

	let isSupported = $state<boolean>();
	onMount(() => (isSupported = 'writeText' in navigator.clipboard));

	async function copyToClipboard(): Promise<void> {
		try {
			await navigator.clipboard.writeText(url);
			copied = true;
		} catch (error) {}
	}
</script>

<div class="flex w-full gap-2">
	<input
		type="text"
		readonly
		value={url}
		class="border-gray-3 flex-1 rounded-md border px-2 py-1"
	/>

	{#if isSupported}
		<Button icon="i-mdi-content-copy" onclick={copyToClipboard} />
	{/if}
</div>

{#if copied}
	<div class="mt-1 w-full text-center">URL copied</div>
{/if}
