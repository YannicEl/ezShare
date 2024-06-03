<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import ShareLink from '$lib/components/ShareLink.svelte';
	import type { PageData } from './$types';

	type Props = { data: PageData };
	let { data }: Props = $props();
</script>

<h1>Files uploaded</h1>
<p class="mb-4">
	Successfully uploaded your files. Copy and share the
	<a href={`/${data.publicId}`} target="_blank" class="underline">download link </a> below.
</p>

<ShareLink publicId={data.publicId} />

<form method="POST">
	<Button icon="i-mdi-plus">Start new Upload</Button>
</form>
