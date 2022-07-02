import { StorageReference } from 'firebase/storage';

export interface Route {
	route: string;
	param?: { [k: string]: string };
}

export interface UploadTask {
	ref: StorageReference;
	status: 'running' | 'error' | 'success';
	progress: number;
	type: string;
	name: string;
}

export interface DownloadTask {
	name: string;
	getUrl: () => Promise<string>;
}
