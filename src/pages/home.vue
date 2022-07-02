<template>
	<div class="flex flex-col">
		<button @click.prevent="upload">Select Files</button>
	</div>

	<div class="flex flex-col gap-2">
		<div v-for="upload in uploads">
			<div>{{ upload.value.status }}</div>
			<div>{{ upload.value.progress }} %</div>
		</div>
	</div>

	<div v-if="shareUrl">{{ shareUrl }}</div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid';
import { Ref } from 'vue';
import { UploadTask, useStorage } from '../composables/useStorage';

const { uploadFiles } = useStorage();

const uploads = ref<Ref<UploadTask>[]>([]);

let shareUrl = $ref<null | string>(null);

const upload = async () => {
	const handles = await window.showOpenFilePicker({ multiple: true });

	const files = await Promise.all(handles.map((handle) => handle.getFile()));

	const key = nanoid();
	uploads.value = uploadFiles(key, files);
	shareUrl = `${import.meta.env.VITE_BASE_URL}/download/${key}`;
};
</script>

<style></style>
