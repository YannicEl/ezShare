<template>
	<div
		v-if="files.length"
		class="flex flex-col bg-white shadow-md shadow-black rounded-md w-full max-w-sm max-h-full overflow-y-auto"
	>
		<div class="flex place-items-center justify-between w-full font-bold px-3 py-4">
			<div>{{ files.length }} Files</div>
			<div
				class="flex items-center gap-2 hover:bg-cool-gray-200 rounded-md p-2 transition-colors cursor-pointer"
				@click="downloadAll"
			>
				Download all
				<button class="">
					<div
						class="i-material-symbols-download-rounded text-cool-gray-900 text-2xl"
					></div>
				</button>
			</div>
		</div>

		<ul
			class="flex flex-col max-h-xl overflow-y-auto scrollbar scrollbar-rounded scrollbar-thumb-color-gray-400 scrollbar-track-white scrollbar-w-1 border-y border-gray-300"
		>
			<DownloadFilePreview
				v-for="file in files"
				:key="file.id"
				:task="file"
				class="border-gray-300 not-last-of-type:border-b p-3 flex-1 hover:bg-cool-gray-200 transition-all cursor-pointer"
				@click="download(file)"
			></DownloadFilePreview>
		</ul>
	</div>
</template>

<script setup lang="ts">
import splitbee from '@splitbee/web';
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

	splitbee.track('download', { key: downloadId });

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

const downloadAll = () => {
	files.forEach((file) => {
		download(file);
	});
};
</script>

<style></style>
