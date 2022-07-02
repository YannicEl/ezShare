<template>
	<div class="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
		<div
			class="bg-cool-gray-900 h-full transition-all"
			:style="{ width: progress + '%' }"
		></div>
	</div>
</template>

<script setup lang="ts">
const { progress } = defineProps<{ progress: number }>();
</script>
