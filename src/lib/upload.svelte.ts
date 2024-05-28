import { _fetch } from './fetch';

export type UploadFileParams = {
	publicId: string;
	file: File;
};

export type FileUpload = {
	start: () => Promise<string | undefined>;
	abort: () => Promise<void>;
	progress: number;
};

export function uploadFile({ publicId, file }: UploadFileParams): FileUpload {
	let progress = $state(0);
	let uploadId: string | null = null;

	async function start() {
		try {
			const { key, uploadId } = await createUpload(publicId);

			const chunkSize = 1024 * 1024 * 10;
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
				const uploadedPart = await uploadPart({
					key,
					uploadId,
					partNumber,
					part: chunk,
					callback: (chunkProgress) => {
						progress = (uploadedBytes + chunk.size * chunkProgress) / file.size;
					},
				});
				uploadedParts.push(uploadedPart);

				// progress = uploadedParts.length / chunks.length;

				uploadedBytes += chunk.size;
				partNumber++;
			}

			await completeUpload({ key, uploadId, uploadedParts });

			return key;
		} catch (err) {
			console.error(err);
		}
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

async function createUpload(publicId: string): Promise<{ key: string; uploadId: string }> {
	const result = await _fetch<{ key: string; uploadId: string }>(`/api/upload/${publicId}`, {
		method: 'POST',
	});

	return result;
}

type UploadPartParams = {
	key: string;
	uploadId: string;
	partNumber: number;
	part: Blob;
	callback: (progress: number) => void;
};

async function uploadPart({
	key,
	uploadId,
	partNumber,
	part,
	callback,
}: UploadPartParams): Promise<R2UploadedPart> {
	const xhr = new XMLHttpRequest();
	xhr.upload.onprogress = ({ loaded, total }) => {
		const progress = loaded / total;
		callback(progress);
	};

	xhr.open('PUT', `/api/upload/${key}/${uploadId}/${partNumber}`);
	xhr.setRequestHeader('Content-Type', 'application/octet-stream');
	xhr.send(part);

	await new Promise((resolve) => (xhr.onload = resolve));
	const uploadedPart = JSON.parse(xhr.responseText);

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
