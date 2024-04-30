<script lang="ts">
	// type imports
	import type { SvelteComponent } from 'svelte';

	// svelte / page imports
	import { flip } from 'svelte/animate';
	import { onMount } from 'svelte';
	import { tick } from 'svelte';
	import { makeResizableDiv } from '$lib/components/svelted-core/resizeable/resizeable';
	import {
		AlignCenterHorizontalSimple,
		ArrowClockwise,
		ArrowCounterClockwise,
		CaretDown,
		Check,
		Columns,
		Cube,
		Paragraph,
		PlusSquare,
		TextH
	} from 'phosphor-svelte';

	// shadcn ui imports
	import * as Command from '$lib/components/svelted-core/ui/command/index.js';
	import * as Popover from '$lib/components/svelted-core/ui/popover/index.js';
	import { Button } from '$lib/components/svelted-core/ui/button/index.js';
	import { cn } from '$lib/components/svelted-core/utils.js';

	// layout component imports
	import BLOCK_Paragraph from '$lib/svelted/components/core/Paragraph.svelte';
	import BLOCK_Heading1 from '$lib/svelted/components/core/Heading1.svelte';
	import BLOCK_Navigation from '$lib/svelted/components/custom/Navigation.svelte';
	import BLOCK_OverflowY from '$lib/svelted/components/tests/OverflowYComponent.svelte';
	import BLOCK_Row from '$lib/svelted/components/tests/Row.svelte';

	interface Client {
		x: number;
		y: number;
		isDragging: boolean;
		isDraggingOver: number | undefined;
		currentComponent: string | undefined;
		shiftKeyHeld: boolean;
		scale: number;
	}

	interface LayoutBlock {
		name: string;
		component: SvelteComponent | any;
		data: any;
	}

	let sidebar = {
		left: {
			expanded: false,
			page: ''
		},
		right: {
			expanded: true,
			page: ''
		}
	};

	let undoStack: any = [];
	let redoStack: any = [];

	let component_blocks = [
		{
			name: 'Testing Overflow Y',
			component: BLOCK_OverflowY,
			icon: AlignCenterHorizontalSimple,
			data: { content: undefined, class: undefined }
		},
		{
			name: 'Paraghaph',
			component: BLOCK_Paragraph,
			icon: Paragraph,
			data: { content: undefined, class: undefined }
		},
		{
			name: 'Row',
			component: BLOCK_Row,
			icon: Columns,
			data: {
				content: [
					{
						name: 'Paraghaph',
						// component: BLOCK_Paragraph,
						data: { content: 'test', class: undefined }
					},
					{
						name: 'Paraghaph',
						// component: BLOCK_Paragraph,
						data: { content: 'other test', class: undefined }
					}
				],
				class: undefined
			}
		},
		{
			name: 'Heading',
			component: BLOCK_Heading1,
			icon: TextH,
			data: { content: undefined, class: undefined }
		},
		{
			name: 'Basic Navigation',
			component: BLOCK_Navigation,
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
			component: BLOCK_Navigation,
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
		{
			name: 'Heading',
			component: BLOCK_Heading1,
			data: { class: 'text-2xl', content: 'Hello World!' }
		},
		{
			name: 'Paragraph',
			component: BLOCK_Paragraph,
			data: { class: 'text-lg', content: 'Message by Lukas :D' }
		}
	];

	let client: Client = {
		x: 0,
		y: 0,
		currentComponent: undefined,
		isDragging: false,
		isDraggingOver: undefined,
		shiftKeyHeld: false,
		scale: 1
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

	const recordAction = (action: any) => {
		undoStack.push(action);
		redoStack = [];
	};

	const undo = () => {
		console.log('undo');

		if (undoStack.length > 0) {
			const lastAction = undoStack.pop();
			redoStack.push(lastAction);
			redoStack = redoStack;
			undoStack = undoStack;
			layout_blocks = layout_blocks;

			// Revert the action
			if (lastAction.type === 'add') {
				layout_blocks.splice(lastAction.index, 1);
			} else if (lastAction.type === 'delete') {
				layout_blocks.splice(lastAction.index, 0, lastAction.block);
			}
		}
	};

	const redo = () => {
		if (redoStack.length > 0) {
			const lastAction = redoStack.pop();
			undoStack.push(lastAction);
			layout_blocks = layout_blocks;

			// Apply the action
			if (lastAction.type === 'add') {
				layout_blocks.splice(lastAction.index, 0, lastAction.block);
			} else if (lastAction.type === 'delete') {
				layout_blocks.splice(lastAction.index, 1);
			}
		}
	};

	const placeComponent = function (e: DragEvent) {
		// Your existing code...
		if (client.currentComponent) {
			const newBlock = {
				id: client.isDraggingOver! + 1,
				component: component_blocks[Number(client.currentComponent)].component,
				name: structuredClone(component_blocks[Number(client.currentComponent)].name),
				data: structuredClone(component_blocks[Number(client.currentComponent)].data)
			};

			// Record the action before adding the component
			recordAction({ type: 'add', block: newBlock, index: client.isDraggingOver });
			addComponentBlock(component_blocks, client.isDraggingOver!, newBlock);
		}
	};

	const deleteComponent = function (e: MouseEvent, id: number) {
		// Record the action before deleting the component
		recordAction({ type: 'delete', block: layout_blocks[id], index: id });
		layout_blocks.splice(id, 1);
		layout_blocks = layout_blocks;
	};
	const changeSidebarPage = function (side: string, page: string) {
		if (side == 'left') {
			sidebar.left.page = page;
			sidebar.left.expanded = true;
		}
		if (side == 'right') {
			sidebar.right.page = page;
			sidebar.right.expanded = true;
		}
	};

	const handleKeyDown = function (e: KeyboardEvent) {
		if (e.shiftKey) {
			client.shiftKeyHeld = true;
		}
	};

	const handleKeyUp = function (e: KeyboardEvent) {
		if (!e.shiftKey) {
			client.shiftKeyHeld = false;
		}
	};

	const increaseEditorScale = function () {
		const preview = document.getElementById('editor-preview');
		const resizeLeft = document.getElementById('resize-left');
		const resizeRight = document.getElementById('resize-right');

		if (!Number(preview!.style.scale)) {
			preview!.style.scale = '1';
		}

		const currentScale = Number(preview!.style.scale);

		if (Number(preview!.style.scale) > 0.2) {
			client.scale = client.scale - 0.1;
			selectedScale = `${(client.scale * 100).toFixed()} %`;
			preview!.style.scale = String(Number(preview!.style.scale) - 0.1);
			resizeLeft!.style.marginLeft = `${(1 - currentScale + 0.1) * 50}%`;
			resizeRight!.style.marginRight = `${(1 - currentScale + 0.1) * 50}%`;
		}
	};

	const decreaseEditorScale = function () {
		if (client.shiftKeyHeld) {
			const preview = document.getElementById('editor-preview');
			const resizeLeft = document.getElementById('resize-left');
			const resizeRight = document.getElementById('resize-right');

			if (!Number(preview!.style.scale)) {
				preview!.style.scale = '1';
			}

			const currentScale = Number(preview!.style.scale);

			if (currentScale != 1) {
				client.scale = client.scale + 0.1;
				selectedScale = `${(client.scale * 100).toFixed()} %`;
				preview!.style.scale = String(currentScale + 0.1);
				resizeLeft!.style.marginLeft = `${(1 - currentScale - 0.1) * 50}%`;
				resizeRight!.style.marginRight = `${(1 - currentScale - 0.1) * 50}%`;
			}
		}
	};

	const setEditorScale = function (scale: number) {
		client.scale = scale / 100;

		const preview = document.getElementById('editor-preview');
		const resizeLeft = document.getElementById('resize-left');
		const resizeRight = document.getElementById('resize-right');

		preview!.style.scale = String(scale / 100);

		resizeLeft!.style.marginLeft = `${50 - scale / 2}%`;
		resizeRight!.style.marginRight = `${50 - scale / 2}%`;
	};

	const handleScroll = async function (e: WheelEvent) {
		if (e.deltaY > 0) {
			if (client.shiftKeyHeld) {
				increaseEditorScale();
			}
		} else {
			decreaseEditorScale();
		}
	};

	const hideOverlay = function (e: MouseEvent, id: number) {};

	function addComponentBlock(
		component_blocks: LayoutBlock[],
		index: number,
		newBlock: LayoutBlock
	): void {
		if (index < 0 || index > component_blocks.length) {
			layout_blocks.push(newBlock);
			layout_blocks = layout_blocks;
		} else {
			layout_blocks.splice(index, 0, newBlock);
			layout_blocks = layout_blocks;
		}
	}
	const pageRoutes = [
		{
			value: 'home',
			label: 'Home'
		},
		{
			value: 'about',
			label: 'About'
		},
		{
			value: 'blog',
			label: 'Blog'
		}
	];

	const pageScales = [
		{
			value: '100',
			label: '100 %'
		},
		{
			value: '90',
			label: '90 %'
		},
		{
			value: '80',
			label: '80 %'
		},
		{
			value: '70',
			label: '70 %'
		},
		{
			value: '60',
			label: '60 %'
		},
		{
			value: '50',
			label: '50 %'
		},
		{
			value: '40',
			label: '40 %'
		},
		{
			value: '30',
			label: '30 %'
		},
		{
			value: '20',
			label: '20 %'
		}
	];

	let open = false;
	let scaleSwitchOpen = false;
	let value = '';

	$: selectedRoute = pageRoutes.find((f) => f.value === value)?.label ?? 'Select a Page...';
	$: selectedScale = pageScales.find((f) => f.value === value)?.label ?? '100 %';

	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	function closeAndFocusTriggerScale(triggerId: string) {
		scaleSwitchOpen = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	onMount(async () => {
		makeResizableDiv('#editor-preview');
		window.addEventListener('wheel', handleScroll);
	});
</script>

<svelte:window on:keydown={handleKeyDown} on:keyup={handleKeyUp} />

<main class="h-full max-h-screen min-h-screen w-full bg-neutral-900">
	<nav class="flex h-16 items-center justify-between border-b bg-slate-950">
		<div class="flex h-full items-center gap-4">
			<a href="/svelted/dashboard" class="grid h-full w-16 items-center hover:bg-slate-800">
				<img
					class="m-auto h-10 w-10 opacity-80 transition-all"
					src="/static-svelted/svelted-white.svg"
					alt="Svelted Logo - Back"
				/>
			</a>
			<div class="flex flex-col">
				<h1 class="text-lg font-bold text-neutral-200">Svelted CMS</h1>
				<span class="-mt-2 text-sm font-medium text-neutral-500">made by Plunzi</span>
			</div>
			<div class="flex h-full w-48 items-center border-x border-slate-600 text-white">
				<Popover.Root bind:open let:ids>
					<Popover.Trigger asChild let:builder>
						<Button
							builders={[builder]}
							variant="outline"
							role="combobox"
							aria-expanded={open}
							class="h-full w-48 justify-between rounded-none border-none bg-slate-900 outline-none"
						>
							{selectedRoute}
							<CaretDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</Popover.Trigger>
					<Popover.Content class="w-48 rounded-none p-0">
						<Command.Root>
							<Command.Input placeholder="Search route..." class="h-12" />
							<Command.Empty>
								<button>Create new route</button>
							</Command.Empty>
							<Command.Group class="max-h-[20rem] overflow-y-auto p-0">
								{#each pageRoutes as route}
									<Command.Item
										value={route.value}
										onSelect={(currentValue) => {
											value = currentValue;
											closeAndFocusTrigger(ids.trigger);
										}}
									>
										<Check
											class={cn('mr-2 h-8 w-4', value !== route.value && 'text-transparent')}
										/>
										{route.label}
									</Command.Item>
								{/each}
							</Command.Group>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			</div>
			<div class="flex">
				<button
					on:click={() => changeSidebarPage('left', 'add-components')}
					class="toolbar-item flex h-12 w-12 items-center justify-center hover:bg-slate-800"
				>
					<PlusSquare class="h-8 w-8 fill-slate-400" weight="fill" />
				</button>
				<button
					on:click={undo}
					class="toolbar-item flex h-12 w-12 items-center justify-center hover:bg-slate-800"
				>
					<ArrowCounterClockwise class="h-7 w-7 fill-slate-400" weight="bold" />
				</button>
				<button
					on:click={redo}
					class="toolbar-item flex h-12 w-12 items-center justify-center hover:bg-slate-800"
				>
					<ArrowClockwise class="h-7 w-7 fill-slate-400" weight="bold" />
				</button>
			</div>
		</div>
		<div class="flex h-full">
			<Popover.Root bind:open={scaleSwitchOpen} let:ids>
				<Popover.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						variant="outline"
						role="combobox"
						aria-expanded={scaleSwitchOpen}
						class="h-full w-48 justify-between rounded-none border-none bg-slate-900 text-white outline-none"
					>
						Scale {selectedScale}
						<CaretDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</Popover.Trigger>
				<Popover.Content class="w-48 rounded-none p-0">
					<Command.Root>
						<Command.Input placeholder="Search scale..." class="h-12" />
						<Command.Empty>
							<button>Scale not found</button>
						</Command.Empty>
						<Command.Group class="max-h-[20rem] overflow-y-auto p-0">
							{#each pageScales as scale}
								<Command.Item
									value={scale.value}
									onSelect={(currentValue) => {
										value = currentValue;
										closeAndFocusTriggerScale(ids.trigger);
										setEditorScale(Number(currentValue));
									}}
								>
									<Check class={cn('mr-2 h-8 w-4', value !== scale.value && 'text-transparent')} />
									{scale.label}
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
		</div>
		<div class="flex h-full items-center gap-4">
			<div
				class="flex h-full w-48 items-center justify-center rounded-none border-none bg-blue-500 text-lg font-medium text-white outline-none"
			>
				Save changes
			</div>
		</div>
	</nav>
	<div class="flex">
		<nav
			class="h-full-editor transition-width flex flex-col overflow-hidden border-r bg-white {sidebar
				.left.expanded
				? 'min-w-[18rem] max-w-[18rem]'
				: 'min-w-16 max-w-16 gap-3 p-2 pt-4'}"
		>
			{#if sidebar.left.expanded}
				{#if sidebar.left.page == 'add-components'}
					<div class="w-[18rem] min-w-[18rem]">
						<div>
							<button
								on:click={() => (sidebar.left.expanded = false)}
								class="mb-4 flex w-full items-center gap-2 bg-neutral-100 px-4 py-4 hover:bg-neutral-200"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									viewBox="0 0 16 16"
									style="cursor: default;"
									class="rotate-180"
								>
									<path
										fill-rule="evenodd"
										d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
									/>
								</svg>
								<h1>Overview</h1>
							</button>
						</div>
						<div class="mb-4 flex w-full border-b border-b-slate-200">
							<button
								class="w-full border-b-4 border-b-brand-500 py-1 pl-3 text-left hover:bg-neutral-100"
								>Blocks
							</button>
							<button
								class="w-full border-b-4 border-white py-1 pl-3 text-left hover:border-neutral-100 hover:bg-neutral-100"
								>Patterns
							</button>
						</div>
						<ul class="relative flex flex-col gap-2 px-4">
							{#each component_blocks as component, index (component)}
								<li
									class="component-block block w-full"
									animate:flip={{ duration: 300 }}
									id={`${index}`}
									draggable="true"
									on:dragstart={dragStart}
									on:drag={drag}
									on:dragend={dragEnd}
								>
									<div
										class="relative flex h-10 min-h-10 w-full cursor-grab items-center justify-between border bg-neutral-100 pl-2 pr-4 !opacity-100 transition-all hover:border-neutral-500 hover:bg-neutral-200 focus:cursor-grabbing"
									>
										{#if component.icon}
											<svelte:component
												this={component.icon}
												class="fill-slate-900"
												weight="fill"
												size={24}
											/>
										{:else}
											<Cube class=" fill-slate-900" weight="fill" size={24} />
										{/if}
										{component.name}
									</div>
								</li>
							{/each}
						</ul>
						<div class="px-4">
							<p class="mt-4 text-sm">
								Drag and drop layout blocks to your location of choice. Drop locations will be
								highlited after picking them up.
							</p>
						</div>
						<div class="text-white">
							<p>{`X: ${client.x} Y: ${client.y}`}</p>
							<p>{`DraggingComponent: ${client.currentComponent}`}</p>
							<p>{`DraggingOver: ${client.isDraggingOver}`}</p>
						</div>
					</div>
				{/if}
				{#if sidebar.left.page == 'list-components'}
					<div class="w-[18rem] min-w-[18rem]">
						<div>
							<button
								on:click={() => (sidebar.left.expanded = false)}
								class="mb-4 flex w-full items-center gap-2 bg-neutral-100 px-4 py-4 hover:bg-neutral-200"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									fill="currentColor"
									viewBox="0 0 16 16"
									style="cursor: default;"
									class="rotate-180"
								>
									<path
										fill-rule="evenodd"
										d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
									/>
								</svg>
								<h1>Overview</h1>
							</button>
						</div>
						<ul class="relative flex flex-col gap-2 px-4">
							{#each layout_blocks as block, index (block)}
								<li
									class="component-block block w-full"
									animate:flip={{ duration: 300 }}
									id={`${index}`}
								>
									<div
										class="relative flex h-10 min-h-10 w-full items-center justify-between border bg-neutral-100 pl-2 pr-4 !opacity-100 transition-all hover:border-neutral-500 hover:bg-neutral-200 focus:cursor-grabbing"
									>
										<Cube class=" fill-slate-900" weight="fill" size={24} />
										{block.name}
									</div>
								</li>
							{/each}
						</ul>
						<div class="px-4">
							<p class="mt-4 text-sm">
								This is a list showing all components displayed on this page.
							</p>
						</div>
					</div>
				{/if}
			{:else}
				<button
					on:click={() => changeSidebarPage('left', 'add-components')}
					class="grid aspect-square w-12 items-center p-1 hover:border hover:bg-gray-100"
				>
					<svg
						class="m-auto"
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						fill="#000000"
						viewBox="0 0 256 256"
						><path
							d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"
						></path></svg
					>
				</button>
				<button
					on:click={() => changeSidebarPage('left', 'list-components')}
					class="grid aspect-square w-12 items-center p-1 hover:border hover:bg-gray-100"
				>
					<svg
						class="m-auto"
						xmlns="http://www.w3.org/2000/svg"
						width="32"
						height="32"
						fill="#000000"
						viewBox="0 0 256 256"
						><path
							d="M230.91,172A8,8,0,0,1,228,182.91l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,36,169.09l92,53.65,92-53.65A8,8,0,0,1,230.91,172ZM220,121.09l-92,53.65L36,121.09A8,8,0,0,0,28,134.91l96,56a8,8,0,0,0,8.06,0l96-56A8,8,0,1,0,220,121.09ZM24,80a8,8,0,0,1,4-6.91l96-56a8,8,0,0,1,8.06,0l96,56a8,8,0,0,1,0,13.82l-96,56a8,8,0,0,1-8.06,0l-96-56A8,8,0,0,1,24,80Zm23.88,0L128,126.74,208.12,80,128,33.26Z"
						></path></svg
					>
				</button>
			{/if}
		</nav>
		<section
			class="max-h-editor relative grid flex-1 overflow-y-auto bg-slate-100 bg-[radial-gradient(#dfe2e8_1px,transparent_1px)] py-4 pt-8 [background-size:16px_16px]"
		>
			<div class="max-w-editor relative mx-auto flex" id="editor-wrapper" style="max-width: 100%">
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
											class="rounded-full bg-brand-500 fill-slate-100 shadow-lg"
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
						</li>
						{#each layout_blocks as block, index}
							<li class="single-component relative w-full">
								<button id={`${index + 1}`} class="w-full">
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
										class="absolute left-0 right-0 z-10 flex h-1 w-full items-center justify-center bg-gradient-to-r from-transparent via-brand-500 to-transparent transition-all hover:h-3 hover:bg-brand-500"
										class:py-2={client.isDragging}
										class:bg-brand-500={client.isDraggingOver == index}
									>
										<span class="absolute z-10" class:pointer-events-none={client.isDragging}>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="32"
												height="32"
												fill="#000000"
												class="rounded-full bg-brand-500 fill-slate-100 shadow-lg"
												viewBox="0 0 256 256"
												><path
													d="M128,24A104,104,0,1,0,232,128,104.13,104.13,0,0,0,128,24Zm40,112H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32a8,8,0,0,1,0,16Z"
												></path></svg
											>
										</span>
									</button>
								</div>
								<div class="component-outline pointer-events-none" />
								<div
									class="component-settings -bottom-7 -left-0.5 z-50 flex w-fit gap-1 bg-[blue] p-1 pb-1.5 pt-0.5 outline-2 outline-[blue]"
								>
									<button on:click={(e) => e} class="h-5 min-w-5 rounded-md p-0.5">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="fill-blue-200 hover:fill-white"
											width="20"
											height="20"
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
											width="20"
											height="20"
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
											width="20"
											height="20"
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
											width="20"
											height="20"
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
			class="h-full-editor max-h-editor min-w-[20rem] max-w-[20rem] overflow-auto border-l bg-white px-4"
		>
			<ul class="p-2">
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
			<div class="w-full overflow-auto">
				<code class="">
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
		outline: solid 2px blue;
		z-index: 1;
	}

	.single-component:hover .component-settings,
	.single-component:hover .component-outline {
		display: flex;
	}

	.transition-width {
		transition:
			min-width ease-out 0.25s,
			max-width ease-out 0.25s;
	}
</style>
