import type { FileUpload } from './upload.svelte';

export type UploadedFile = {
	uploaded: true;
	id: string;
	uploadId: string;
	name: string;
	size: number;
};

export type FileToUpload = {
	uploaded: false;
	name: string;
	size: number;
	upload: FileUpload;
};
