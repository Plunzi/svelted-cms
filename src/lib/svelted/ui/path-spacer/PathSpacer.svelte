<script lang="ts">
	export let path: string;
	export let accumulatedPath: string = '';

	let parts = path.split('/');
	let currentSegment = parts[0];
	let remainingPath = parts.slice(1).join('/');

	let newAccumulatedPath = accumulatedPath ? `${accumulatedPath}/${currentSegment}` : currentSegment;
</script>

<span class="text-neutral-700">/</span>
{#if currentSegment !== ''}
	<a href={`/svelted/media/${newAccumulatedPath}`} data-sveltekit-reload class="text-neutral-500 hover:text-svelted-primary-500 hover:bg-svelted-gray-700 px-2 rounded-sm py-0.5">
		<span>{currentSegment}</span>
	</a>
	{#if remainingPath !== ''}
		<svelte:self path={remainingPath} accumulatedPath={newAccumulatedPath} />
	{/if}
{/if}