<script lang="ts">
	import Navigation from '$svelted/ui/navigation/Navigation.svelte';
    import FileSelection from '$svelted/overlays/FileSelection.svelte'

    type CurrentFile = string | undefined

    let show = false;
    let currentFile: CurrentFile = undefined;
</script>

<Navigation overflow="hidden" activepage={'overlays tests'} site={['test', 'overlays']}>
	<div class="bg-svelted-gray-700 p-2 text-white">
		<input type="file" name="file-input" id="" />
        <FileSelection bind:display={show} bind:currentFile={currentFile} title="Select File" action={() => console.log("test")}/>
		<button
            on:click={() => show = !show}
			class="flex h-10 w-fit items-center gap-2 rounded-sm border border-svelted-primary-500 bg-gradient-to-t from-svelted-primary-700 to-svelted-primary-500 px-4 shadow-lg hover:bg-svelted-primary-500"
			>Select file</button
		>
        {show}
		{currentFile}
	</div>
</Navigation>
