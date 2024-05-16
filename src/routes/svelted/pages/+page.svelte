<script lang="ts">
	import Navigation from '$lib/svelted/navigation/Navigation.svelte';
	import {
		Blueprint,
		CaretDown,
		CaretUp,
		Check,
		Funnel,
		Pen,
		Plus,
		Rows,
		SquaresFour,
		Trash,
		UserList
	} from 'phosphor-svelte';
	import { writable } from 'svelte/store';
	import formatTime from '$lib/svelted/format/time';

	// shadcn ui imports
	import Checkbox from '$lib/internal/shadcn/ui/checkbox/checkbox.svelte';
	import { Toaster } from '$lib/internal/shadcn/ui/sonner';
	import { toast } from 'svelte-sonner';
	import * as Tooltip from '$lib/internal/shadcn/ui/tooltip';
	import * as Command from '$lib/internal/shadcn/ui/command/index.js';
	import * as Popover from '$lib/internal/shadcn/ui/popover/index.js';
	import { Button } from '$lib/internal/shadcn/ui/button/index.js';
	import { cn } from '$lib/internal/shadcn/utils.js';
	import { tick } from 'svelte';
	import { flip } from 'svelte/animate';
	import AlertDialog from '$lib/svelted/alert-dialog/AlertDialog.svelte';
	import { closeModal, openModal } from '$lib/svelted/alert-dialog/AlertDialogControls.js';

	export let data;

	let searchTerm = '';

	const hoverOver = function (element: string | undefined) {
		client.hoverOver = element;
	};

	type DropdownValue = {
		value: string;
		label: string;
		selection: string | undefined;
	};

	type DropdownValues = DropdownValue[];

	interface Client {
		hoverOver: undefined | string;
		sidebar: boolean;
		display: string | undefined;
		routeInput: string;
		titleInput: string;
		modal: {
			title: string | undefined;
			description: string | undefined;
		};
		delete: {
			route: string | undefined;
			id: number | undefined;
		};
		dropdowns: {
			status: {
				open: boolean;
				value: string;
			};
			layout: {
				open: boolean;
				value: string;
				selection: string | undefined;
			};
		};
	}

	let selectedRows: string[] = [];

	let client: Client = {
		hoverOver: undefined,
		sidebar: false,
		display: 'table',
		routeInput: '',
		titleInput: '',
		modal: {
			title: undefined,
			description: undefined
		},
		delete: {
			route: undefined,
			id: undefined
		},
		dropdowns: {
			status: {
				open: false,
				value: 'draft'
			},
			layout: {
				open: false,
				value: 'none',
				selection: undefined
			}
		}
	};

	let pageStatusOptions: DropdownValues = [
		{ label: 'Draft', value: 'draft', selection: 'draft' },
		{ label: 'Published', value: 'published', selection: 'published' }
	];

	let pageLayoutOptions: DropdownValues = data.layouts;

	let items = data.pages || [];

	const sortKey = writable('route'); // default sort key
	const sortDirection = writable(1); // default sort direction (ascending)
	const sortItems = writable(items.slice()); // make a copy of the items array

	// Define a function to sort the items
	const sortTable = (key: string) => {
		// If the same key is clicked, reverse the sort direction
		if ($sortKey === key) {
			sortDirection.update((val) => -val);
		} else {
			sortKey.set(key);
			sortDirection.set(1);
		}
	};

	const showCreateForm = function () {
		const createForm = document.getElementById('create-page-form')!;
		const editor = document.getElementById('page-editor')!;
		if (createForm.style.display == 'flex') {
			createForm.style.display = 'none';
			editor.classList.remove('max-h-small-editor');
		} else {
			createForm.style.display = 'flex';
			editor.classList.add('max-h-small-editor');
		}

		// max-height: calc(100vh - 14rem);
	};

	const createPage = async function () {
		const formData = new FormData();
		// client.isSaving = true;
		// client.savingMessage = 'Loading ...';

		formData.append('route', client.routeInput);
		formData.append('title', client.titleInput);
		formData.append('status', client.dropdowns.status.value);
		formData.append('layout', client.dropdowns.layout.selection || 'none');

		const response = await fetch('/svelted/pages/create', {
			method: 'POST',
			body: formData
		});

		// client.isSaving = false;
		// client.savingMessage = 'Save changes';

		let result = await response.json();
		result.data.route = result.route;

		items.push(result.data);
		sortItems.set(items.slice());

		client.titleInput = '';
		client.routeInput = '';
		client.dropdowns.layout.value = 'none';
		client.dropdowns.layout.selection = undefined;
	};

	const deleteModal = function (route: string, id: number) {
		currentAction = deletePage;
		client.delete.id = id;
		client.delete.route = route;
		client.modal.title = `Confirm Deletion <span class="text-svelted-primary-500">${route}</span> Layout?`;
		client.modal.description =
			'This action cannot be undone. It will permanently delete the specified layout and remove its associated data from your servers.';
		openModal();
	};

	const toggleCheckbox = function (input: string) {
		if (selectedRows.includes(input)) {
			selectedRows = selectedRows.filter((route) => route !== input);
			selectedRows = selectedRows;
		} else {
			selectedRows.push(input);
			selectedRows = selectedRows;
		}
	};

	const deleteStackModal = function () {
		currentAction = deleteStack;
		client.modal.title = `Delete <span class="text-svelted-primary-500">${selectedRows.length}</span> ${selectedRows.length == 1 ? 'Page' : 'Pages'}?`;
		client.modal.description = `This action cannot be undone. It will permanently delete the specified pages and remove its associated data from your servers.<br><br>${selectedRows.map(
			(row, index) => {
				return `${index == 0 ? '' : '<br>'}Delete Layout: ${row}`;
			}
		)}`;
		openModal();
	};

	const deleteStack = async function () {
		selectedRows.map(async (entry) => {
			const deleteRoute = (client.delete.route = entry);
			const deleteId = items.findIndex((page) => page.route === entry);

			if (!deleteRoute || (!deleteId && deleteId != 0)) {
				closeModal();
				return;
			}

			toast.loading(`Trying to delete route: ${deleteRoute}`);

			const formData = new FormData();
			formData.append('route', deleteRoute);

			const response = await fetch('/svelted/pages/delete', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const error = await response.text();
				toast.error(error);
			} else {
				if (client.hoverOver == `pages-delete-${deleteId}`) {
					hoverOver(undefined);
				}

				const indexToRemove = items.findIndex((item) => item.route === deleteRoute);
				if (indexToRemove !== -1) {
					items.splice(indexToRemove, 1);
					sortItems.set(items.slice());
				}

				let result = await response.text();
				toast.success(result);
			}
		});
		closeModal();
	};

	const checkAllCheckboxes = function () {
		if (items.length == selectedRows.length) {
			selectedRows = [];
		} else {
			selectedRows = items.map((item) => {
				return item.route;
			});
		}
	};

	const deletePage = async function (): Promise<void> {
		const deleteRoute = client.delete.route;
		const deleteId = client.delete.id;

		if (!deleteRoute || (!deleteId && deleteId != 0)) {
			closeModal();
			return;
		}

		// /*
		toast.loading(`Trying to delete route: ${deleteRoute}`);

		const formData = new FormData();
		// client.isSaving = true;
		// client.savingMessage = 'Loading ...';

		formData.append('route', deleteRoute);

		const response = await fetch('/svelted/pages/delete', {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			const error = await response.text();
			toast.error(error);
		} else {
			if (client.hoverOver == `pages-delete-${deleteId}`) {
				hoverOver(undefined);
			}

			const indexToRemove = items.findIndex((item) => item.route === deleteRoute);
			if (indexToRemove !== -1) {
				items.splice(indexToRemove, 1);
				sortItems.set(items.slice());
			}

			let result = await response.text();
			toast.success(result);
		}

		closeModal();

		// client.isSaving = false;
		// client.savingMessage = 'Save changes';
	};

	let currentAction = deletePage;

	$: {
		const key = $sortKey;
		const direction = $sortDirection;
		const sorted = [...$sortItems].sort((a, b) => {
			const aVal = a[key];
			const bVal = b[key];
			if (aVal < bVal) {
				return -direction;
			} else if (aVal > bVal) {
				return direction;
			}
			return 0;
		});
		sortItems.set(sorted);
	}

	function closeAndFocusTrigger(triggerId: string) {
		client.dropdowns.status.open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	$: selectedStatus =
		pageStatusOptions.find((f) => f.value === client.dropdowns.status.value)?.label ??
		'Select a status';
	$: selectedLayout =
		pageLayoutOptions.find((f) => f.value === client.dropdowns.layout.value)?.label ??
		'Select a layout';

	$: filteredItems = $sortItems.filter(
		(item) => item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
	);
</script>

<Navigation overflow={false} site={['Pages']} activepage="Pages">
	<div class="flex bg-neutral-950">
		<!-- <div class="flex w-full flex-col justify-between p-4">
			<QuickToDo tasks={data.todo.data} />
        </div> -->
		<div class="relative flex w-full flex-col gap-4 px-3 pt-3 text-white">
			<div class="flex justify-between gap-2">
				<div class="flex h-10 items-center gap-2 px-2">
					<Blueprint class="mt-0.5 h-6 w-6 fill-neutral-500" weight="regular" />
					<p class="font-medium text-neutral-500">Pages Overview</p>
					<p class="text-neutral-500">―</p>
					<p class="text-neutral-500">
						All {items.length}, Published {items.filter((item) => item.status == 'published')
							.length}, Drafts {items.filter((item) => item.status == 'draft').length}
					</p>
				</div>
				<div class="flex gap-2">
					<button
						on:click={() => (client.display = 'tables')}
						on:mouseenter={() => hoverOver('display-tables')}
						on:mouseleave={() => hoverOver(undefined)}
						class="flex h-10 w-10 items-center justify-center rounded-lg bg-svelted-gray-700 text-neutral-500 hover:bg-svelted-primary-700 hover:text-white"
					>
						{#if client.hoverOver == 'display-tables'}
							<Rows class="h-5 w-5 fill-[currentcolors]" weight="fill" />
						{:else}
							<Rows class="h-5 w-5 fill-[currentcolors]" />
						{/if}
					</button>
					<button
						on:click={() => (client.display = 'cards')}
						on:mouseenter={() => hoverOver('display-cards')}
						on:mouseleave={() => hoverOver(undefined)}
						class="flex h-10 w-10 items-center justify-center rounded-lg bg-svelted-gray-700 text-neutral-500 hover:bg-svelted-primary-500 hover:text-white"
					>
						{#if client.hoverOver == 'display-cards'}
							<SquaresFour class="h-5 w-5 fill-[currentcolors]" weight="fill" />
						{:else}
							<SquaresFour class="h-5 w-5 fill-[currentcolors]" />
						{/if}
					</button>
				</div>
			</div>
			<nav class="flex gap-2">
				<button
					on:click={showCreateForm}
					on:mouseenter={() => hoverOver('create-page')}
					on:mouseleave={() => hoverOver(undefined)}
					class="flex h-10 w-10 items-center justify-center rounded-lg bg-svelted-gray-700 text-neutral-500 hover:bg-svelted-primary-700 hover:text-white"
				>
					{#if client.hoverOver == 'create-page'}
						<Plus class="h-5 w-5 fill-[currentcolors]" weight="bold" />
					{:else}
						<Plus class="h-5 w-5 fill-[currentcolors]" />
					{/if}
				</button>
				<button
					on:click={deleteStackModal}
					on:mouseenter={() => hoverOver('delete-stack')}
					on:mouseleave={() => hoverOver(undefined)}
					class="flex h-10 w-10 items-center justify-center rounded-lg bg-svelted-gray-700 text-neutral-500 hover:bg-red-500 hover:text-white"
				>
					{#if client.hoverOver == 'delete-stack'}
						<Trash class="h-5 w-5 fill-[currentcolors]" weight="fill" />
					{:else}
						<Trash class="h-5 w-5 fill-[currentcolors]" />
					{/if}
				</button>
				<div class="flex-grow">
					<button
						on:mouseenter={() => hoverOver('filter')}
						on:mouseleave={() => hoverOver(undefined)}
						class="contens absolute rounded-l-sm text-neutral-500 hover:text-white focus:bg-[#2da05a] focus:text-white focus:outline-none"
					>
						{#if client.hoverOver == 'filter'}
							<Funnel
								class="h-10 w-11 rounded-l-lg border-r border-neutral-800 fill-[currentcolor] p-2 px-2.5 hover:border-r-[#278c4c] hover:bg-[#278c4c]"
								weight="fill"
							/>
						{:else}
							<Funnel
								class="h-10 w-11 rounded-l-lg border-r border-neutral-800 fill-[currentcolor] p-2 px-2.5 hover:border-r-[#278c4c] hover:bg-[#278c4c]"
							/>
						{/if}
					</button>
					<input
						bind:value={searchTerm}
						name="filter-pages"
						placeholder="Filter Pages ..."
						type="text"
						class="w-full rounded-lg bg-[#161616] px-3 py-2 pl-14 text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#36bf68]"
					/>
				</div>
			</nav>

			<div
				id="create-page-form"
				class="flex hidden justify-between rounded-lg bg-svelted-gray-700 p-2"
			>
				<div class="mt-5 flex">
					<div class="relative w-full">
						<label
							for="enter-page-route"
							class="absolute -top-3.5 w-fit -translate-y-2.5 whitespace-nowrap pl-1.5 pr-1.5 text-sm text-neutral-500"
						>
							Navigation Route
						</label>
						<input
							bind:value={client.routeInput}
							id="enter-page-route"
							class="relative h-10 w-full rounded-l-md border-r border-r-neutral-800 bg-neutral-950 p-2 focus:z-30"
							placeholder="e.g. /contact"
						/>
					</div>
					<div class="relative w-full">
						<label
							for="enter-page-title"
							class="absolute -top-3.5 w-fit -translate-y-2.5 whitespace-nowrap pl-1.5 pr-1.5 text-sm text-neutral-500"
						>
							Page Title
						</label>

						<input
							bind:value={client.titleInput}
							id="enter-page-title"
							class="relative h-10 w-full rounded-r-md bg-neutral-950 p-2 focus:z-10"
							placeholder="e.g. Contact"
						/>
					</div>
					<div class="relative w-full">
						<label
							for="enter-page-status"
							class="absolute -top-3.5 w-fit -translate-y-2.5 whitespace-nowrap pl-1.5 pr-1.5 text-sm text-neutral-500"
						>
							Page Status
						</label>

						<Popover.Root bind:open={client.dropdowns.status.open} let:ids>
							<Popover.Trigger asChild let:builder>
								<Button
									id="enter-page-status"
									builders={[builder]}
									variant="outline"
									role="combobox"
									aria-expanded={client.dropdowns.status.open}
									class="relative h-10 min-w-48 justify-between border-none bg-svelted-gray-700 text-neutral-500 outline-none hover:bg-svelted-primary-700 focus:z-10"
								>
									{selectedStatus}
									<CaretDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</Popover.Trigger>
							<Popover.Content class="w-48 border-none bg-transparent p-0">
								<Command.Root class="bg-svelted-gray-700 text-neutral-400">
									<Command.Input
										placeholder="Search layout..."
										class="h-12 rounded-none bg-svelted-gray-700 text-white"
									/>
									<Command.Empty class="rounded-none bg-svelted-gray-700 text-neutral-500">
										No status found!
									</Command.Empty>
									<Command.Group class="max-h-[20rem] overflow-y-auto p-0">
										{#each pageStatusOptions as status}
											<Command.Item
												class="rounded-none bg-svelted-gray-700 text-neutral-500"
												value={status.value}
												onSelect={(currentValue) => {
													client.dropdowns.status.value = currentValue;
													closeAndFocusTrigger(ids.trigger);
												}}
											>
												<Check
													class={cn(
														'mr-2 h-8 w-4',
														client.dropdowns.status.value !== status.value && 'text-transparent'
													)}
												/>
												{status.label}
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.Root>
							</Popover.Content>
						</Popover.Root>
					</div>
					<div class="relative w-full">
						<label
							for="enter-page-layout"
							class="absolute -top-3.5 w-fit -translate-y-2.5 whitespace-nowrap pl-1.5 pr-1.5 text-sm text-neutral-500"
						>
							Page Layout
						</label>
						<Popover.Root bind:open={client.dropdowns.layout.open} let:ids>
							<Popover.Trigger asChild let:builder>
								<Button
									id="enter-page-layout"
									builders={[builder]}
									variant="outline"
									role="combobox"
									aria-expanded={client.dropdowns.status.open}
									class="relative h-10 min-w-48 justify-between border-none bg-svelted-gray-700 text-neutral-500 outline-none hover:bg-svelted-primary-700 focus:z-10"
								>
									{selectedLayout}
									<CaretDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</Popover.Trigger>
							<Popover.Content class="w-48 border-none bg-transparent p-0">
								<Command.Root class="bg-svelted-gray-700 text-neutral-400">
									<Command.Input
										placeholder="Search layout..."
										class="h-12 rounded-none bg-svelted-gray-700 text-white"
									/>
									<Command.Empty class="rounded-none bg-svelted-gray-700 text-neutral-500">
										<a
											class="text-enutral-500 -my-3 mx-auto flex flex h-10 min-h-10 w-fit items-center justify-center gap-2 rounded-sm bg-neutral-800 px-4 pl-3 pr-5 hover:bg-svelted-primary-700 hover:text-white focus:bg-svelted-primary-700 focus:text-white"
											href="/svelted/layouts"
										>
											<Plus class="h-5 w-5 fill-[currentcolor]" />
											Create new layout
										</a>
									</Command.Empty>
									<Command.Group class="max-h-[20rem] overflow-y-auto p-0">
										{#each pageLayoutOptions as layout}
											<Command.Item
												class="rounded-none bg-svelted-gray-700 text-neutral-500"
												value={layout.value}
												onSelect={(currentValue) => {
													client.dropdowns.layout.value = currentValue;
													client.dropdowns.layout.selection = layout.selection;
													closeAndFocusTrigger(ids.trigger);
												}}
											>
												<Check
													class={cn(
														'mr-2 h-8 w-4',
														client.dropdowns.layout.value !== layout.value && 'text-transparent'
													)}
												/>
												{layout.label}
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.Root>
							</Popover.Content>
						</Popover.Root>
					</div>
				</div>
				<div class="flex">
					<button
						on:click={createPage}
						class="mt-auto flex max-h-10 min-h-10 items-center gap-2 rounded-sm bg-neutral-800 pl-3 pr-5 text-neutral-500 hover:bg-svelted-primary-700 hover:text-white focus:bg-svelted-primary-700 focus:text-white"
					>
						<Plus class="h-5 w-5 fill-[currentcolor]" />
						<span class="whitespace-nowrap">Create Page</span>
					</button>
				</div>
			</div>

			<div class="w-full border-b border-b-neutral-800">
				<Toaster class="absolute bottom-2 right-2 !bg-svelted-gray-700" />
				<AlertDialog
					title={client.modal.title}
					description={client.modal.description}
					action={currentAction}
				/>
			</div>

			<div id="page-editor" class="max-h-editor flex-grow overflow-y-auto">
				<!-- Card Display -->
				{#if client.display == 'cards'}
					<div class="rounded-lg bg-svelted-gray-700 p-2">
						<div class="w-full">
							<div class="w-full">
								<div class="flex font-bold text-neutral-500">
									<div>
										<div
											class="mb-2 grid h-8 min-w-10 max-w-10 items-center justify-center text-left"
										>
											<Checkbox
												on:click={checkAllCheckboxes}
												checked={items.length == selectedRows.length}
												class="border-[currentcolor]"
											/>
										</div>
									</div>
									<div class="w-full">
										<button
											on:click={() => sortTable('route')}
											class="mb-2 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
										>
											<p>Route</p>
											<CaretUp weight="fill" />
										</button>
									</div>
									<div class="w-full">
										<button
											on:click={() => sortTable('title')}
											class="mb-2 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
										>
											<p>Title</p>
											<CaretUp weight="fill" />
										</button>
									</div>
									<div class="w-full">
										<button
											on:click={() => sortTable('status')}
											class="mb-2 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
										>
											<p>Status</p>
											<CaretUp weight="fill" />
										</button>
									</div>
									<div class="w-full">
										<button
											on:click={() => sortTable('layout')}
											class="mb-2 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
										>
											<p>Layout</p>
											<CaretUp weight="fill" />
										</button>
									</div>
									<div class="w-full">
										<button
											on:click={() => sortTable('author')}
											class="mb-2 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
										>
											<p>Author</p>
											<CaretUp weight="fill" />
										</button>
									</div>
									<div class="w-full">
										<button
											on:click={() => sortTable('modified')}
											class="mb-2 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
										>
											<p>Modified</p>
											<CaretUp weight="fill" />
										</button>
									</div>
									<div class="w-full">
										<button
											on:click={() => sortTable('created')}
											class="mb-2 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
										>
											<p>Created</p>
											<CaretUp weight="fill" />
										</button>
									</div>
								</div>
							</div>
							<div class="grid grid-cols-2 gap-2 text-neutral-500">
								{#each filteredItems as item, index (item)}
									<div
										animate:flip={{ duration: 500 }}
										class="card rounded-md bg-neutral-950 p-2 hover:!bg-[#0a2620] hover:text-neutral-300 hover:outline hover:outline-svelted-primary-700"
									>
										<div class="flex justify-between gap-2 pb-1">
											<div class="flex gap-3">
												<div
													class="grid min-w-[34px] items-center justify-center border-r border-r-neutral-800 !px-1 text-neutral-800"
												>
													<Checkbox
														on:click={checkAllCheckboxes}
														checked={items.length == selectedRows.length}
														class="border-[currentcolor]"
													/>
												</div>
												<Tooltip.Root>
													<Tooltip.Trigger>
														{#if item.status == 'published'}
															<div class="min-h-3 min-w-3 rounded-full bg-svelted-primary-500" />
														{:else if item.status == 'draft'}
															<div class="min-h-3 min-w-3 rounded-full bg-yellow-300" />
														{:else}
															<div class="min-h-3 min-w-3 rounded-full bg-neutral-500" />
														{/if}
													</Tooltip.Trigger>
													<Tooltip.Content
														class="mt-2 border-neutral-800 bg-svelted-gray-700 text-neutral-500"
													>
														<p>{item.status}</p>
													</Tooltip.Content>
												</Tooltip.Root>
												<div class="mb-0.5 py-2">
													{item.title} <span class="text-neutral-800">―</span>
													{item.route}
												</div>
											</div>
											<div>
												<div class="flex w-full gap-2">
													<p class="px-2 py-2">{item.author}</p>
													<button
														on:mouseenter={() => hoverOver(`pages-edit-${index}`)}
														on:mouseleave={() => hoverOver(undefined)}
														class="grid max-h-9 min-w-9 items-center justify-center rounded-sm bg-neutral-800 text-neutral-500 hover:bg-svelted-primary-700 hover:text-neutral-300"
													>
														{#if client.hoverOver == `pages-edit-${index}`}
															<Pen class="h-5 w-5 fill-[currentcolor]" weight="fill" />
														{:else}
															<Pen class="h-5 w-5 fill-[currentcolor]" />
														{/if}
													</button>
													<button
														on:mouseenter={() => hoverOver(`pages-delete-${index}`)}
														on:mouseleave={() => hoverOver(undefined)}
														class="grid max-h-9 min-w-9 items-center justify-center rounded-sm bg-neutral-800 text-neutral-500 hover:bg-red-500 hover:text-white"
													>
														{#if client.hoverOver == `pages-delete-${index}`}
															<Trash class="h-5 w-5 fill-[currentcolor]" weight="fill" />
														{:else}
															<Trash class="h-5 w-5 fill-[currentcolor]" />
														{/if}
													</button>
												</div>
											</div>
										</div>
										<div class="flex flex-col rounded-sm bg-svelted-gray-700 py-2">
											<p>
												<span class="border-r border-r-neutral-800 px-2 py-2"
													>Modified: {formatTime(item.modified)}</span
												>
												<span class="px-2 py-2">Created: {formatTime(item.created)}</span>
											</p>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{:else}
					<!-- Table Display -->
					<div class="rounded-lg bg-svelted-gray-700 px-2">
						<table class="mb-2 w-full pb-1">
							<thead>
								<tr class="text-neutral-500">
									<th>
										<div class="my-1 grid h-8 max-w-10 items-center justify-center text-left">
											<Checkbox
												on:click={checkAllCheckboxes}
												checked={items.length == selectedRows.length}
												class="border-neutral-700"
												id="pages-checkbox"
											/>
										</div>
									</th>
									<th>
										<button
											on:click={() => sortTable('route')}
											class="my-1 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
										>
											<p>Route</p>
											<CaretUp weight="fill" />
										</button>
									</th>
									<th>
										<button
											on:click={() => sortTable('title')}
											class="my-1 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
										>
											<p>Title</p>
											<CaretUp weight="fill" />
										</button>
									</th>
									<th>
										<button
											on:click={() => sortTable('status')}
											class="my-1 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
										>
											<p>Status</p>
											<CaretUp weight="fill" />
										</button>
									</th>
									<th>
										<button
											on:click={() => sortTable('layout')}
											class="my-1 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
										>
											<p>Layout</p>
											<CaretUp weight="fill" />
										</button>
									</th>
									<th>
										<button
											on:click={() => sortTable('author')}
											class="my-1 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
										>
											<p>Author</p>
											<CaretUp weight="fill" />
										</button>
									</th>
									<th>
										<button
											on:click={() => sortTable('modified')}
											class="my-1 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
										>
											<p>Modified</p>
											<CaretUp weight="fill" />
										</button>
									</th>
									<th>
										<button
											on:click={() => sortTable('created')}
											class="my-1 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
										>
											<p>Created</p>
											<CaretUp weight="fill" />
										</button>
									</th>
								</tr>
							</thead>
							<tbody class="text-neutral-500">
								{#each filteredItems as item, index (item)}
									<tr class="hover:!bg-[#0a2620] hover:text-white" animate:flip={{ duration: 500 }}>
										<td class="w-[10px] border-r border-r-neutral-800 !px-3 !py-2">
											<Checkbox
												on:click={() => toggleCheckbox(item.route)}
												checked={selectedRows.includes(item.route)}
												class="border-neutral-800"
											/>
										</td>
										<td class="border-r border-r-neutral-800 px-2 py-2">{item.route}</td>
										<td class="border-r border-r-neutral-800 px-2 py-2">{item.title}</td>
										<td class="border-r border-r-neutral-800 px-2 py-2">{item.status}</td>
										<td class="border-r border-r-neutral-800 px-2 py-2">{item.layout}</td>
										<td class="border-r border-r-neutral-800 px-2 py-2">{item.author}</td>
										<td class="border-r border-r-neutral-800 px-2 py-2"
											>{formatTime(item.modified)}</td
										>
										<td class="border-r-neutral-800 px-2 py-2">{formatTime(item.created)}</td>
										<td class="w-14">
											<div class="flex gap-2">
												<button
													on:mouseenter={() => hoverOver(`pages-edit-${index}`)}
													on:mouseleave={() => hoverOver(undefined)}
													class="rounded-sm bg-neutral-800 p-2 text-neutral-500 hover:bg-svelted-primary-700 hover:text-white"
												>
													{#if client.hoverOver == `pages-edit-${index}`}
														<Pen class="h-5 w-5 fill-[currentcolor]" weight="fill" />
													{:else}
														<Pen class="h-5 w-5 fill-[currentcolor]" />
													{/if}
												</button>
												<button
													on:click={() => deleteModal(item.route, index)}
													on:mouseenter={() => hoverOver(`pages-delete-${index}`)}
													on:mouseleave={() => hoverOver(undefined)}
													class="rounded-sm bg-neutral-800 p-2 text-neutral-500 hover:bg-red-500 hover:text-white"
												>
													{#if client.hoverOver == `pages-delete-${index}`}
														<Trash class="h-5 w-5 fill-[currentcolor]" weight="fill" />
													{:else}
														<Trash class="h-5 w-5 fill-[currentcolor]" />
													{/if}
												</button>
											</div>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>
		</div>
		<div
			class="h-full-editor open flex min-w-64 max-w-64 flex-col justify-between overflow-hidden border-l border-neutral-800 bg-neutral-950 p-2 transition-all"
		>
			<div id="roles" class="flex flex-col gap-3"></div>
			<div>
				<button
					class="btn flex aspect-square h-12 w-full items-center gap-4 rounded-sm bg-[#161616] p-1 px-2 hover:bg-[#278c4c] hover:outline focus:outline-none"
					on:mouseenter={() => hoverOver('users')}
					on:mouseleave={() => hoverOver(undefined)}
					on:click={() => (client.sidebar = !client.sidebar)}
				>
					{#if client.hoverOver == 'users'}
						<UserList class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-200" weight="fill" />
						<p class="text-white">Here could be a guide</p>
					{:else}
						<UserList class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-500" weight="regular" />
						<p class="text-neutral-500">Here could be a guide</p>
					{/if}
				</button>
			</div>
		</div>
	</div>
</Navigation>

<style>
	.card:hover > div div span {
		color: #737373;
	}

	.card:hover > div div {
		color: #737373;
	}

	.btn:focus-within {
		outline: solid 1.5px #36bf68;
		background: #0a2620;
		outline-offset: -1.5px;
	}

	:is(tr:hover > td) {
		border-color: #278c4c !important;
	}

	table tr.spacer:last-of-type td {
		display: none;
	}

	tr td:first-of-type {
		border-top-left-radius: 0.5rem;
		border-bottom-left-radius: 0.5rem;
	}

	tr td:nth-last-of-type(2) {
		border-top-right-radius: 0.5rem;
		border-bottom-right-radius: 0.5rem;
	}

	tr td:nth-last-of-type(1) {
		background: #161616 !important;
		padding-left: 0.5rem;
	}

	table {
		border-spacing: 0 0.25rem;
		border-collapse: separate;
	}

	tbody tr {
		background-color: #161616;
		background-color: #0a0a0a;
	}

	:is(.open .section-description) {
		max-height: 2rem;
		opacity: 1;
	}

	.h-full-editor {
		min-height: calc(100vh - 4rem);
	}

	:is(.closed .section-description, .hide) {
		max-height: 0;
		opacity: 0;
		overflow: hidden;
	}

	:is(.max-h-small-editor) {
		max-height: calc(100vh - 19.6rem) !important;
	}

	.max-h-editor {
		max-height: calc(100vh - 14rem);
	}
</style>
