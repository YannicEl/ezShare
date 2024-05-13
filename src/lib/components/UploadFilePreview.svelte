<script lang="ts">
	import { formatBytes } from '$lib/formating';
	type Props = { file: File; remove: () => void };

	let { file, remove }: Props = $props();

	let suffix = $derived.by(() => {
		const parts = file.name.split('.');
		if (parts.length < 2) return;

		return parts[parts.length - 1].toUpperCase();
	});

	let fileSize = $derived(formatBytes(file.size));
</script>

<div class="flex items-center justify-between">
	<div class="flex flex-col gap-1">
		<div class="text-lg font-semibold">{file.name}</div>
		<div class="flex gap-2">
			<div
				class="bg-blue-2 border-blue-3 text-blue-6 rounded-md border px-1.5 py-0.5 text-sm font-semibold"
			>
				{fileSize}
			</div>
			{#if suffix}
				<div
					class="bg-blue-2 border-blue-3 text-blue-6 rounded-md border px-1.5 py-0.5 text-sm font-semibold"
				>
					{suffix}
				</div>
			{/if}
		</div>
	</div>

	<button type="button" onclick={remove} class="rounded bg-black px-2 py-1 font-medium text-white"
		>delete</button
	>
</div>
