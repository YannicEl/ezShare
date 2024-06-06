<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData, SubmitFunction } from './$types';
	import Button from '$lib/components/Button.svelte';
	import DropzoneInput from '$lib/components/DropzoneInput.svelte';
	import FilePreviewList from '$lib/components/FilePreviewList.svelte';
	import { formatBytes } from '$lib/formating';
	import Alert from '$lib/components/Alert.svelte';
	import PortalChild from '$lib/components/PortalChild.svelte';
	import { uploadFile } from '$lib/upload.svelte';
	import type { FileToUpload, UploadedFile } from '$lib/types';
	import { concurrencPromises } from '$lib/promises';

	type Props = { data: PageData; form: ActionData };
	let { data, form }: Props = $props();

	let loading = $state(false);
	let files = $state<(UploadedFile | FileToUpload)[]>(data.files ?? []);

	function onFileSelect(selectedFiles: File[]): void {
		selectedFiles.forEach((file) => {
			files.push({
				uploaded: false,
				name: file.name,
				size: file.size,
				upload: uploadFile({ file }),
			});
		});
	}

	let sumSize = $derived(formatBytes(files.reduce((acc, cur) => acc + cur.size, 0)));
	let sumFiles = $derived(`${files.length} ${files.length > 1 ? 'Files' : 'File'}`);

	const submitFunction: SubmitFunction = async ({ action, formData, cancel }) => {
		formData.delete('file');
		loading = true;

		return async ({ result, update }) => {
			if (result.type === 'success' && result.data?.action === 'upload') {
				const { publicId } = result.data;

				await concurrencPromises(
					files
						.sort((a, b) => a.size - b.size)
						.map((file) => async () => {
							if (file.uploaded) return file;
							const fileId = await file.upload.start(publicId);

							const uploadedFile: UploadedFile = {
								uploaded: true,
								id: fileId,
								uploadId: publicId,
								name: file.name,
								size: file.size,
							};

							const index = files.indexOf(file);
							files[index] = uploadedFile;
						}),
					2
				);
			}

			loading = false;
			update();
		};
	};
</script>

<h1>Upload your files</h1>

{#if !files.length}
	<form
		id="upload"
		method="POST"
		action="?/upload"
		use:enhance={submitFunction}
		enctype="multipart/form-data"
		class="flex flex-1 flex-col gap-3"
	>
		<DropzoneInput name="file" multiple required oninput={onFileSelect} />

		<Button icon="i-mdi-plus" class="w-max place-self-end" {loading}>Add files</Button>
	</form>
{:else}
	<FilePreviewList {files} class="h-full" />

	<form
		id="upload"
		method="POST"
		action="?/upload"
		use:enhance={submitFunction}
		enctype="multipart/form-data"
		class="flex flex-1 flex-col gap-3"
	>
		<DropzoneInput name="file" multiple oninput={onFileSelect} />
	</form>

	<div class="flex items-center justify-between pt-4">
		<div class="text-gray-5">{sumFiles} 🞄 {sumSize}</div>

		<div class="flex gap-4">
			<Button form="upload" icon="i-mdi-plus" class="w-max" {loading}>Add files</Button>

			<form method="POST" action="?/complete" use:enhance>
				<Button icon="i-mdi-share" class="w-max" {loading}>Share</Button>
			</form>
		</div>
	</div>
{/if}

{#if form?.error}
	<PortalChild>
		{#if form.error === 'file_not_found'}
			<Alert type="error" title="Couldn't remove file">
				It appears that the file has already been removed.
			</Alert>
		{:else if form.error === 'upload_completed'}
			<Alert type="error" title="Upload already completed">
				You cannot upload or delete files on an already completed upload.
			</Alert>
		{:else}
			<Alert type="error" title="Unknown error">
				An unknown error occured. Please try again or contact support.
			</Alert>
		{/if}
	</PortalChild>
{/if}
