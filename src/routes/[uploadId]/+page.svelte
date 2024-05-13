<script lang="ts">
	import type { PageData } from '../$types';

	export let data: PageData;
	console.log(data);
</script>

<h1>Download you files</h1>

<div class="flex flex-col gap-4">
	<div>time: {data.time}</div>
	{#each data.files as file}
		<a href={file.key} target="_blank" class="underline">{file.name}</a>
	{/each}
</div>
