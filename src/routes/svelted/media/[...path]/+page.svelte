<script lang="ts">
	import Navigation from '$svelted/ui/navigation/Navigation.svelte';
	import {
		Blueprint,
		CaretUp,
		Funnel,
		Pen,
		Plus,
		Tree,
		Rows,
		SquaresFour,
		Trash
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
	import { onMount } from 'svelte';
	import FileTree from '$svelted/ui/file-tree/FileTree.svelte';
	import FileDisplay from '$svelted/ui/file-display/FileDisplay.svelte';

	function getSvgPath(extension: string): string {
		const fileIcons = getFileIcons();
		// const svgPath = false;
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

	const tree = data.media;

	const deleteStackModal = function () {
		currentAction = deleteStack;
		client.modal.title = `Delete <span class="text-svelted-primary-500">${selectedFiles.length}</span> ${selectedFiles.length == 1 ? 'File' : 'Files'}?`;
		client.modal.description = `This action cannot be undone. It will permanently delete the specified files and remove its associated data from your servers.<br><br>Files:<br>${selectedFiles.map(
			(row, index) => {
				return `${index == 0 ? '' : '<br>'}${row}`;
			}
		)}`;
		if (client.modal.description != '') {
			client.modal.description += '<br><br>';
		}
		client.modal.description += 'Folders:<br>';
		client.modal.description += `${selectedFolders.map((row, index) => {
			return `${index == 0 ? '' : '<br>'}${row}`;
		})}`;
		openModal();
	};

	const deleteStack = async function () {
		selectedFiles.map(async (entry) => {
			const deleteRoute = (client.delete.route = entry);
			const deleteId = files.findIndex((file) => file.path === entry);

			console.log(deleteRoute, deleteId);

			// if (!deleteRoute || (!deleteId && deleteId != 0)) {
			// 	closeModal();
			// 	return;
			// }

			// toast.loading(`Trying to delete route: ${deleteRoute}`);

			// const formData = new FormData();
			// formData.append('route', deleteRoute);

			// const response = await fetch('/svelted/layouts/delete', {
			// 	method: 'POST',
			// 	body: formData
			// });

			// if (!response.ok) {
			// 	const error = await response.text();
			// 	toast.error(error);
			// } else {
			// 	if (client.hoverOver == `layouts-delete-${deleteId}`) {
			// 		hoverOver(undefined);
			// 	}

			// 	const indexToRemove = items.findIndex((item) => item.route === deleteRoute);
			// 	if (indexToRemove !== -1) {
			// 		items.splice(indexToRemove, 1);
			// 		sortItems.set(items.slice());
			// 	}

			// 	let result = await response.text();
			// 	toast.success(result);
			// }
		});

		selectedFolders.map(async (entry) => {
			const deleteRoute = (client.delete.route = entry);
			const deleteId = folders.findIndex((folder) => folder.path === entry);

			console.log(deleteRoute, deleteId);
		});
		closeModal();
	};

	const checkAllFiles = function () {
		if (files.length == selectedFiles.length) {
			selectedFiles = [];
		} else {
			selectedFiles = files.map((file) => {
				return file.path;
			});
		}
	};

	const checkAllFolders = function () {
		if (folders.length == selectedFolders.length) {
			selectedFolders = [];
		} else {
			selectedFolders = folders.map((folder) => {
				return folder.path;
			});
		}
	};

	const toggleCheckboxFiles = function (input: string) {
		if (selectedFiles.includes(input)) {
			selectedFiles = selectedFiles.filter((route) => route !== input);
			selectedFiles = selectedFiles;
		} else {
			selectedFiles.push(input);
			selectedFiles = selectedFiles;
		}
	};

	const toggleCheckboxFolders = function (input: string) {
		if (selectedFolders.includes(input)) {
			selectedFolders = selectedFolders.filter((route) => route !== input);
			selectedFolders = selectedFolders;
		} else {
			selectedFolders.push(input);
			selectedFolders = selectedFolders;
		}
	};

	const deleteFile = async function () {};

	const deleteModal = function (route: string, id: number) {
		currentAction = deleteFile;
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

	let selectedFiles: string[] = [];
	let selectedFolders: string[] = [];

	let client: Client = {
		hoverOver: undefined,
		sidebar: true,
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
		path: string;
		name: string;
	}

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

	type FilesItem = Folder | File;

	let folders: Folder[] = data.folders || [];

	let files: File[] = data.files || [];

	let currentAction = deleteMedia;

	const sortKey = writable('name');
	const sortDirection = writable(1);
	const sortItems = writable(files.slice());

	const sortTable = (key: any) => {
		if ($sortKey === key) {
			sortDirection.update((val) => -val);
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
				.filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
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
		<div
			class="h-full-editor relative flex w-full flex-col gap-4 px-3 pt-3 text-white"
			style={client.sidebar ? 'width: calc(100vw - 20rem);' : 'width: 100%;'}
		>
			<div class="relative flex justify-between gap-2">
				<div class="flex h-10 items-center gap-2 px-2">
					<Blueprint class="mt-0.5 h-6 w-6 fill-neutral-500" weight="regular" />
					<p class="font-medium text-neutral-500">Media</p>
					<p class="text-neutral-500">―</p>
					<p class="text-neutral-500">
						{folders.length} Folders, {files.length} Files, "{data.status}" Status
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
					{#if client.sidebar === false}
						<button
							class:!bg-neutral-800={client.display == 'cards'}
							on:click={() => (client.sidebar = !client.sidebar)}
							on:mouseenter={() => hoverOver('show-sidebar')}
							on:mouseleave={() => hoverOver(undefined)}
							class="flex h-10 w-10 items-center justify-center rounded-lg bg-svelted-gray-700 text-neutral-500 hover:bg-svelted-primary-500 hover:text-white"
						>
							{#if client.hoverOver == 'show-sidebar'}
								<Tree class="h-5 w-5 fill-[currentcolors]" weight="fill" />
							{:else}
								<Tree class="h-5 w-5 fill-[currentcolors]" />
							{/if}
						</button>
					{/if}
				</div>
			</div>
			{#if data.success == 'success'}
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
							placeholder="Filter Assets ..."
							type="text"
							class="w-full rounded-lg bg-[#161616] px-3 py-2 pl-14 text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#36bf68]"
						/>
					</div>
				</nav>
			{/if}

			<div class="w-full border-b border-b-neutral-800">
				<Toaster class="absolute bottom-2 right-2 !bg-svelted-gray-700" />
				<AlertDialog
					title={client.modal.title}
					description={client.modal.description}
					action={currentAction}
				/>
			</div>

			<div class="max-h-editor flex flex-grow flex-col overflow-y-auto">
				{#if data.status == 'success'}
					{#if folders.length > 0}
						<div class="mb-3 rounded-lg bg-svelted-gray-700 px-2 pt-1">
							<div class="flex flex-col gap-1">
								<table class="w-full pb-1">
									<thead>
										<tr class="text-neutral-500">
											<th>
												<div class="my-1 grid h-8 max-w-10 items-center justify-center text-left">
													<Checkbox
														on:click={checkAllFolders}
														checked={selectedFolders.length === folders.length}
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
										</tr>
									</thead>
									<tbody class="text-neutral-500">
										{#each folders as folder, index (folder)}
											<tr
												class="hover:!bg-[#0a2620] hover:text-white"
												animate:flip={{ duration: 500 }}
											>
												<td class="w-[10px] border-r border-r-neutral-800 !px-3 !py-2">
													<Checkbox
														on:click={() => toggleCheckboxFolders(folder.path)}
														checked={selectedFolders.includes(folder.path)}
														class="border-neutral-800"
													/>
												</td>
												<td class="!p-0 px-2">
													<a
														href={`/svelted/media${folder.path}`}
														data-sveltekit-replacestate="true"
														data-sveltekit-reload="true"
														class="flex h-10 w-full items-center px-2"
													>
														<div class="flex gap-2">
															<img
																class="h-6 w-6"
																src={'/file-icons/folder_dark.svg'}
																alt={'file-icon-preview'}
															/>
															{folder.name}<span class="text-neutral-700"> ― {folder.path}</span>
														</div>
													</a>
												</td>
												<td class="w-14">
													<div class="flex gap-2">
														<a
															href={`/svelted/media${folder.path}`}
															data-sveltekit-replacestate="true"
															data-sveltekit-reload="true"
															on:mouseenter={() => hoverOver(`folder-edit-${index}`)}
															on:mouseleave={() => hoverOver(undefined)}
															class="rounded-sm bg-neutral-800 p-2 text-neutral-500 hover:bg-svelted-primary-700 hover:text-white"
														>
															{#if client.hoverOver == `folder-edit-${index}`}
																<Pen class="h-5 w-5 fill-[currentcolor]" weight="fill" />
															{:else}
																<Pen class="h-5 w-5 fill-[currentcolor]" />
															{/if}
														</a>
														<button
															on:click={() => deleteModal(folder.path, index)}
															on:mouseenter={() => hoverOver(`folder-delete-${index}`)}
															on:mouseleave={() => hoverOver(undefined)}
															class="rounded-sm bg-neutral-800 p-2 text-neutral-500 hover:bg-red-500 hover:text-white"
														>
															{#if client.hoverOver == `folder-delete-${index}`}
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
						</div>
					{/if}

					{#if files.length > 0}
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
														on:click={checkAllFiles}
														checked={selectedFiles.length === files.length}
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
																on:click={() => toggleCheckboxFiles(file.path)}
																checked={selectedFiles.includes(file.path)}
																class="border-neutral-800"
															/>
														</div>
														<div class="mb-0.5 flex gap-1 py-2">
															<div class="flex gap-2">
																<img
																	class="min-h-6 min-w-6"
																	src={`${getSvgPath(file.extension)}.svg` ||
																		'/file-icons/unknown.svg'}
																	alt={'file-icon-preview'}
																/>
																{file.name}
															</div>
															<span class="text-neutral-800">―</span>
															{file.size}
														</div>
													</div>
													<div>
														<div class="flex w-full gap-2">
															<p class="px-2 py-2">{file.extension}</p>
															<a
																href={`/svelted/media${file.path}`}
																data-sveltekit-replacestate="true"
																data-sveltekit-reload="true"
																on:mouseenter={() => hoverOver(`file-edit-${index}`)}
																on:mouseleave={() => hoverOver(undefined)}
																class="grid max-h-9 min-w-9 items-center justify-center rounded-sm bg-neutral-800 text-neutral-500 hover:bg-svelted-primary-700 hover:text-neutral-300"
															>
																{#if client.hoverOver == `file-edit-${index}`}
																	<Pen class="h-5 w-5 fill-[currentcolor]" weight="fill" />
																{:else}
																	<Pen class="h-5 w-5 fill-[currentcolor]" />
																{/if}
															</a>
															<button
																on:click={() => deleteModal(file.name, index)}
																on:mouseenter={() => hoverOver(`file-delete-${index}`)}
																on:mouseleave={() => hoverOver(undefined)}
																class="grid max-h-9 min-w-9 items-center justify-center rounded-sm bg-neutral-800 text-neutral-500 hover:bg-red-500 hover:text-white"
															>
																{#if client.hoverOver == `file-delete-${index}`}
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
														on:click={checkAllFiles}
														checked={selectedFiles.length === files.length}
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
											<tr
												class="tr hover:!bg-[#0a2620] hover:text-white"
												animate:flip={{ duration: 500 }}
											>
												<td class="w-[10px] border-r border-r-neutral-800 !px-3 !py-2">
													<Checkbox
														on:click={() => toggleCheckboxFiles(file.path)}
														checked={selectedFiles.includes(file.path)}
														class="border-neutral-800"
													/>
												</td>
												<td class="border-r border-r-neutral-800 !p-0 px-2 py-2">
													<a
														href={`/svelted/media${file.path}`}
														data-sveltekit-replacestate="true"
														data-sveltekit-reload="true"
														class="flex h-10 w-full items-center px-2"
													>
														<div class="flex gap-2">
															<img
																class="h-6 w-6"
																src={`${getSvgPath(file.extension)}.svg` ||
																	'/file-icons/unknown.svg'}
																alt={'file-icon-preview'}
															/>
															{file.name}
														</div>
													</a>
												</td>
												<td class="border-r border-r-neutral-800 !p-0 px-2 py-2">
													<a
														href={`/svelted/media${file.path}`}
														data-sveltekit-replacestate="true"
														data-sveltekit-reload="true"
														class="flex h-10 w-full items-center px-2"
													>
														{file.extension}
													</a>
												</td>
												<td class="border-r border-r-neutral-800 !p-0 px-2 py-2">
													<a
														href={`/svelted/media${file.path}`}
														data-sveltekit-replacestate="true"
														data-sveltekit-reload="true"
														class="flex h-10 w-full items-center px-2"
													>
														{file.author}
													</a>
												</td>
												<td class="border-r border-r-neutral-800 !p-0 px-2 py-2">
													<a
														href={`/svelted/media${file.path}`}
														data-sveltekit-replacestate="true"
														data-sveltekit-reload="true"
														class="flex h-10 w-full items-center px-2"
													>
														{formatTime(file.modified)}
													</a>
												</td>
												<td class="p-0">
													<a
														href={`/svelted/media${file.path}`}
														data-sveltekit-replacestate="true"
														data-sveltekit-reload="true"
														class="flex h-10 w-full items-center px-2"
													>
														{formatTime(file.created)}
													</a>
												</td>
												<td class="w-14">
													<div class="flex gap-2">
														<a
															href={`/svelted/media${file.path}`}
															data-sveltekit-replacestate="true"
															data-sveltekit-reload="true"
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
															on:click={() => deleteModal(file.name, index)}
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
					{/if}
				{:else if data.status == 'file'}
					<!-- Table Display -->
					<div class="rounded-lg bg-svelted-gray-700 px-2 pt-1">
						<table class="mb-2 w-full !border-spacing-0 pt-1">
							<thead class="text-left text-neutral-500">
								<th></th>
								<th class="pl-2">Name</th>
								<th class="pl-2">Extension</th>
								<th class="pl-2">Author</th>
								<th class="pl-2">Modified</th>
								<th class="pl-2">Created</th>
							</thead>
							<tbody class="text-neutral-500">
								{#each $sortItems as file, index (file)}
									<tr>
										<td class="w-[10px] border-r border-r-neutral-800 !px-3 !py-2">
											<Checkbox
												on:click={() => toggleCheckboxFiles(file.path)}
												checked={selectedFiles.includes(file.path)}
												class="border-neutral-800"
											/>
										</td>
										<td class="border-r border-r-neutral-800 !p-0 px-2 py-2">
											<div
												data-sveltekit-replacestate="true"
												data-sveltekit-reload="true"
												class="flex h-10 w-full items-center px-2"
											>
												<div class="flex gap-2">
													<img
														class="h-6 w-6"
														src={`${getSvgPath(file.extension)}.svg` || '/file-icons/unknown.svg'}
														alt={'file-icon-preview'}
													/>
													{file.name}
												</div>
											</div>
										</td>
										<td class="border-r border-r-neutral-800 !p-0 px-2 py-2">
											<span
												data-sveltekit-replacestate="true"
												data-sveltekit-reload="true"
												class="flex h-10 w-full items-center px-2"
											>
												{file.extension}
											</span>
										</td>
										<td class="border-r border-r-neutral-800 !p-0 px-2 py-2">
											<span
												data-sveltekit-replacestate="true"
												data-sveltekit-reload="true"
												class="flex h-10 w-full items-center px-2"
											>
												{file.author}
											</span>
										</td>
										<td class="border-r border-r-neutral-800 !p-0 px-2 py-2">
											<span
												data-sveltekit-replacestate="true"
												data-sveltekit-reload="true"
												class="flex h-10 w-full items-center px-2"
											>
												{formatTime(file.modified)}
											</span>
										</td>
										<td class="p-0">
											<span
												data-sveltekit-replacestate="true"
												data-sveltekit-reload="true"
												class="flex h-10 w-full items-center px-2"
											>
												{formatTime(file.created)}
											</span>
										</td>
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
													on:click={() => deleteModal(file.name, index)}
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
					<FileDisplay file={files[0]} />
				{:else}
					<p>Error: {data.status}</p>
				{/if}
			</div>
		</div>
		{#if client.sidebar}
			<div
				class="h-full-editor open flex min-w-64 max-w-64 flex-col gap-2 overflow-hidden border-l border-neutral-800 bg-neutral-950 p-2 transition-all"
			>
				<div>
					<button
						class="btn flex aspect-square h-12 w-full items-center gap-4 rounded-sm bg-[#161616] p-1 px-2 hover:bg-[#278c4c] focus:outline-none"
						on:mouseenter={() => hoverOver('users')}
						on:mouseleave={() => hoverOver(undefined)}
						on:click={() => (client.sidebar = !client.sidebar)}
					>
						{#if client.hoverOver == 'users'}
							<Tree class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-200" weight="fill" />
							<p class="text-white">Files Tree</p>
						{:else}
							<Tree class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-500" weight="regular" />
							<p class="text-neutral-500">Files Tree</p>
						{/if}
					</button>
				</div>
				<div class="overflow-y-auto overflow-x-hidden">
					<!-- <p class="text-white">{JSON.stringify(selectedFiles)}</p> -->
					<FileTree {tree} treeRoute="/svelted/media" />
				</div>
			</div>
		{/if}
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

	:is(.tr:hover > td) {
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
		max-height: calc(100vh - 4rem);
	}

	:is(.closed .section-description, .hide) {
		max-height: 0;
		opacity: 0;
		overflow: hidden;
	}

	.max-h-editor {
		max-height: calc(100vh - 4rem);
		/* max-height: calc(100vh - 19.6rem); */
	}
</style>
