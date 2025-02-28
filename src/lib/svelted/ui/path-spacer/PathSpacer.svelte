<script lang="ts">
	import PathSpacer from './PathSpacer.svelte';
	interface Props {
		path: string;
		accumulatedPath?: string;
	}

	let { path, accumulatedPath = '' }: Props = $props();

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
		<PathSpacer path={remainingPath} accumulatedPath={newAccumulatedPath} />
	{/if}
{/if}