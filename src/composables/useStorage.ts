import { FirebaseApp, getApp, initializeApp } from 'firebase/app';
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref as storageRef,
  uploadBytesResumable
} from 'firebase/storage';
import { Ref } from 'vue';
import { round } from '../helpers/helpers';
import { UploadTask } from '../types';

export const useStorage = () => {
	const app = getFirebase();
	const storage = getStorage(app);

	const uploadFile = (key: string, file: File): Ref<UploadTask> => {
		const fileRef = storageRef(storage, `${key}/${file.name}`);

		let ret = ref<UploadTask>({
			ref: fileRef,
			status: 'running',
			progress: 0,
			type: file.name.split('.').at(-1) || '',
			name: file.name,
		});

		console.log(file);

		const uploadTask = uploadBytesResumable(fileRef, file);

		uploadTask.on(
			'state_changed',
			({ bytesTransferred, totalBytes, state }) => {
				ret.value.status = 'running';

				ret.value.progress = round((bytesTransferred / totalBytes) * 100);
			},
			(error) => {
				ret.value.status = 'error';

				switch (error.code) {
					case 'storage/object-not-found':
						// File doesn't exist
						break;
					case 'storage/unauthorized':
						// User doesn't have permission to access the object
						break;
					case 'storage/canceled':
						// User canceled the upload
						break;

					// ...

					case 'storage/unknown':
						// Unknown error occurred, inspect the server response
						break;
				}
			},
			() => {
				ret.value.status = 'success';
			}
		);

		return ret;
	};

	const uploadFiles = (key: string, files: File[]): Ref<UploadTask>[] => {
		return Array.from(files).map((file) => uploadFile(key, file));
	};

	const downloadFiles = async (key: string): Promise<DownloadTask[]> => {
		const directoryRef = storageRef(storage, `${key}`);
		const direcotry = await listAll(directoryRef);

		return direcotry.items.map((file) => ({
			name: file.name,
			getUrl: () => getDownloadURL(file),
		}));
	};

	return {
		uploadFile,
		uploadFiles,
		downloadFiles,
	};
};

const getFirebase = (): FirebaseApp => {
	try {
		return getApp();
	} catch (err) {
		return initializeApp({
			apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
			projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
			storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
		});
	}
};
