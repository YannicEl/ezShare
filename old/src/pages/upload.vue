<template>
	<div
		class="w-full h-full grid place-items-center flex-1"
		@drop.prevent="onDrop"
		@dragover.prevent=""
	>
		<div
			v-if="!uploads.length"
			class="flex items-center gap-3 cursor-pointer"
			@click="addFiles"
		>
			<div class="text-white font-extrabold text-center text-xl">
				<div>Drag and Drop</div>

				<div class="flex items-center justify-center gap-1 mt-1">
					or add
					<span class="i-material-symbols-add-circle-rounded inline-block"></span> files
				</div>
			</div>
		</div>

		<div
			v-else
			class="flex flex-col bg-white shadow-md shadow-black rounded-md w-full max-w-sm max-h-full overflow-y-auto"
		>
			<div class="flex place-items-center justify-between w-full font-bold px-3 py-4">
				<div class="font-semibold">{{ uploads.length }} Files ● {{ totalSize }}</div>
				<div
					class="flex items-center gap-2 hover:bg-cool-gray-200 rounded-md p-2 transition-colors cursor-pointer"
					@click="addFiles"
				>
					Add files
					<button
						class="i-material-symbols-add-circle-rounded text-cool-gray-900 text-2xl"
					></button>
				</div>
			</div>

			<ul
				class="flex flex-col max-h-xl overflow-y-auto scrollbar scrollbar-rounded scrollbar-thumb-color-gray-400 scrollbar-track-white scrollbar-w-1 border-y border-gray-300"
			>
				<UploadFilePreview
					v-for="upload in uploads"
					:key="upload.value.id"
					:task="upload.value"
					@remove="removeFile"
					class="border-gray-300 not-last-of-type:border-b px-3 py-2 flex-1"
				></UploadFilePreview>
			</ul>

			<div v-if="uploads.length" class="px-3 py-4 flex gap-3">
				<input
					type="text"
					:value="shareUrl"
					disabled
					class="border rounded-md px-2 flex-1"
				/>
				<button
					class="bg-cool-gray-800 hover:bg-cool-gray-900 text-white font-bold rounded-md px-4 py-2"
					@click="copy()"
				>
					Copy
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import splitbee from '@splitbee/web';
import { nanoid } from 'nanoid';
import { Ref } from 'vue';
import { formatBytes } from '../helpers/helpers';
import { UploadTask } from '../types';

const { uploadFiles, deleteFile } = useStorage();

const uploads = ref<Ref<UploadTask>[]>([]);

const totalSize = computed(() => {
	let size = 0;

	uploads.value.forEach((e) => {
		size += e.value.size;
	});

	return formatBytes(size);
});

const key = nanoid();
const shareUrl = `${import.meta.env.VITE_BASE_URL}download/${key}`;
const { copy } = useClipboard({ source: shareUrl });

const addFiles = async () => {
	const handles = await window.showOpenFilePicker({ multiple: true });
	let files = await Promise.all(handles.map((handle) => handle.getFile()));
	uploads.value.push(...uploadFiles(key, files));

	splitbee.track('add files', { key, count: files.length });
};

const removeFile = async (task: UploadTask) => {
	await deleteFile(key, task.ref);

	const index = uploads.value.findIndex((e) => e.value.id === task.id);
	console.log(index);
	uploads.value.splice(index, 1);

	splitbee.track('remove file', { key });
};

const onDrop = (e: DragEvent) => {
	const filelist = e.dataTransfer?.files;
	if (!filelist) return;

	const files: File[] = [];
	for (let i = 0; i < filelist.length; i++) {
		const file = filelist.item(i);
		if (file) files.push(file);
	}

	uploads.value.push(...uploadFiles(key, files));
};
</script>

<style></style>
