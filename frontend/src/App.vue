<template>
	<Download v-if="route === '/download'" :downloadId="downloadId"></Download>
	<Home v-else></Home>
</template>

<script setup lang="ts">
const { pathname } = window.location;

let route = '/';
let downloadId = $ref('');

if (pathname.startsWith('/download')) {
	route = '/download';

	const parts = pathname.split('/');

	if (parts.length !== 3) {
		console.log('Download link malformed');
	}

	downloadId = parts[2];
}
</script>

<style></style>
