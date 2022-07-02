<template>
	<li class="flex items-center">
		<div>{{ task.name }}</div>
		<ProgressBar :progress="task.progress" />
		<div>.{{ task.type }}</div>
		<button @click="remove(task)">x</button>
	</li>
</template>

<script setup lang="ts">
import { UploadTask } from '../types';

const { task } = defineProps<{ task: UploadTask }>();

const remove = (task: UploadTask) => {

}
</script>
