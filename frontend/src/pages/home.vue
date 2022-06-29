<template>
	<label for="file">
		<input type="file" name="file" id="file" @change="upload" multiple />
	</label>

	<div class="flex flex-col gap-2">
		<div v-for="file in files">
			<div>{{ file.value.status }}</div>
			<div>{{ file.value.progress }} %</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Ref } from 'vue';
import { UploadTask, useStorage } from '../composables/useStorage';

const { uploadFiles } = useStorage();

const files = ref<Ref<UploadTask>[]>([]);

const upload = (e: Event) => {
	const elm = e.target as HTMLInputElement;

	if (!elm.files?.length) {
		console.log('Please select files');
		return;
	}

	files.value = uploadFiles(elm.files);
};
</script>

<style></style>
