<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import FilePreview from './FilePreview.svelte';
	import type { FileToUpload, UploadedFile } from '$lib/types';

	type Props = {
		files: (UploadedFile | FileToUpload)[];
		allowDownload?: boolean;
		allowRemove?: boolean;
	} & HTMLAttributes<HTMLUListElement>;
	let { files, allowDownload = true, allowRemove = true, ...props }: Props = $props();

	function removeFile(fileOrKey: File | string): void {
		const index = files.findIndex((file) => {
			if (file.uploaded && typeof fileOrKey === 'string') {
				return file.id === fileOrKey;
			} else if (!file.uploaded && fileOrKey instanceof File) {
				return file.upload.file === fileOrKey;
			}
		});
		if (index < 0) return;
		files.splice(index, 1);
	}
</script>

<ul {...props}>
	{#each files as file}
		<li class="py-2">
			<FilePreview {file} {allowDownload} {allowRemove} remove={removeFile} />
		</li>
	{/each}
</ul>
