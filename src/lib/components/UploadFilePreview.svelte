<script lang="ts">
	import { formatBytes } from '$lib/formating';
	import type { FileUpload } from '$lib/upload.svelte';
	import Gauge from '$lib/components/Gauge.svelte';
	import { enhance } from '$app/forms';

	type Props = {
		uploadId?: string;
		id?: string;
		name: string;
		size: number;
		uploaded: boolean;
		upload?: FileUpload;
		remove?: () => void;
	};

	let { uploadId, id, name, size, uploaded, upload, remove }: Props = $props();

	let suffix = $derived.by(() => {
		console.log(name);
		const parts = name.split('.');
		if (parts.length < 2) return;

		return parts[parts.length - 1].toUpperCase();
	});

	let fileSize = $derived(formatBytes(size));
</script>

<div class="flex flex-col gap-2">
	<div class="flex items-center justify-between">
		<div class="flex flex-col gap-1">
			<div class="text-lg font-semibold">{name}</div>
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

		{#if upload}
			<Gauge value={upload.progress} className="w-12" />
		{/if}

		<form method="POST" action="?/remove" use:enhance class="flex flex-1 flex-col">
			<input type="hidden" name="upload" value={uploadId} />
			<input type="hidden" name="file" value={id} />
			<button class="rounded bg-black px-2 py-1 font-medium text-white">delete</button>
		</form>
	</div>
</div>
