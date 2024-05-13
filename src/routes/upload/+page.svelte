<script lang="ts">
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import { uploadFile } from '$lib/upload';

	let files = $state<FileList>();
	let success = $state<string>();
	let progress = $state<number>(0);

	async function upload() {
		const file = files!.item(0)!;
		console.log(file);

		success = await uploadFile(file, (_progress) => {
			console.log(`Progress: ${_progress.toFixed(2)}`);
			progress = _progress;
		});

		console.log('done');
	}
</script>

<h1>Multipart Upload Test</h1>

<label>
	File
	<input type="file" name="file" bind:files />
</label>

<ProgressBar {progress} />

<button onclick={upload}>Upload</button>

{#if success}
	<a href="/download/{success}" target="_blank" class="underline">{success}</a>
{/if}
