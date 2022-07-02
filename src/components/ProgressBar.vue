<template>
	<div class="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
		<div
			class="bg-blue-500 h-full transition-all"
			:style="{ width: progress + '%' }"
		></div>
	</div>
</template>

<script setup lang="ts">
const { progress } = defineProps<{ progress: number }>();
</script>
