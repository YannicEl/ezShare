<script lang="ts">
	let files = $state<FileList>();
	let success = $state<string>();

	async function upload() {
		const file = files!.item(0)!;
		console.log(file);

		const key = file.name;
		const { uploadId } = await betterFetch<{ key: string; uploadId: string }>(
			`/api/upload/${key}`,
			{
				method: 'POST',
			}
		);

		const chunkSize = 1024 * 1024 * 5;
		const chunks: Blob[] = [];

		let currentChunkStart = 0;
		while (currentChunkStart < file.size) {
			const chunk = file.slice(currentChunkStart, currentChunkStart + chunkSize);
			chunks.push(chunk);

			currentChunkStart += chunkSize;
		}

		const uploadedParts: R2UploadedPart[] = await Promise.all(
			chunks.map(async (chunk, i) => {
				const partNumber = i + 1;

				const headers = new Headers();
				headers.append('Content-Type', 'application/octet-stream');

				const uploadedPart = await betterFetch<R2UploadedPart>(
					`/api/upload/${key}/${uploadId}/${partNumber}`,
					{
						method: 'PUT',
						headers,
						body: chunk,
					}
				);

				console.log(`Uploaded Part: ${partNumber}`);

				return uploadedPart;
			})
		);

		const res = await betterFetch(`/api/upload/${key}/${uploadId}/complete`, {
			method: 'POST',
			body: JSON.stringify({
				uploadedParts,
			}),
		});

		success = key;

		console.log(res);
	}

	async function betterFetch<T>(...params: Parameters<typeof fetch>): Promise<T> {
		const res = await fetch(...params);
		const json = (await res.json()) as T;
		return json;
	}
</script>

<h1>Multipart Upload Test</h1>

<label>
	File
	<input type="file" name="file" bind:files />
</label>

<button onclick={upload}>Upload</button>

{#if success}
	<a href="/download/{success}" target="_blank" class="underline">{success}</a>
{/if}
