import type { Snippet } from 'svelte';

export let children = $state<Map<number | string, Snippet>>(new Map());
let runningId = 0;

export function addChildren(snippet: Snippet): number;
export function addChildren(snippet: Snippet, key?: string): string;
export function addChildren(snippet: Snippet, key?: string): number | string {
	if (key) {
		children.set(key, snippet);
		return key;
	} else {
		const id = runningId;
		children.set(id, snippet);
		runningId++;
		return id;
	}
}

export function removeChildren(id: number | string): void {
	children.delete(id);
}
