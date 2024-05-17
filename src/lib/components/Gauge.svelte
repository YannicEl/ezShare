<script lang="ts">
	type Props = {
		value: number;
		strokeWidth?: number;
		className?: string;
	};

	let { value, strokeWidth = 6, className }: Props = $props();

	const radius = 24;
	const center = $derived(radius + strokeWidth / 2);
	const circumference = $derived(radius * 2 * Math.PI + strokeWidth);
	const dashArray = $derived(`${circumference} ${circumference}`);
	const transform = $derived(`rotate(-90, ${center}, ${center})`);
	const offset = $derived(circumference - Math.max(value, 0.0001) * circumference);
	const viewBoxWidth = $derived(radius * 2 + strokeWidth);
	const viewBox = $derived(`0 0 ${viewBoxWidth} ${viewBoxWidth}`);
</script>

<svg {viewBox} xmlns="http://www.w3.org/2000/svg" class={className}>
	<circle
		cx={center}
		cy={center}
		r={radius}
		stroke="currentColor"
		fill="transparent"
		shape-rendering="geometricPrecision"
		stroke-linecap="round"
		stroke-dasharray={dashArray}
		stroke-dashoffset={offset}
		stroke-width={strokeWidth}
		{transform}
	/>
	<text
		x="50%"
		y="50%"
		text-anchor="middle"
		dominant-baseline="middle"
		dy="0.073em"
		font-size="1rem"
		class="font-sans font-medium"
	>
		{(value * 100).toFixed(0)}
	</text>
</svg>

<style>
	circle {
		transition: stroke-dashoffset 0.5s ease;
	}
</style>
