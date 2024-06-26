import { _fetch } from './fetch';
import { concurrencPromises } from './promises';

export type UploadFileParams = {
	file: File;
};

export type UploadStatus = 'not_started' | 'uploading' | 'done';

export type FileUpload = {
	status: UploadStatus;
	progress: number;
	file: File;
	start: (publicId: string) => Promise<string>;
};

export function uploadFile({ file }: UploadFileParams): FileUpload {
	let progress = $state(0);
	let status = $state<UploadStatus>('not_started');

	async function start(publicId: string) {
		try {
			status = 'uploading';

			const { fileId, key, uploadId } = await createUpload({ filename: file.name, publicId });

			const chunkSize = 1024 * 1024 * 10;
			const chunks: Blob[] = [];

			let currentChunkStart = 0;
			while (currentChunkStart < file.size) {
				const chunk = file.slice(currentChunkStart, currentChunkStart + chunkSize);
				chunks.push(chunk);
				currentChunkStart += chunkSize;
			}

			let uploadedBytes = 0;
			const uploadedParts = await concurrencPromises(
				chunks.map((chunk, index) => {
					return async () => {
						const uploadedPart = await uploadPart({
							key,
							uploadId,
							partNumber: index + 1,
							part: chunk,
							callback: (chunkProgress) => {
								progress = (uploadedBytes + chunk.size * chunkProgress) / file.size;
							},
						});

						uploadedBytes += chunk.size;
						return uploadedPart;
					};
				}),
				2
			);

			await completeUpload({ key, uploadId, uploadedParts });

			status = 'done';

			return fileId;
		} catch (err) {
			console.error(err);
			throw new Error('Failed to upload file');
		}
	}

	return {
		get status() {
			return status;
		},
		get progress() {
			return progress;
		},
		file,
		start,
	};
}

type CreateUploadParams = {
	filename: string;
	publicId: string;
};

async function createUpload({
	filename,
	publicId,
}: CreateUploadParams): Promise<{ fileId: string; key: string; uploadId: string }> {
	const result = await _fetch<{ fileId: string; key: string; uploadId: string }>(
		`/api/upload/${publicId}`,
		{
			method: 'POST',
			body: JSON.stringify({ filename }),
		}
	);

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
