<script lang="ts">
	import { formatBytes } from '$lib/formating';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import ProgressBar from './ProgressBar.svelte';
	import type { FileToUpload, UploadedFile } from '$lib/types';

	type Props = {
		file: UploadedFile | FileToUpload;
		remove: (file: File) => void;
	};

	let { file, remove }: Props = $props();

	let suffix = $derived.by(() => {
		const parts = file.name.split('.');
		if (parts.length < 2) return;
		return parts[parts.length - 1].toUpperCase();
	});

	let fileSize = $derived(formatBytes(file.size));

	let fileInfo = $derived.by(() => {
		const info = [];
		info.push(fileSize);
		if (suffix) info.push(suffix);
		return info.join(' 🞄 ');
	});

	const submitFunction: SubmitFunction = async ({ cancel }) => {
		if (!file.uploaded) {
			remove(file.upload.file);
			cancel();
		}
	};
</script>

<div class="flex items-center justify-between">
	<div class="flex flex-col">
		<div class="font-medium">{file.name}</div>
		<div class="text-gray-5 text-sm">{fileInfo}</div>
	</div>

	<div class="w-25/100 flex items-center justify-end">
		{#if !file.uploaded && file.upload.status === 'uploading'}
			<ProgressBar value={file.upload.progress} />
		{:else}
			<form method="POST" action="?/remove" use:enhance={submitFunction} class="flex items-center">
				{#if 'id' in file}
					<input type="hidden" name="file" value={file.id} />
				{/if}
				<button class="i-mdi-delete-outline hover:text-red-5">delete</button>
			</form>
		{/if}
	</div>
</div>
