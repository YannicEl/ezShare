<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import UploadFilePreview from './UploadFilePreview.svelte';
	import type { UploadedFile } from '$lib/types';

	type Props = {
		files: UploadedFile[] | File[];
	} & HTMLAttributes<HTMLUListElement>;
	let { files, ...props }: Props = $props();

	function removeFile(file: File): any {
		const index = files.findIndex((_file) => (_file = file));
		if (index < 0) return;
		files.splice(index, 1);
	}
</script>

<ul {...props}>
	{#each files as file}
		<li class="py-2">
			<UploadFilePreview {file} remove={removeFile} />
		</li>
	{/each}
</ul>
