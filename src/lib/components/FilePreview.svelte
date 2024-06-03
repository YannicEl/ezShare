<script lang="ts">
	import { formatBytes } from '$lib/formating';
	import { enhance } from '$app/forms';
	import ProgressBar from './ProgressBar.svelte';
	import type { FileToUpload, UploadedFile } from '$lib/types';
	import type { SubmitFunction } from '../../routes/$types';
	import PortalChild from './PortalChild.svelte';
	import Alert from './Alert.svelte';

	type Props = {
		file: UploadedFile | FileToUpload;
		allowDownload?: boolean;
		allowRemove?: boolean;
		remove: (fileOrKey: File | string) => void;
	};
	let { file, allowDownload = true, allowRemove = true, remove }: Props = $props();

	let error = $state<string>();

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

		return ({ result }) => {
			if (result.type === 'failure') {
				error = result.data?.error;
			}

			if (result.type === 'success' && result.data?.action === 'remove') {
				remove(result.data.fileId);
			}
		};
	};
</script>

<div class="grid grid-cols-4 gap-2">
	<div class="col-span-3 flex flex-col">
		<div class="flex-grow-0 overflow-hidden text-ellipsis whitespace-nowrap font-medium">
			{file.name}
		</div>
		<div class="text-gray-5 text-sm">{fileInfo}</div>
	</div>

	<div class="col-span-1 flex items-center justify-end">
		{#if !file.uploaded && file.upload.status === 'uploading'}
			<ProgressBar value={file.upload.progress} />
		{:else}
			{#if file.uploaded && allowDownload}
				<a
					href="/api/download/{file.uploadId}/{file.id}"
					target="_blank"
					class="i-mdi-tray-arrow-down hover:text-blue-5"
				>
				</a>
			{/if}

			{#if allowRemove}
				<form
					method="POST"
					action="?/remove"
					use:enhance={submitFunction}
					class="flex items-center"
				>
					{#if 'id' in file}
						<input type="hidden" name="fileId" value={file.id} />
					{/if}
					<button class="i-mdi-delete-outline hover:text-red-5">delete</button>
				</form>
			{/if}
		{/if}
	</div>
</div>

<PortalChild key="upload_completed">
	{#if error === 'upload_completed'}
		<Alert type="error" title="Upload already completed">
			You cannot upload or delete files on an already completed upload.
		</Alert>
	{/if}
</PortalChild>
