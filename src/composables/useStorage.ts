import { FirebaseApp, getApp, initializeApp } from 'firebase/app';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref as storageRef,
  StorageReference,
  uploadBytesResumable
} from 'firebase/storage';
import { nanoid } from 'nanoid';
import { Ref } from 'vue';
import { round } from '../helpers/helpers';
import { DownloadTask, UploadTask } from '../types';

export const useStorage = () => {
	const app = getFirebase();
	const storage = getStorage(app);

	const uploadFile = (key: string, file: File): Ref<UploadTask> => {
		const fileRef = storageRef(storage, `${key}/${file.name}`);

		const uploadTask = uploadBytesResumable(fileRef, file);

		let ret = ref<UploadTask>({
			id: nanoid(),
			ref: fileRef,
			status: 'running',
			progress: 0,
			type: file.name.split('.').at(-1),
			name: file.name,
			size: file.size,
			canceleUpload: uploadTask.cancel,
		});

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
			id: nanoid(),
			name: file.name,
			type: file.name.split('.').at(-1),
			getUrl: () => getDownloadURL(file),
		}));
	};

	const deleteFile = async (key: string, ref: StorageReference): Promise<void> => {
		return deleteObject(ref);
	};

	return {
		uploadFile,
		uploadFiles,
		downloadFiles,
		deleteFile,
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
