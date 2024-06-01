<script lang="ts">
	import type { FormEventHandler, HTMLInputAttributes } from 'svelte/elements';

	type Props = {
		value?: FileList;
		oninput: (value: File[]) => void;
	} & Omit<HTMLInputAttributes, 'type' | 'value' | 'oninput'>;
	let { value = $bindable(), oninput: emitInput, ...props }: Props = $props();

	function onDrop(event: DragEvent): void {
		event.preventDefault();
		if (event.dataTransfer) {
			value = event.dataTransfer.files;
			emitInput([...value]);
		}
	}

	const onInput: FormEventHandler<HTMLInputElement> = ({ currentTarget }) => {
		const { files: fileList } = currentTarget;

		if (fileList) {
			value = fileList;
			emitInput([...value]);
		}
	};

	function onDragover(event: DragEvent) {
		event.preventDefault();
	}
</script>

<label
	ondrop={onDrop}
	ondragover={onDragover}
	class="border-gray-3 hover:border-gray-4 flex h-full cursor-pointer items-center justify-center rounded-md border border-2 border-dashed p-4"
>
	<div class="text-gray-4 flex flex-col items-center gap-2 font-medium">
		<div class="i-mdi-tray-arrow-up text-3xl"></div>

		<div>Drag and drop or click to add files</div>

		<input type="file" {...props} oninput={onInput} class=" w-full text-center" />
	</div>
</label>

<style>
	input[type='file']::file-selector-button {
		display: none;
	}
</style>
