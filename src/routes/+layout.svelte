<script lang="ts">
	import '@unocss/reset/tailwind.css';
	import 'virtual:uno.css';
	import '../main.css';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
	import Portal from '$lib/components/Portal.svelte';
</script>

<div class="flex h-screen w-screen flex-col items-center justify-between px-4">
	<Header />

	<main class="flex h-full w-full max-w-md flex-col justify-center">
		<div class="flex-1"></div>

		<div class="max-h-lg flex h-full flex-col">
			<slot />
		</div>

		<Portal class="mt-4 flex-1" />
	</main>

	<Footer />
</div>
