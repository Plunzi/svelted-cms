<script lang="ts">
	import Navigation from '$svelted/ui/navigation/Navigation.svelte';
	import {
		Blueprint,
		CaretDown,
		CaretUp,
		Check,
		Funnel,
		Pen,
		Plus,
		Tree,
		Rows,
		SquaresFour,
		Trash,
		UserList
	} from 'phosphor-svelte';
	import { writable } from 'svelte/store';
	import formatTime from '$svelted/functions/format/time';
	import getFileIcons from '$svelted/functions/format/fileicon';
	import Checkbox from '$lib/internal/shadcn/ui/checkbox/checkbox.svelte';
	import { Toaster } from '$lib/internal/shadcn/ui/sonner';
	import { toast } from 'svelte-sonner';
	import * as Tooltip from '$lib/internal/shadcn/ui/tooltip';
	import { flip } from 'svelte/animate';
	import AlertDialog from '$svelted/ui/alert-dialog/AlertDialog.svelte';
	import { closeModal, openModal } from '$svelted/ui/alert-dialog/AlertDialogControls.js';

	function getSvgPath(extension: string): string {
    const fileIcons = getFileIcons();
    const svgPath = fileIcons[extension];
    if (!svgPath) {
        return '/file-icons/unknown';
    }
    return svgPath;
}

	export let data;

	let searchTerm = '';

	interface Client {
		sidebar: boolean;
	}

	const hoverOver = function (element: string | undefined) {
		client.hoverOver = element;
	};

	const deleteStackModal = function () {
		currentAction = deleteStack;
		client.modal.title = `Delete <span class="text-svelted-primary-500">${selectedRows.length}</span> ${selectedRows.length == 1 ? 'Layout' : 'Layouts'}?`;
		client.modal.description = `This action cannot be undone. It will permanently delete the specified layouts and remove its associated data from your servers.<br><br>${selectedRows.map(
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

			console.log(deleteRoute, deleteId);

			if (!deleteRoute || (!deleteId && deleteId != 0)) {
				closeModal();
				return;
			}

			toast.loading(`Trying to delete route: ${deleteRoute}`);

			const formData = new FormData();
			formData.append('route', deleteRoute);

			const response = await fetch('/svelted/layouts/delete', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const error = await response.text();
				toast.error(error);
			} else {
				if (client.hoverOver == `layouts-delete-${deleteId}`) {
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
		if ((files.length) == selectedRows.length) {
			selectedRows = [];
		} else {
			selectedRows = files.map((file) => {
				return file.path;
			});
		}
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

	const deleteModal = function (route: string, id: number) {
		currentAction = deleteLayout;
		client.delete.id = id;
		client.delete.route = route;
		client.modal.title = `Confirm Deletion <span class="text-svelted-primary-500">${route}</span> Page?`;
		client.modal.description =
			'This action cannot be undone. It will permanently delete the specified page and remove its associated data from your servers.';
		openModal();
	};

	const deleteMedia = async function () {
		const deleteRoute = client.delete.route;
		const deleteId = client.delete.id;
		// /*

		console.log(deleteRoute, deleteId);

		if (!deleteRoute || (!deleteId && deleteId != 0)) {
			closeModal();
			return;
		}

		toast.loading(`Trying to delete route: ${deleteRoute}`);

		const formData = new FormData();
		// client.isSaving = true;
		// client.savingMessage = 'Loading ...';

		formData.append('route', deleteRoute);

		const response = await fetch('/svelted/layouts/delete', {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			const error = await response.text();
			toast.error(error);
		} else {
			if (client.hoverOver == `layouts-delete-${deleteId}`) {
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

	interface Client {
		hoverOver: undefined | string;
		sidebar: boolean;
		display: string | undefined;
		routeInput: string;
		nameInput: string;
		delete: {
			route: undefined | string;
			id: undefined | number;
		};
		modal: {
			title: undefined | string;
			description: undefined | string;
		};
		dropdowns: {
			status: {
				open: boolean;
				value: string;
			};
			layout: {
				open: boolean;
				value: string;
			};
		};
	}

	let selectedRows: string[] = [];

	let client: Client = {
		hoverOver: undefined,
		sidebar: false,
		display: 'tables',
		routeInput: '',
		nameInput: '',
		delete: {
			route: undefined,
			id: undefined
		},
		modal: {
			title: undefined,
			description: undefined
		},
		dropdowns: {
			status: {
				open: false,
				value: 'draft'
			},
			layout: {
				open: false,
				value: 'none'
			}
		}
	};

	interface Folder {
		path: string
		name: string
	}

	interface File {
		path: string
		name: string
		extension: string
		size: number
		description: string | undefined
	}

	type FilesItem = Folder | File;

	let folders: Folder[] = [
		{
			path: "/public",
			name: "Public",
		},
		{
			path: "/private",
			name: "Private",
		},
		{
			path: "/data",
			name: "Data",
		},
	];

	let files: Files[] = [
		{
			path: "/public/test.png",
			name: "Test.png",
			extension: "png",
			author: "admin",
			size: 1000,
			description: "test image",
			modified: 171844377000,
			created: 1715867971305,
		},
		{
			path: "/private/customer.csv",
			name: "Customer.csv",
			extension: "csv",
			author: "admin",
			size: 1000,
			description: "customer list",
			modified: 171937997100,
			created: 1715867971305,
		},
		{
			path: "/data/layouts/svelted/notfound/layout.json",
			name: "Layout.json",
			extension: "json",
			author: "admin",
			size: 1000,
			description: undefined,
			modified: 172032143200,
			created: 1715867971305,
		},
		{
			path: "/private/example/Navigation.svelte",
			name: "Navigation.svelte",
			extension: "svelte",
			author: "admin",
			size: 1000,
			description: undefined,
			modified: 1715867971305,
			created: 1715867971305,
		},
		{
			path: "/bun.lockb",
			name: "bun.lockb",
			extension: "ps",
			author: "admin",
			size: 1000,
			description: undefined,
			modified: 1715867971305,
			created: 1715867971305,
		},
	];

	let currentAction = deleteMedia;

	const sortKey = writable('name');
	const sortDirection = writable(1);
	const sortItems = writable(files.slice());

	const sortTable = (key) => {
		if ($sortKey === key) {
			sortDirection.update(val => -val);
		} else {
			sortKey.set(key);
			sortDirection.set(1);
		}
	};

	$: {
	const key = $sortKey;
	const direction = $sortDirection;
	sortItems.set(
		files
			.slice()
			.filter((file) =>
				file.name.toLowerCase().includes(searchTerm.toLowerCase())
			)
			.sort((a, b) => {
				switch (key) {
					case 'name':
						return direction * a.name.localeCompare(b.name);
					case 'extension':
						return direction * a.extension.localeCompare(b.extension);
					case 'author':
						return direction * a.author.localeCompare(b.author);
					case 'size':
						return direction * (a.size - b.size);
					case 'created':
						return direction * (a.created - b.created);
					case 'modified':
						return direction * (a.modified - b.modified);
					default:
						break;
				}
				// If contents are the same, maintain relative order
				return 0;
			})
	);
}
</script>

<Navigation overflow={false} site={['Media & Files']} activepage="Media & Files">
	<div class="flex bg-neutral-950">
		<!-- <div class="flex w-full flex-col justify-between p-4">
			<QuickToDo tasks={data.todo.data} />
        </div> -->
		<div class="relative flex w-full flex-col gap-4 px-3 pt-3 text-white">
			<div class="relative flex justify-between gap-2">
				<div class="flex h-10 items-center gap-2 px-2">
					<Blueprint class="mt-0.5 h-6 w-6 fill-neutral-500" weight="regular" />
					<p class="font-medium text-neutral-500">Media</p>
					<p class="text-neutral-500">―</p>
					<p class="text-neutral-500">
						{folders.length} Folders, {files.length} Files 
					</p>
				</div>
				<div class="flex gap-2">
					<button
						class:!bg-neutral-800={client.display == 'tables'}
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
					class:!bg-neutral-800={client.display == 'cards'}
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
					on:mouseenter={() => hoverOver('create-layout')}
					on:mouseleave={() => hoverOver(undefined)}
					class="flex h-10 w-10 items-center justify-center rounded-lg bg-svelted-gray-700 text-neutral-500 hover:bg-svelted-primary-700 hover:text-white"
				>
					{#if client.hoverOver == 'create-layout'}
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
						name="filter-layouts"
						placeholder="Filter Pages ..."
						type="text"
						class="w-full rounded-lg bg-[#161616] px-3 py-2 pl-14 text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#36bf68]"
					/>
				</div>
			</nav>

			<div class="w-full border-b border-b-neutral-800">
				<Toaster class="absolute bottom-2 right-2 !bg-svelted-gray-700" />
				<AlertDialog
					title={client.modal.title}
					description={client.modal.description}
					action={currentAction}
				/>
			</div>

			<div class="max-h-editor flex-grow overflow-y-auto">

				<div class="rounded-lg bg-svelted-gray-700 p-2 mb-3">
				<p>Folder</p>
				{#each folders as folder}
					{folder.name}
				{/each}
			</div>

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
												checked={selectedRows.length === files.length}
												class="border-[currentcolor]"
											/>
										</div>
									</div>
									<div class="w-full">
										<button
											on:click={() => sortTable('name')}
											class="mb-2 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
										>
											<p>Name</p>
											<CaretUp weight="fill" />
										</button>
									</div>
									<div class="w-full">
										<button
											on:click={() => sortTable('extension')}
											class="mb-2 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
										>
											<p>Extension</p>
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
								{#each $sortItems as file, index (file)}
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
													on:click={() => toggleCheckbox(file.path)}
													checked={selectedRows.includes(file.path)}
														class="border-neutral-800"
													/>
												</div>
												<div class="mb-0.5 py-2 flex gap-1">
													<div class="flex gap-2"><img class="w-6 h-6" src={`${getSvgPath(file.extension)}.svg` || "/file-icons/unknown.svg"} alt={"file-icon-preview"}> {file.name}</div> <span class="text-neutral-800">―</span>
													{file.size}
												</div>
											</div>
											<div>
												<div class="flex w-full gap-2">
													<p class="px-2 py-2">{file.extension}</p>
													<a
														href={`/svelted/media${file.path}`}
														on:mouseenter={() => hoverOver(`pages-edit-${index}`)}
														on:mouseleave={() => hoverOver(undefined)}
														class="grid max-h-9 min-w-9 items-center justify-center rounded-sm bg-neutral-800 text-neutral-500 hover:bg-svelted-primary-700 hover:text-neutral-300"
													>
														{#if client.hoverOver == `pages-edit-${index}`}
															<Pen class="h-5 w-5 fill-[currentcolor]" weight="fill" />
														{:else}
															<Pen class="h-5 w-5 fill-[currentcolor]" />
														{/if}
													</a>
													<button
														on:click={() => deleteModal(file.path, index)}
														on:mouseenter={() => hoverOver(`layouts-delete-${index}`)}
														on:mouseleave={() => hoverOver(undefined)}
														class="grid max-h-9 min-w-9 items-center justify-center rounded-sm bg-neutral-800 text-neutral-500 hover:bg-red-500 hover:text-white"
													>
														{#if client.hoverOver == `layouts-delete-${index}`}
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
													>Modified: {formatTime(file.modified)}
												</span>
												<span class="px-2 py-2">
													Created: {formatTime(file.created)}
												</span>
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
												checked={selectedRows.length === files.length}
												class="border-[currentcolor]"
											/>
										</div>
									</th>
									<th>
										<button
											on:click={() => sortTable('name')}
											class="my-1 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
										>
											<p>Name</p>
											<CaretUp weight="fill" />
										</button>
									</th>
									<th>
										<button
											on:click={() => sortTable('extension')}
											class="my-1 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
										>
											<p>Extension</p>
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
								{#each $sortItems as file, index (file)}
									<tr class="hover:!bg-[#0a2620] hover:text-white" animate:flip={{ duration: 500 }}>
										<td class="w-[10px] border-r border-r-neutral-800 !px-3 !py-2">
											<Checkbox
												on:click={() => toggleCheckbox(file.path)}
												checked={selectedRows.includes(file.path)}
												class="border-neutral-800"
											/>
										</td>
										<td class="border-r border-r-neutral-800 px-2 py-2"><div class="flex gap-2"><img class="w-6 h-6" src={`${getSvgPath(file.extension)}.svg` || "/file-icons/unknown.svg"} alt={"file-icon-preview"}> {file.name}</div></td>
										<td class="border-r border-r-neutral-800 px-2 py-2">{file.extension}</td>
										<td class="border-r border-r-neutral-800 px-2 py-2">{file.author}</td>
										<td class="border-r border-r-neutral-800 px-2 py-2">{formatTime(file.modified)}</td>
										<td class="px-2 py-2">{formatTime(file.created)}</td>
										<td class="w-14">
											<div class="flex gap-2">
												<a
													href={`/svelted/media${file.path}`}
													on:mouseenter={() => hoverOver(`pages-edit-${index}`)}
													on:mouseleave={() => hoverOver(undefined)}
													class="rounded-sm bg-neutral-800 p-2 text-neutral-500 hover:bg-svelted-primary-700 hover:text-white"
												>
													{#if client.hoverOver == `pages-edit-${index}`}
														<Pen class="h-5 w-5 fill-[currentcolor]" weight="fill" />
													{:else}
														<Pen class="h-5 w-5 fill-[currentcolor]" />
													{/if}
												</a>
												<button
													on:click={() => deleteModal(file.path, index)}
													on:mouseenter={() => hoverOver(`layouts-delete-${index}`)}
													on:mouseleave={() => hoverOver(undefined)}
													class="rounded-sm bg-neutral-800 p-2 text-neutral-500 hover:bg-red-500 hover:text-white"
												>
													{#if client.hoverOver == `layouts-delete-${index}`}
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
			<p class="text-white">{JSON.stringify(selectedRows)}</p>
			<div>
				<button
					class="btn flex aspect-square h-12 w-full items-center gap-4 rounded-sm bg-[#161616] p-1 px-2 hover:bg-[#278c4c] hover:outline focus:outline-none"
					on:mouseenter={() => hoverOver('users')}
					on:mouseleave={() => hoverOver(undefined)}
					on:click={() => (client.sidebar = !client.sidebar)}
				>
					{#if client.hoverOver == 'users'}
						<Tree class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-200" weight="fill" />
						<p class="text-white">Here will be a folder tree</p>
					{:else}
						<Tree class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-500" weight="regular" />
						<p class="text-neutral-500">Here will be a folder tree</p>
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

	.max-h-editor {
		max-height: calc(100vh - 19.6rem);
	}
</style>
