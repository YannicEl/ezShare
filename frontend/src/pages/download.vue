<template>
	<div>Download</div>
	{{ downloadId }}
</template>

<script setup lang="ts">
const { downloadId } = defineProps<{ downloadId: string }>();
</script>

<style></style>
