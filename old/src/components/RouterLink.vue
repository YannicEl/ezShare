<template>
	<a :href="route" @click.prevent="navTo">
		<slot></slot>
	</a>
</template>

<script setup lang="ts">
const router = useRouter();

const { route } = defineProps<{ route: string }>();

const navTo = () => {
	router.navTo(route);
};
</script>
