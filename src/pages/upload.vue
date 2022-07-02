<template>
	<div
		class="flex flex-col bg-white shadow-md shadow-black rounded-md w-full max-w-sm p-2"
	>
		<div class="grid place-items-center font-bold">
			<button @click="addFiles">Add Files</button>
		</div>

		<div>
			<ul v-for="upload in uploads">
				<FilePreview :task="upload.value"></FilePreview>
			</ul>
		</div>

		<!-- <div v-if="uploads.length">
			<button class="">upload</button>
		</div> -->
	</div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid';
import { Ref } from 'vue';
import { UploadTask } from '../types';

const { uploadFiles } = useStorage();

const uploads = ref<Ref<UploadTask>[]>([]);

const key = nanoid();
let shareUrl = $ref<null | string>(null);

const addFiles = async () => {
	const handles = await window.showOpenFilePicker({ multiple: true });
	const files = await Promise.all(handles.map((handle) => handle.getFile()));
	uploads.value.push(...uploadFiles(key, files));
};

const uploadAllFiles = async () => {
	shareUrl = `${import.meta.env.VITE_BASE_URL}/download/${key}`;
};
</script>

<style></style>
