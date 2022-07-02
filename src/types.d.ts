import { StorageReference } from 'firebase/storage';

export interface Route {
	route: string;
	param?: { [k: string]: string };
}

export interface UploadTask {
	id: string;
	ref: StorageReference;
	status: 'running' | 'error' | 'success';
	progress: number;
	type: string | undefined;
	name: string;
	size: number;
	canceleUpload: () => boolean;
}

export interface DownloadTask {
	name: string;
	getUrl: () => Promise<string>;
}
