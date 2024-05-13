import { $fetch } from '$lib/fetch';

export async function uploadFile(
	file: File,
	callback: (progress: number) => void = () => {}
): Promise<string> {
	const key = file.name;

	const uploadId = await createUpload(key);

	const chunkSize = 1024 * 1024 * 5;
	const chunks: Blob[] = [];

	let currentChunkStart = 0;
	while (currentChunkStart < file.size) {
		const chunk = file.slice(currentChunkStart, currentChunkStart + chunkSize);
		chunks.push(chunk);

		currentChunkStart += chunkSize;
	}

	const uploadedParts: R2UploadedPart[] = [];

	let partNumber = 1;
	let uploadedBytes = 0;
	for await (const chunk of chunks) {
		const uploadedPart = await uploadPart({ key, uploadId, partNumber, part: chunk });
		uploadedParts.push(uploadedPart);

		const progress = (uploadedParts.length / chunks.length) * 100;
		callback(progress);

		uploadedBytes += chunk.size;
		partNumber++;
	}

	await completeUpload({ key, uploadId, uploadedParts });

	return key;
}

async function createUpload(key: string): Promise<string> {
	const { uploadId } = await $fetch<{ key: string; uploadId: string }>(`/api/upload/${key}`, {
		method: 'POST',
	});

	return uploadId;
}

type UploadPartParams = {
	key: string;
	uploadId: string;
	partNumber: number;
	part: Blob;
};

async function uploadPart({
	key,
	uploadId,
	partNumber,
	part,
}: UploadPartParams): Promise<R2UploadedPart> {
	const headers = new Headers();
	headers.append('Content-Type', 'application/octet-stream');

	const uploadedPart = await $fetch<R2UploadedPart>(
		`/api/upload/${key}/${uploadId}/${partNumber}`,
		{
			method: 'PUT',
			headers,
			body: part,
		}
	);

	return uploadedPart;
}

type CompleteUploadParams = {
	key: string;
	uploadId: string;
	uploadedParts: R2UploadedPart[];
};

async function completeUpload({
	key,
	uploadId,
	uploadedParts,
}: CompleteUploadParams): Promise<void> {
	await $fetch(`/api/upload/${key}/${uploadId}/complete`, {
		method: 'POST',
		body: JSON.stringify({
			uploadedParts,
		}),
	});
}

type AbortUploadParams = {
	key: string;
	uploadId: string;
};

async function abortUpload({ key, uploadId }: AbortUploadParams): Promise<void> {
	await $fetch(`/api/upload/${key}/${uploadId}`, {
		method: 'DELETE',
	});
}
