import type { Snippet } from 'svelte';

export let children = $state<Map<number, Snippet>>(new Map());
let runningId = 0;

export function addChildren(snippet: Snippet): number {
	const id = runningId;
	children.set(id, snippet);
	runningId++;
	return id;
}

export function removeChildren(id: number): void {
	children.delete(id);
}
