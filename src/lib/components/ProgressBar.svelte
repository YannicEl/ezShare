<script lang="ts">
	type Props = {
		value: number;
	};
	let { value }: Props = $props();

	let progress = $derived((value * 100).toFixed(2));
</script>

<div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
	<div class="bg-cool-gray-900 h-full transition-all" style="width: {progress}%"></div>
</div>
