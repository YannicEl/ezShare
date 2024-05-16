<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Download you files</h1>

<div class="flex flex-col gap-4">
	{#each data.files as file}
		<a href="/api/download/{data.publicId}/{file.name}" target="_blank" class="underline"
			>{file.name}</a
		>
	{/each}
</div>
