<script lang="ts">
	type Props = {
		progress: number;
	};

	let { progress }: Props = $props();
</script>

<div class="h-3 w-full overflow-hidden rounded-full bg-gray-200">
	<div class="bg-cool-gray-900 h-full transition-all" style="width: {progress}%"></div>
</div>
