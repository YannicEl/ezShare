<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import FilePreview from './FilePreview.svelte';
	import type { FileToUpload, UploadedFile } from '$lib/types';

	type Props = {
		files: (UploadedFile | FileToUpload)[];
	} & HTMLAttributes<HTMLUListElement>;
	let { files, ...props }: Props = $props();

	function removeFile(file: File): void {
		const index = files.findIndex((_file) => !_file.uploaded && _file.upload.file === file);
		if (index < 0) return;
		files.splice(index, 1);
	}
</script>

<ul {...props}>
	{#each files as file}
		<li class="py-2">
			<FilePreview {file} remove={removeFile} />
		</li>
	{/each}
</ul>
