<template>
	<li class="flex items-center gap-4 w-full">
		<div class="grid flex-1">
			<div class="font-bold whitespace-nowrap truncate overflow-hidden">
				{{ task.name }}
			</div>

			<div class="flex items-center h-6">
				<ProgressBar v-if="task.status !== 'success'" :progress="task.progress" />
				<div v-if="task.status === 'success'" class="font-semibold opacity-80 text-sm">
					{{ size }} <span v-if="task.type">● {{ task.type.toUpperCase() }}</span>
				</div>
			</div>
		</div>

		<button
			class="flex items-center justify-end w-8 h-full"
			@click="emit('remove', task)"
		>
			<div
				class="i-material-symbols-cancel-outline-rounded text-xl hover:text-red-500 transition-all"
			></div>
		</button>
	</li>
</template>

<script setup lang="ts">
import { formatBytes } from '../helpers/helpers';
import { UploadTask } from '../types';

const { task } = defineProps<{ task: UploadTask }>();

const emit = defineEmits<{
	(event: 'remove', value: UploadTask): void;
}>();

const size = computed(() => formatBytes(task.size));
</script>
