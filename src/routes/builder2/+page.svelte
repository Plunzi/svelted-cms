<script lang="ts">
	import { flip } from 'svelte/animate';
	import { onMount } from 'svelte';

	import Paragraph from '$lib/components/svelted-core/ui/Paragraph.svelte';
	import Heading1 from '$lib/components/svelted-core/ui/Heading1.svelte';
	import Navigation from '$lib/components/custom/Navigation.svelte';
	import { makeResizableDiv } from '$lib/components/svelted-core/resizeable/resizeable';

	import type { SvelteComponent } from 'svelte';

	interface Client {
		x: number;
		y: number;
		isDragging: boolean;
		isDraggingOver: number | undefined;
		currentComponent: string | undefined;
	}

	interface ComponentBlock {
		name: string;
		component: SvelteComponent | any;
		data: any;
	}

	let component_blocks = [
		{ name: 'Paraghaph', component: Paragraph, data: {} },
		{ name: 'Heading', component: Heading1, data: {} },
		{
			name: 'Basic Navigation',
			component: Navigation,
			data: {
				class: 'undefined',
				content: {
					title: 'Hello Svelted User!',
					navigation_links: [
						{
							text: 'Home',
							link: '/'
						},
						{
							text: 'About',
							link: '/about'
						},
						{
							text: 'Blog',
							link: '/blog'
						},
						{
							text: 'Contact',
							link: '/contact'
						}
					],
					primary_buttons: [
						{
							text: 'Get Started',
							link: '/get-startet'
						}
					],
					secondary_buttons: [
						{
							text: 'Log In',
							link: '/login'
						}
					]
				}
			}
		}
	];

	let layout_blocks = [
		{
			name: 'Navigation',
			component: Navigation,
			data: {
				class: 'undefined',
				content: {
					title: 'Hello Svelted User!',
					navigation_links: [
						{
							text: 'Home',
							link: '/'
						},
						{
							text: 'About',
							link: '/about'
						},
						{
							text: 'Blog',
							link: '/blog'
						},
						{
							text: 'Contact',
							link: '/contact'
						}
					],
					primary_buttons: [
						{
							text: 'Get Started',
							link: '/get-startet'
						}
					],
					secondary_buttons: [
						{
							text: 'Log In',
							link: '/login'
						}
					]
				}
			}
		},
		{ name: 'Heading', component: Heading1, data: { class: 'text-2xl', content: 'Hello World!' } },
		{
			name: 'Paragraph',
			component: Paragraph,
			data: { class: 'text-lg', content: 'Message by Lukas :D' }
		}
	];

	let client: Client = {
		x: 0,
		y: 0,
		currentComponent: undefined,
		isDragging: false,
		isDraggingOver: undefined
	};

	function drag(e: DragEvent) {
		(client.x = e.clientX), (client.y = e.clientY);
	}
	function dragEnd(e: DragEvent) {
		const targetElement = e.target as HTMLElement;
		targetElement.classList.remove('dragged');
		client.isDragging = false;
	}
	const dragStart = function (e: DragEvent) {
		const targetComponent = e.target as HTMLElement;
		client.isDragging = true;
		client.currentComponent = targetComponent.id;
		targetComponent.classList.add('dragged');
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

	const placeComponent = function (e: DragEvent) {
		console.log('Dropped: ', e);
		if (client.isDraggingOver == undefined) {
			console.error('Error');
		} else {
			if (client.currentComponent) {
				const newBlock = {
					id: client.isDraggingOver + 1,
					name: component_blocks[Number(client.currentComponent)].name,
					component: component_blocks[Number(client.currentComponent)].component,
					data: component_blocks[Number(client.currentComponent)].data
				};

				addComponentBlock(component_blocks, client.isDraggingOver, newBlock);
			}
		}
	};
	const deleteComponent = function (e: MouseEvent, id: number) {
		layout_blocks.splice(id, 1);
		layout_blocks = layout_blocks;
	};

	const hideOverlay = function (e: MouseEvent, id: number) {

	}

	function addComponentBlock(
		component_blocks: ComponentBlock[],
		index: number,
		newBlock: ComponentBlock
	): void {
		if (index < 0 || index > component_blocks.length) {
			layout_blocks.push(newBlock as ComponentBlock);
			layout_blocks = layout_blocks;
		} else {
			layout_blocks.splice(index, 0, newBlock as ComponentBlock);
			layout_blocks = layout_blocks;
		}
		// console.log(layout_blocks);
	}

	onMount(async () => {
		makeResizableDiv('#editor-preview');
	});
</script>

<main class="h-full max-h-screen min-h-screen w-full bg-neutral-900">
	<nav class="h-16 border-b border-b-neutral-600 bg-[#121212]">hello world</nav>
	<div class="flex">
		<nav
			class="h-full-editor flex min-w-[18rem] flex-col gap-2 border-r border-r-neutral-600 bg-[#121212] p-2"
		>
			<div>
				<input
					type="text"
					name=""
					placeholder="Search .."
					class="h-10 w-full min-w-[271.2px] items-center px-2"
				/>
			</div>
			<li class="block w-full">
				<div
					style="user-select: none;"
					class="relative flex h-10 w-full cursor-grab items-center justify-center text-white !opacity-100 ring-1 ring-neutral-500 hover:bg-brand-800 hover:ring-brand-500 focus:cursor-grabbing"
				>
					Search ...
				</div>
			</li>
			<ul class="relative">
				{#each component_blocks as component, index (component)}
					<li
						class="block w-full"
						animate:flip={{ duration: 300 }}
						id={`${index}`}
						draggable="true"
						on:dragstart={dragStart}
						on:drag={drag}
						on:dragend={dragEnd}
					>
						<div
							class="relative flex h-10 w-full cursor-grab items-center justify-center text-white !opacity-100 ring-1 ring-neutral-500 hover:bg-brand-800 hover:ring-brand-500 focus:cursor-grabbing"
						>
							{component.name}
						</div>
					</li>
				{/each}
			</ul>
			<div class="text-white">
				<p>{`X: ${client.x} Y: ${client.y}`}</p>
				<p>{`DraggingComponent: ${client.currentComponent}`}</p>
				<p>{`DraggingOver: ${client.isDraggingOver}`}</p>
			</div>
		</nav>
		<section
			class="max-h-editor overflow-y-auto relative grid flex-1 bg-slate-100 bg-[radial-gradient(#dfe2e8_1px,transparent_1px)] py-4 pt-8 [background-size:16px_16px]"
		>
			<div class="max-w-editor relative mx-auto">
				<div
					class="resize-item absolute bottom-0 left-0 top-0 z-20 grid w-1 cursor-w-resize items-center hover:bg-slate-300"
					id="resize-left"
				>
					<div class="h-full max-h-32 w-2 -translate-x-1 rounded-full bg-gray-500" />
				</div>
				<div
					class="resize-item absolute bottom-0 right-0 top-0 z-20 grid w-1 cursor-e-resize items-center hover:bg-slate-300"
					id="resize-right"
				>
					<div class="h-full max-h-32 w-2 rounded-full bg-gray-500" />
				</div>

				<div
					id="editor-preview"
					style="width: calc(100vw - 40rem - 2rem);"
					class="max-w-editor absolute mx-auto h-full w-full rounded-sm bg-white shadow-2xl"
				>
					<ul>
						<li class="single-component relative w-full">
							<div
								class="add-content my-0 flex w-full items-center"
								on:drop={placeComponent}
								on:dragenter={(e) => enterPlaceRegion(e, 0)}
								on:dragleave={(e) => leavePlaceRegion(e, 0)}
								on:dragover={dragOver}
								role="listitem"
							>
								<button
									class="absolute left-0 right-0 z-10 flex h-1 w-full items-center justify-center bg-gradient-to-r from-transparent via-brand-500 to-transparent transition-all hover:h-3"
									class:py-2={client.isDragging}
									class:bg-brand-500={client.isDraggingOver == 0}
								>
									<span class="absolute z-10" class:pointer-events-none={client.isDragging}>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="32"
											height="32"
											fill="#000000"
											class="rounded-full bg-brand-500 fill-brand-800 shadow-lg"
											viewBox="0 0 256 256"
											><path
												d="M128,24A104,104,0,1,0,232,128,104.13,104.13,0,0,0,128,24Zm40,112H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32a8,8,0,0,1,0,16Z"
											></path></svg
										>
									</span>
								</button>
							</div>	
						</li>
						{#each layout_blocks as block, index}
							<li class="single-component relative w-full">
								<button id={`${index} + 1`}>
									<svelte:component this={block.component} bind:data={block.data} />
								</button>
								<div
									class="add-content my-0 flex w-full items-center"
									on:drop={placeComponent}
									on:dragenter={(e) => enterPlaceRegion(e, index + 1)}
									on:dragleave={(e) => leavePlaceRegion(e, index + 1)}
									on:dragover={dragOver}
									role="listitem"
								>
									<button
										class="absolute left-0 right-0 z-10 flex h-1 w-full items-center justify-center bg-gradient-to-r from-transparent via-brand-500 to-transparent transition-all hover:h-3"
										class:py-2={client.isDragging}
										class:bg-brand-500={client.isDraggingOver == index}
									>
										<span class="absolute z-10" class:pointer-events-none={client.isDragging}>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="32"
												height="32"
												fill="#000000"
												class="rounded-full bg-brand-500 fill-brand-800 shadow-lg"
												viewBox="0 0 256 256"
												><path
													d="M128,24A104,104,0,1,0,232,128,104.13,104.13,0,0,0,128,24Zm40,112H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32a8,8,0,0,1,0,16Z"
												></path></svg
											>
										</span>
									</button>
								</div>
								<div class="component-outline pointer-events-none" />
								<div class="component-settings bottom-0 z-50 flex w-fit gap-1 bg-[blue] p-1">
									<button on:click={(e) => e} class="h-5 min-w-5 rounded-md p-0.5">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="fill-blue-200 hover:fill-white"
											width="full"
											height="full"
											fill="#000000"
											viewBox="0 0 256 256"
											><path
												d="M237.94,107.21a8,8,0,0,0-3.89-5.4l-29.83-17-.12-33.62a8,8,0,0,0-2.83-6.08,111.91,111.91,0,0,0-36.72-20.67,8,8,0,0,0-6.46.59L128,41.85,97.88,25a8,8,0,0,0-6.47-.6A111.92,111.92,0,0,0,54.73,45.15a8,8,0,0,0-2.83,6.07l-.15,33.65-29.83,17a8,8,0,0,0-3.89,5.4,106.47,106.47,0,0,0,0,41.56,8,8,0,0,0,3.89,5.4l29.83,17,.12,33.63a8,8,0,0,0,2.83,6.08,111.91,111.91,0,0,0,36.72,20.67,8,8,0,0,0,6.46-.59L128,214.15,158.12,231a7.91,7.91,0,0,0,3.9,1,8.09,8.09,0,0,0,2.57-.42,112.1,112.1,0,0,0,36.68-20.73,8,8,0,0,0,2.83-6.07l.15-33.65,29.83-17a8,8,0,0,0,3.89-5.4A106.47,106.47,0,0,0,237.94,107.21ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"
											></path></svg
										>
									</button>
									<button on:click={(e) => e} class="h-5 min-w-5 rounded-md p-0.5">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="fill-blue-200 hover:fill-white"
											width="full"
											height="full"
											fill="#000000"
											viewBox="0 0 256 256"
											><path
												d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32Zm-8,128H176V88a8,8,0,0,0-8-8H96V48H208Z"
											></path></svg
										>
									</button>
									<button
										on:click={(e) => deleteComponent(e, index)}
										class="h-5 min-w-5 rounded-md p-0.5"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="fill-blue-200 hover:fill-red-500"
											width="full"
											height="full"
											fill="#000000"
											viewBox="0 0 256 256"
											><path
												d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM112,168a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm0-120H96V40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8Z"
											></path></svg
										>
									</button>
									<button on:click={(e) => e} class="h-5 min-w-5 rounded-md p-0.5">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="fill-blue-200 hover:fill-white"
											width="full"
											height="full"
											fill="#000000"
											viewBox="0 0 256 256"
											><path
												d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"
											></path></svg
										>
									</button>
								</div>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</section>
		<section
			class="h-full-editor overflow-y-auto min-w-[20rem] max-w-[20rem] border-l border-l-neutral-600 bg-[#121212]"
		>
			<ul class="p-2 text-white">
				<li>
					<div>
						Text:
						<input bind:value={layout_blocks[0].data.content} />
					</div>
				</li>
				<li>3</li>
				<li>4</li>
				<li>6</li>
			</ul>
			<div class="w-full overflow-scroll">
				<code class="text-white">
					{JSON.stringify(layout_blocks)}
				</code>
			</div>
		</section>
	</div>
</main>

<style>
	.h-full-editor {
		min-height: calc(100vh - 4rem);
	}

	:is(#dragged .add-content) {
		display: none;
	}

	.max-w-editor {
		position: relative;
		max-width: calc(100vw - 40rem - 2rem);
	}

	.max-h-editor {
		max-height: calc(100vh - 4rem);
	}

	.single-component .component-settings {
		display: none;
		position: absolute;
	}

	.single-component:hover .component-outline {
		display: none;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border: solid 4px blue;
	}

	.single-component:hover .component-settings,
	.single-component:hover .component-outline {
		display: flex;
	}
</style>
