<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import BLOCK_Paragraph from '$lib/svelted/components/core/Paragraph.svelte';

		// layout component imports
		import components from '$lib/svelted/components'

	interface ComponentData {
		class: string | undefined;
		content: {
			component: string;
			data: any;
		}[];
	}

	interface Client {
		x: number;
		y: number;
		isDragging: boolean;
		isDraggingOver: number | undefined;
		currentComponent: string | undefined;
		shiftKeyHeld: boolean;
		scale: number;
	}

	let client: Client = {
		x: 0,
		y: 0,
		currentComponent: undefined,
		isDragging: false,
		isDraggingOver: undefined,
		shiftKeyHeld: false,
		scale: 1
	};

	const enterPlaceRegion = function (e: DragEvent, id: number) {
		client.isDraggingOver = id;
	};
	const leavePlaceRegion = function (e: DragEvent, id: number) {
		client.isDraggingOver = undefined;
	};
	const dragOver = function (e: DragEvent) {
		e.preventDefault();
	};

	const placeComponent = function (e: DragEvent) {};

	const deleteComponent = function (e: MouseEvent, id: number) {};

	export let data: ComponentData;

	console.log(JSON.stringify(data));

</script>

<section class={`${data.class} mx-auto flex w-full max-w-[80%] gap-2 rounded-2xl bg-gray-200 p-2`}>
	<!-- {#each data.content.component as block, index} -->
	{#each data.content as block, index}
		<div class="aspect-square w-full rounded-xl bg-gray-100 shadow-lg">
			<!-- <svelte:component this={block.component} bind:data={block.data} /> -->
			<svelte:component this={components[block.component]} bind:data={block.data} />
		</div>
	{/each}
	<div
		class="add-content my-0 flex w-full items-center"
		on:drop={placeComponent}
		on:dragenter={(e) => enterPlaceRegion(e, 0)}
		on:dragleave={(e) => leavePlaceRegion(e, 0)}
		on:dragover={dragOver}
		role="listitem"
	>
		<button
			class="left-0 right-0 z-10 flex h-full w-full items-center justify-center rounded-xl bg-gray-100 shadow-lg border-transparent transition-all border-2 hover:border-brand-500"
			class:py-2={client.isDragging}
			class:bg-brand-500={client.isDraggingOver == 0}
		>
			<span class="absolute z-10" class:pointer-events-none={client.isDragging}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="32"
					height="32"
					fill="#000000"
					class="rounded-full bg-brand-500 fill-slate-100"
					viewBox="0 0 256 256"
				>
					<path
						d="M128,24A104,104,0,1,0,232,128,104.13,104.13,0,0,0,128,24Zm40,112H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32a8,8,0,0,1,0,16Z"
					>
					</path>
				</svg>
			</span>
		</button>
	</div>
</section>
