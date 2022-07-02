<template>
	<div>Download {{ downloadId }}</div>

	<div>
		<div v-for="file in files" class="flex gap-8">
			<div>{{ file.name }}</div>
			<button @click="download(file)">download</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { DownloadTask } from '../composables/useStorage';

const { downloadFiles } = useStorage();
const { downloadId } = defineProps<{ downloadId: string }>();

let files = $ref<DownloadTask[]>([]);

onMounted(async () => {
	files = await downloadFiles(downloadId);
});

const download = async (task: DownloadTask) => {
	const a = document.createElement('a');
	a.href = await task.getUrl();
	a.download = task.name;
	a.target = '_blank';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
};
</script>

<style></style>
