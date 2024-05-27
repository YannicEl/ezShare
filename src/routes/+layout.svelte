<script lang="ts">
	import '@unocss/reset/tailwind.css';
	import 'virtual:uno.css';
	import '../main.css';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
</script>

<div class="flex h-screen w-screen flex-col items-center justify-between px-4">
	<Header />

	<main class="max-h-lg flex h-full w-full max-w-md flex-col justify-between">
		<slot />
	</main>

	<Footer />
</div>
