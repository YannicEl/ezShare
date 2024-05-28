<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData, SubmitFunction } from './$types';
	import Button from '$lib/components/Button.svelte';
	import DropzoneInput from '$lib/components/DropzoneInput.svelte';
	import UploadList from '$lib/components/UploadList.svelte';
	import { formatBytes } from '$lib/formating';
	import Alert from '$lib/components/Alert.svelte';
	import PortalChild from '$lib/components/PortalChild.svelte';
	import ShareLink from '$lib/components/ShareLink.svelte';
	import { uploadFile } from '$lib/upload.svelte';

	type Props = { data: PageData; form: ActionData };
	let { data, form }: Props = $props();

	let loading = $state(false);
	let selectedFiles = $state<File[]>([]);

	let files = $derived.by(() => {
		const ret = [];
		if (data?.files) ret.push(...data.files);
		ret.push(...selectedFiles);
		return ret;
	});

	let sumSize = $derived(formatBytes(files.reduce((acc, cur) => acc + cur.size, 0)));
	let sumFiles = $derived(`${files.length} ${files.length > 1 ? 'Files' : 'File'}`);

	const submitFunction: SubmitFunction = async ({ action, formData, cancel }) => {
		formData.delete('file');
		loading = true;

		return async ({ result, update }) => {
			console.log(result);
			if (result.type === 'success' && result.data) {
				const { publicId } = result.data;

				await Promise.all(
					files.map(async (file) => {
						if (!(file instanceof File)) return;
						const upload = uploadFile({ publicId, file });
						return upload.start();
					})
				);
			}

			loading = false;
			update();
		};
	};
</script>

{#if !form?.success || form?.action !== 'complete'}
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
			<DropzoneInput name="file" multiple required bind:value={selectedFiles} />

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
			<DropzoneInput name="file" multiple required bind:value={selectedFiles} />
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
			{:else if form.error === 'unknown'}
				<Alert type="error" title="Unknown error">
					An unknown error occured. Please try again or contact support.
				</Alert>
			{/if}
		</PortalChild>
	{/if}
{:else}
	<h1>Files uploaded</h1>
	<p class="mb-4">Successfully uploaded your files. Copy and share the download link below.</p>

	<ShareLink publicId={form.publicId} />
{/if}
