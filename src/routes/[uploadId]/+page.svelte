<script lang="ts">
	import type { PageData } from '../$types';

	export let data: PageData;
	console.log(data);
</script>

<h1>Download you files</h1>

{#each data.files as file}
	<a href={file.key} target="_blank">{file.name}</a>
{/each}
