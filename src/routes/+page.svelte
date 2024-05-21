<script lang="ts">
	import { enhance } from '$app/forms';
	import type { FormEventHandler } from 'svelte/elements';
	import type { ActionData, PageData, SubmitFunction } from './$types';
	import UploadFilePreview from '$lib/components/UploadFilePreview.svelte';
	import Button from '$lib/components/Button.svelte';
	import { uploadFile, type FileUpload } from '$lib/upload.svelte';

	type Props = { form: ActionData };
	let { form }: Props = $props();

	let files = $state<
		{
			uploadId?: string;
			id?: string;
			name: string;
			size: number;
			file?: File;
			uploaded: boolean;
			upload?: FileUpload;
		}[]
	>(form?.files ? form.files : []);
	let loading = $state(false);

	const onFileSelect: FormEventHandler<HTMLInputElement> = ({ currentTarget }) => {
		const { files: fileList } = currentTarget;
		if (!fileList) return;

		for (const file of fileList) {
			const { name, size } = file;
			files.push({
				file,
				name,
				size,
				uploaded: false,
			});
		}

		currentTarget.value = '';
	};

	const submitFunction: SubmitFunction = async ({ action, formData, cancel }) => {
		formData.delete('file');

		loading = true;

		return async ({ result, update }) => {
			console.log(result);
			if (result.type === 'success' && result.data) {
				const { publicId } = result.data;

				files = files.map((file) => {
					const key = `${publicId}/${file.name}`;
					file.upload = uploadFile({ key, file: file.file });
					file.uploaded = false;

					return file;
				});

				await Promise.all(files.map(async ({ upload }) => upload?.start()));
			}

			loading = false;

			update();
		};
	};

	function removeFile(file: File): any {
		// const index = files.findIndex((e) => e.file === file);
		// if (index < 0) return;
		// files.splice(index, 1);
	}
</script>

{#if !form}
	<div class="border-gray-3 border-b p-5">
		<h1>Upload your files</h1>
	</div>

	<div class="flex flex-1 flex-col">
		<div class="relative flex-1">
			<ul class="absolute h-full w-full overflow-auto">
				{#each files as file}
					<li class="border-gray-3 border-b px-5 pb-2 pt-1">
						<UploadFilePreview {...file} />
					</li>
				{/each}

				<form
					id="upload"
					method="POST"
					action="?/upload"
					use:enhance={submitFunction}
					enctype="multipart/form-data"
					class="flex flex-1 flex-col"
				>
					{#if form?.publicId}
						<input type="hidden" name="uploadId" value={form.publicId} />
					{/if}

					<label class="mt-4 flex items-center justify-center gap-2">
						<div
							class="flex w-max cursor-pointer items-center justify-center gap-2 rounded bg-black px-4 py-2 font-medium text-white"
						>
							Add Files <div class="i-mdi-upload"></div>
						</div>
						<input name="file" type="file" multiple oninput={onFileSelect} />
					</label>
				</form>
			</ul>
		</div>

		<div class="border-gray-3 border-t p-5">
			<Button form="upload" {loading}>Upload</Button>
		</div>
	</div>
{:else}
	<h1>Success!</h1>
	<p>
		Successfully uploaded your files. You can <a href={form.publicId} class="underline"
			>download them here</a
		>
	</p>
{/if}

<style>
	input[type='file']::file-selector-button {
		display: none;
	}
</style>
