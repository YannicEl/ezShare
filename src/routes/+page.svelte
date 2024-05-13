<script lang="ts">
	import { enhance } from '$app/forms';
	import type { FormEventHandler } from 'svelte/elements';
	import type { ActionData } from './$types';
	import type { SubmitFunction } from '@sveltejs/kit';
	import UploadFilePreview from '$lib/components/UploadFilePreview.svelte';

	type Props = { form: ActionData };
	let { form }: Props = $props();

	let files = $state<File[]>([]);

	const onFileSelect: FormEventHandler<HTMLInputElement> = ({ currentTarget }) => {
		const { files: fileList } = currentTarget;
		if (!fileList) return;

		for (const file of fileList) {
			files.push(file);
		}

		currentTarget.value = '';
	};

	const submitFunction: SubmitFunction = ({ formData }) => {
		files.forEach((file) => {
			formData.append('file', file);
		});
	};

	function removeFile(file: File): any {
		const index = files.indexOf(file);
		if (index < 0) return;
		files.splice(index, 1);
	}
</script>

{#if !form}
	<h1>Upload your files</h1>

	<form
		method="POST"
		use:enhance={submitFunction}
		enctype="multipart/form-data"
		class="mt-4 flex flex-col gap-4"
	>
		{#each files as file}
			<UploadFilePreview {file} remove={removeFile(file)} />
		{/each}

		<label>
			File
			<input name="file" type="file" multiple oninput={onFileSelect} />
		</label>

		<button class="rounded bg-black py-2 font-medium text-white">Upload</button>
	</form>
{:else}
	<h1>Success!</h1>
	<p>
		Successfully uploaded your files. You can <a href={form.publicId} class="underline"
			>download them here</a
		>
	</p>
{/if}
