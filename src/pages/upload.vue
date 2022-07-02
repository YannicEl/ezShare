<template>
	<div class="flex flex-col bg-white shadow-md shadow-black rounded-md w-full max-w-sm">
		<div class="grid place-items-center font-bold px-2 py-4">
			<button @click="addFiles">Add Files</button>
		</div>

		<ul
			v-if="uploads.length"
			class="flex flex-col max-h-xl overflow-y-auto scrollbar scrollbar-rounded scrollbar-thumb-color-gray-400 scrollbar-track-white scrollbar-w-1 border-y border-gray-300"
		>
			<FilePreview
				v-for="upload in uploads"
				:key="upload.value.id"
				:task="upload.value"
				@remove="removeFile"
				class="border-gray-300 not-last-of-type:border-b px-3 py-2 flex-1"
			></FilePreview>
		</ul>

		<div v-if="uploads.length" class="px-3 py-4 flex gap-3">
			<input
				type="text"
				:value="shareUrl"
				disabled
				class="border rounded-md px-2 flex-1"
			/>
			<button
				class="bg-cool-gray-900 text-white font-bold rounded-md px-4 py-2"
				@click="copy()"
			>
				Copy
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid';
import { Ref } from 'vue';
import { UploadTask } from '../types';

const { uploadFiles, deleteFile } = useStorage();

const uploads = ref<Ref<UploadTask>[]>([]);

const key = nanoid();
const shareUrl = `${import.meta.env.VITE_BASE_URL}download/${key}`;
const { copy } = useClipboard({ source: shareUrl });

const addFiles = async () => {
	const handles = await window.showOpenFilePicker({ multiple: true });
	const files = await Promise.all(handles.map((handle) => handle.getFile()));
	uploads.value.push(...uploadFiles(key, files));
};

const removeFile = async (task: UploadTask) => {
	await deleteFile(key, task.ref);

	const index = uploads.value.findIndex((e) => e.value.id === task.id);
	console.log(index);
	uploads.value.splice(index, 1);
};
</script>

<style></style>
