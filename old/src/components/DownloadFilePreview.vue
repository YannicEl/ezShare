<template>
	<li class="flex items-center gap-4 w-full">
		<div class="grid flex-1">
			<div class="font-bold whitespace-nowrap truncate overflow-hidden">
				{{ task.name }}
			</div>
		</div>

		<button class="flex items-center justify-center">
			<div class="i-material-symbols-download-rounded text-xl"></div>
		</button>
	</li>
</template>

<script setup lang="ts">
import { DownloadTask } from '../types';

const { task } = defineProps<{ task: DownloadTask }>();
</script>
