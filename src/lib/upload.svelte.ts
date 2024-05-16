import { _fetch } from './fetch';

export type UploadFileParams = {
	key: string;
	file: File;
};

export type FileUpload = {
	start: () => Promise<string>;
	abort: () => Promise<void>;
	progress: number;
};

const stream = new ReadableStream();

export function uploadFile({ key, file }: UploadFileParams): FileUpload {
	let progress = $state(0);
	let uploadId: string | null = null;

	async function start() {
		uploadId = await createUpload(key);

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

			progress = (uploadedParts.length / chunks.length) * 100;

			uploadedBytes += chunk.size;
			partNumber++;
		}

		await completeUpload({ key, uploadId, uploadedParts });

		return key;
	}

	async function abort() {
		if (uploadId === null) return;
		return abortUpload({ key, uploadId });
	}

	return {
		start,
		abort,
		get progress() {
			return progress;
		},
	};
}

async function createUpload(key: string): Promise<string> {
	const { uploadId } = await _fetch<{ key: string; uploadId: string }>(`/api/upload/${key}`, {
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

	const uploadedPart = await _fetch<R2UploadedPart>(
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
	await _fetch(`/api/upload/${key}/${uploadId}/complete`, {
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
	await _fetch(`/api/upload/${key}/${uploadId}`, {
		method: 'DELETE',
	});
}
