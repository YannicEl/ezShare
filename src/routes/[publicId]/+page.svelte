<script lang="ts">
	import FilePreviewList from '$lib/components/FilePreviewList.svelte';
	import type { PageData } from './$types';

	type Props = { data: PageData };
	let { data }: Props = $props();
</script>

<h1>Download you files</h1>

<FilePreviewList files={data.files} allowRemove={false} class="h-full" />
