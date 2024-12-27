<script lang="ts">
	import Navigation from '$svelted/ui/navigation/Navigation.svelte';
	import FileSelection from '$svelted/overlays/FileSelection.svelte';
	import json from 'svelte-highlight/languages/json';
	import ashes from "svelte-highlight/styles/ashes";

	import { Highlight } from 'svelte-highlight';

	type CurrentFile = File | undefined;

	interface File {
		path: string;
		name: string;
		author: string;
		extension: string;
		size: number;
		description: string | undefined;
		modified: number;
		created: number;
	}

	let show = $state(false);
	let currentFile: CurrentFile = $state(undefined);
</script>

<svelte:head>
  {@html ashes}
</svelte:head>

<Navigation overflow="hidden" activepage={'overlays tests'} site={['test', 'overlays']}>
	<div class="bg-svelted-gray-700 p-2 text-white">
		<input type="file" name="file-input" id="" />
		<FileSelection bind:display={show} bind:currentFile />
		<button
			onclick={() => (show = !show)}
			class="flex h-10 w-fit items-center gap-2 rounded-sm border border-svelted-primary-500 bg-gradient-to-t from-svelted-primary-700 to-svelted-primary-500 px-4 shadow-lg hover:bg-svelted-primary-500"
			>Select file</button
		>
		{show}

		<Highlight class="rounded-lg" code={String(JSON.stringify(currentFile))} language={json} />

		<!-- <p>{JSON.stringify(currentFile)}</p> -->
	</div>
</Navigation>
