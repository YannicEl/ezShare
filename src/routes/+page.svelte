<script lang="ts">
	import type { ActionData, PageData } from './$types';
	import { enhance } from '$app/forms';

	export let form: ActionData;

	console.log(form);
</script>

<h1>Upload your files</h1>

{#if !form}
	<form method="POST" use:enhance enctype="multipart/form-data">
		<label>
			Name
			<input name="name" type="text" />
		</label>

		<label>
			File
			<input name="file" type="file" multiple />
		</label>

		<button>Log in</button>
	</form>
{:else}
	<p>Successfully uploaded your files. You can <a href={form.publicId}>download them here</a></p>
{/if}
