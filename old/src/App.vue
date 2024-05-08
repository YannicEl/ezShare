<template>
	<div class="h-screen w-screen flex items-center justify-center p-4 bg-cool-gray-900">
		<Download v-if="curretRoute.route === '/download'" />
		<Upload v-else />
	</div>
</template>

<script setup lang="ts">
import splitbee from '@splitbee/web';

const { curretRoute } = useRouter();

splitbee.init({
	disableCookie: true,
});
</script>

<style>
html {
	color: #111827;
	font-family: Montserrat, sans-serif;
}
</style>
