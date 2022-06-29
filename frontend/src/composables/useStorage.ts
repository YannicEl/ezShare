import { FirebaseApp, getApp, initializeApp } from 'firebase/app';
import {
  getStorage,
  ref as storageRef,
  TaskState,
  uploadBytesResumable
} from 'firebase/storage';
import { Ref } from 'vue';
import { round } from '../helpers/helpers';

export interface UploadTask {
	status: TaskState;
	progress: number;
}

export const useStorage = () => {
	const app = getFirebase();
	const storage = getStorage(app);

	const uploadFile = (file: File): Ref<UploadTask> => {
		let ret = ref<UploadTask>({
			status: 'running',
			progress: 0,
		});

		const fileRef = storageRef(storage, file.name);

		const uploadTask = uploadBytesResumable(fileRef, file);

		uploadTask.on(
			'state_changed',
			({ bytesTransferred, totalBytes, state }) => {
				ret.value.status = state;

				ret.value.progress = round((bytesTransferred / totalBytes) * 100);
			},
			(error) => {
				ret.value.status = 'error';
			},
			() => {
				ret.value.status = 'success';
			}
		);

		return ret;
	};

	const uploadFiles = (files: FileList): Ref<UploadTask>[] => {
		return Array.from(files).map((file) => uploadFile(file));
	};

	return {
		uploadFile,
		uploadFiles,
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
