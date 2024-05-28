<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData, SubmitFunction } from './$types';
	import Button from '$lib/components/Button.svelte';
	import DropzoneInput from '$lib/components/DropzoneInput.svelte';
	import UploadList from '$lib/components/UploadList.svelte';
	import { formatBytes } from '$lib/formating';

	type Props = { data: PageData; form: ActionData };
	let { data, form }: Props = $props();

	let loading = $state(false);
	let selectedFiles = $state<File[]>([]);

	let files = $derived.by(() => {
		if (data?.files) return data.files;
		return selectedFiles;
	});

	let sumSize = $derived(formatBytes(files.reduce((acc, cur) => acc + cur.size, 0)));
	let sumFiles = $derived(`${files.length} ${files.length > 1 ? 'Files' : 'File'}`);

	const submitFunction: SubmitFunction = async ({ action, formData, cancel }) => {
		// formData.delete('file');
		// loading = true;
		// return async ({ result, update }) => {
		// 	console.log(result);
		// 	if (result.type === 'success' && result.data) {
		// 		const { publicId } = result.data;
		// 		files = files.map((file) => {
		// 			const key = `${publicId}/${file.name}`;
		// 			file.upload = uploadFile({ key, file: file.file });
		// 			file.uploaded = false;
		// 			return file;
		// 		});
		// 		await Promise.all(files.map(async ({ upload }) => upload?.start()));
		// 	}
		// 	loading = false;
		// 	update();
		// };
	};
</script>

<!-- {#if !form} -->
<h1>Upload your files {data?.publicId}</h1>

{#if !files.length}
	<form
		id="upload"
		method="POST"
		action="?/upload"
		use:enhance={submitFunction}
		enctype="multipart/form-data"
		class="flex flex-1 flex-col gap-3"
	>
		<DropzoneInput name="file" multiple bind:value={selectedFiles} />

		<Button icon="i-mdi-plus" class="w-max place-self-end" {loading}>Add files</Button>
	</form>
{:else}
	<UploadList {files} class="h-full" />

	<form
		id="upload"
		method="POST"
		action="?/upload"
		use:enhance={submitFunction}
		enctype="multipart/form-data"
		class="flex flex-1 flex-col gap-3"
	>
		<DropzoneInput name="file" multiple bind:value={selectedFiles} />
	</form>

	<div class="border-gray-2 flex items-center justify-between pt-4">
		<div class="text-gray-5 font-medium">{sumFiles} 🞄 {sumSize}</div>

		<div class="flex gap-4">
			<!-- <Button icon="i-mdi-plus" class="w-max" {loading}>Add files</Button> -->
			<Button form="upload" icon="i-mdi-tray-arrow-up" class="w-max" {loading}>Upload</Button>
		</div>
	</div>
{/if}

<!-- <div class="flex flex-1 flex-col">
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
	</div> -->

<!-- {:else}
	<h1>Success!</h1>
	<p>
		Successfully uploaded your files. You can <a href={form.publicId} class="underline"
			>download them here</a
		>
	</p>
{/if} -->
