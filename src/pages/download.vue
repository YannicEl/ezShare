<template>
	<div>Download</div>

	<RouterLink route="/">To Home</RouterLink>

	<div>
		<div v-for="file in files" class="flex gap-8">
			<div>{{ file.name }}</div>
			<button @click="download(file)">download</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { DownloadTask } from '../types';

const { downloadFiles } = useStorage();
const { curretRoute } = useRouter();

let files = $ref<DownloadTask[]>([]);

onMounted(async () => {
	const { downloadId } = curretRoute.value.param || {};

	console.log(curretRoute.value);

	if (!downloadId) {
		console.log('No Download Id');
		return;
	}

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
