<template>
	<div class="h-screen w-screen grid place-items-center p-4 bg-cool-gray-900	">
		<Download v-if="curretRoute.route === '/download'" />
		<Upload v-else />
	</div>
</template>

<script setup lang="ts">
const { curretRoute } = useRouter();
</script>

<style>
html {
	color: #101010;
}
</style>
