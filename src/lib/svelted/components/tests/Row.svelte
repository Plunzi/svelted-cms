<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import BLOCK_Paragraph from '$lib/svelted/components/core/Paragraph.svelte';

	interface ComponentData {
		class: string | undefined;
		content: {
			component: SvelteComponent;
			data: any;
		}[];
	}

	export let data: ComponentData;

    console.log(JSON.stringify(data));

	// const testData = {
	// 	class: '',
	// 	content: [
	// 		{
	// 			name: 'Paraghaph',
	// 			component: BLOCK_Paragraph,
	// 			data: { content: 'test', class: undefined }
	// 		},
	// 		{
	// 			name: 'Paraghaph',
	// 			component: BLOCK_Paragraph,
	// 			data: { content: 'other test', class: undefined }
	// 		}
	// 	]
	// };
</script>

<section class={`${data.class} mx-auto flex w-full max-w-[80%] gap-2 rounded-md bg-gray-200 p-2`}>
	<!-- {#each data.content.component as block, index} -->
	{#each data.content as block, index}
		<div class="w-full rounded-sm bg-white">
			<!-- <svelte:component this={block.component} bind:data={block.data} /> -->
			<svelte:component this={BLOCK_Paragraph} bind:data={block.data} />
		</div>
	{/each}
</section>
