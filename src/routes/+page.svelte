<script lang="ts">
	import { enhance } from '$app/forms';
	import type { FormEventHandler } from 'svelte/elements';
	import type { ActionData, SubmitFunction } from './$types';
	import UploadFilePreview from '$lib/components/UploadFilePreview.svelte';
	import Button from '$lib/components/Button.svelte';
	import { uploadFile, type FileUpload } from '$lib/upload.svelte';

	type Props = { form: ActionData };
	let { form }: Props = $props();

	let files = $state<
		{
			file: File;
			upload?: FileUpload;
		}[]
	>([]);
	let loading = $state(false);

	const onFileSelect: FormEventHandler<HTMLInputElement> = ({ currentTarget }) => {
		const { files: fileList } = currentTarget;
		if (!fileList) return;

		for (const file of fileList) {
			files.push({ file });
		}

		currentTarget.value = '';
	};

	const submitFunction: SubmitFunction = async ({ formData, cancel }) => {
		formData.delete('file');

		loading = true;

		return async ({ result, update }) => {
			console.log(result);
			if (result.type === 'success' && result.data) {
				const { publicId } = result.data as { publicId: string };

				files = files.map(({ file }) => {
					const key = `${publicId}/${file.name}`;
					const upload = uploadFile({ key, file });
					return { file, upload };
				});

				await Promise.all(files.map(async ({ upload }) => upload?.start()));
			}

			loading = false;

			update();
		};
	};

	function removeFile(file: File): any {
		const index = files.findIndex((e) => e.file === file);
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
			<UploadFilePreview file={file.file} upload={file.upload} remove={removeFile(file.file)} />
		{/each}

		<!-- <label>
			Name
			<input type="text" name="name" />
		</label>

		<label>
			Number
			<input type="number" name="number" />
		</label> -->

		<label>
			File
			<input name="file" type="file" multiple oninput={onFileSelect} />
		</label>

		<Button {loading}>Upload</Button>
	</form>
{:else}
	<h1>Success!</h1>
	<p>
		Successfully uploaded your files. You can <a href={form.publicId} class="underline"
			>download them here</a
		>
	</p>
{/if}
