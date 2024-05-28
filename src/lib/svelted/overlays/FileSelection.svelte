<script lang="ts" defer>
	import { browser } from '$app/environment';
	import {
		Blueprint,
		CaretUp,
		Funnel,
		Pen,
		Plus,
		Rows,
		SquaresFour,
		Star,
		Trash,
		Tree,
		X
	} from 'phosphor-svelte';
	import { Toaster } from 'svelte-sonner';
	import formatTime from '$svelted/functions/format/time';
	import AlertDialog from './AlertDialog.svelte';
	import Checkbox from '$lib/internal/shadcn/ui/checkbox/checkbox.svelte';
	import { writable } from 'svelte/store';
	import { flip } from 'svelte/animate';
	import getFileIcons from '$svelted/functions/format/fileicon';

	type CurrentFile = string | undefined;

	const hoverOver = function (element: string | undefined) {
		client.hoverOver = element;
	};

	const selectFile = function (input: string) {
		currentFile = input;
		closeModal();
	};

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

	const sortTable = (key: string) => {
		if ($sortKey === key) {
			sortDirection.update((val: any) => -val);
		} else {
			sortKey.set(key);
			sortDirection.set(1);
		}
	};

	let folders: Folder[] = [
		{
			path: '/public',
			name: 'Public'
		},
		{
			path: '/private',
			name: 'Private'
		},
		{
			path: '/data',
			name: 'Data'
		}
	];

	let files: File[] = [
		{
			path: '/private/test%20assets/Chromabit%20-%20knko%20&%20plunzi%20(high%20quality%20ver.).wav',
			name: 'Chromabit - knko & plunzi (high quality ver.).wav',
			extension: 'wav',
			author: 'admin',
			size: 1000,
			description: 'test music',
			modified: 171844377000,
			created: 1715867971305
		},
		{
			path: '/private/test%20assets/excel.csv',
			name: 'excel.csv',
			extension: 'csv',
			author: 'admin',
			size: 1000,
			description: 'example list',
			modified: 171937997100,
			created: 1715867971305
		},
		{
			path: '/soon/Layout.json',
			name: 'Layout.json',
			extension: 'json',
			author: 'admin',
			size: 1000,
			description: undefined,
			modified: 172032143200,
			created: 1715867971305
		},
		{
			path: '/private/test%20assets/logo_animation.mp4',
			name: 'logo_animation.mp4',
			extension: 'mp4',
			author: 'admin',
			size: 1000,
			description: undefined,
			modified: 172032143200,
			created: 1715867971305
		},
		{
			path: '/soon/Navigation.svelte',
			name: 'Navigation.svelte',
			extension: 'svelte',
			author: 'admin',
			size: 1000,
			description: undefined,
			modified: 1715867971305,
			created: 1715867971305
		},
		{
			path: '/private/test%20assets/svelte.svg',
			name: 'svelte.svg',
			extension: 'svg',
			author: 'admin',
			size: 1000,
			description: undefined,
			modified: 1715867971305,
			created: 1715867971305
		}
	];

	const toggleCheckboxFiles = function (input: string) {
		if (selectedFiles.includes(input)) {
			selectedFiles = selectedFiles.filter((route) => route !== input);
			selectedFiles = selectedFiles;
		} else {
			selectedFiles.push(input);
			selectedFiles = selectedFiles;
		}
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

	export const closeModal = () => {
		if (!browser) {
			return;
		}

		try {
			const popupContainer = document.getElementById('popup-modal')!;
			const popupHelper = document.getElementById('popup-modal-helper')!;
			popupContainer.style.opacity = '0';
			popupHelper.style.transform = 'scale(0.9)';
			display = false;

			setTimeout(() => {
				popupContainer.style.display = 'none';
			}, 250);
		} catch (error) {}
	};

	export const openModal = () => {
		if (!browser) {
			return;
		}

		try {
			const popupContainer = document.getElementById('popup-modal')!;
			const popupHelper = document.getElementById('popup-modal-helper')!;

			popupContainer.style.display = 'grid';
			setTimeout(() => {
				popupContainer.style.opacity = '1';
				popupHelper.style.transform = 'scale(1)';
			}, 1);
		} catch (error) {
			return;
		}
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

	let currentAction = () => {};
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

	const fileIcons = getFileIcons();

	function getSvgPath(extension: string): string {
		const svgPath = fileIcons[extension];
		if (!svgPath) {
			return '/file-icons/unknown';
		}
		return svgPath;
	}

    const handleKeydown = async (e: KeyboardEvent) => {
        if (e.key == "Escape") {
            closeModal();
        }
    }

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

	let searchTerm = '';

	export let display = false;
	export let currentFile: CurrentFile = undefined;

	export let action;
	export let title: string = 'Are you absolutely sure?';
	const sortKey = writable('name');
	const sortDirection = writable(1);
	const sortItems = writable(files.slice());

	$: display ? openModal() : closeModal();

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

<svelte:window on:keydown={handleKeydown}></svelte:window>

<div
	id="popup-modal"
	class="popup-modal absolute bottom-0 left-0 right-0 top-0 z-10 grid p-32 opacity-0"
>
	<div
		id="popup-modal-helper"
		class="relative mx-auto my-auto flex min-h-48 w-full flex-col rounded-lg border border-neutral-800 bg-neutral-950 py-4 shadow-lg transition-transform"
	>
		<div
			class="relative flex min-h-[4.5rem] w-full items-center gap-2 border-b border-neutral-800 px-4"
		>
			<div
				class="absolute right-20 top-1 z-10 flex w-fit rounded-full border border-neutral-800 bg-neutral-950 px-1 py-1 text-neutral-500 shadow-lg"
			>
				<button
					on:mouseenter={() => hoverOver('display-tables')}
					on:mouseleave={() => hoverOver(undefined)}
					on:click={() => (client.display = 'tables')}
					class="grid h-10 w-10 items-center justify-center rounded-full hover:bg-svelted-gray-700 hover:text-white"
					class:bg-svelted-gray-700={client.display == 'tables'}
				>
					{#if client.hoverOver == 'display-tables' || client.display == 'tables'}
						<Rows class="h-5 w-5 fill-[currentcolors]" weight="fill" />
					{:else}
						<Rows class="h-5 w-5 fill-[currentcolors]" />
					{/if}
				</button>
				<button
					on:mouseenter={() => hoverOver('display-cards')}
					on:mouseleave={() => hoverOver(undefined)}
					on:click={() => (client.display = 'cards')}
					class="grid h-10 w-10 items-center justify-center rounded-full hover:bg-svelted-gray-700 hover:text-white"
					class:bg-svelted-gray-700={client.display == 'cards'}
				>
					{#if client.hoverOver == 'display-cards' || client.display == 'cards'}
						<SquaresFour class="h-5 min-w-5 fill-[currentcolors]" weight="fill" />
					{:else}
						<SquaresFour class="h-5 min-w-5 fill-[currentcolors]" />
					{/if}
				</button>
			</div>
			<div
				class="absolute right-5 top-1 z-10 flex w-fit rounded-full border border-neutral-800 bg-neutral-950 px-1 py-1 text-neutral-500 shadow-lg"
			>
				<button
					on:mouseenter={() => hoverOver('tool-exit')}
					on:mouseleave={() => hoverOver(undefined)}
					on:click={() => close()}
					class="grid h-10 w-10 items-center justify-center rounded-full hover:bg-svelted-gray-700 hover:text-white"
				>
					{#if client.hoverOver == 'tool-exit'}
						<X class="h-5 min-w-5 fill-[currentcolors]" weight="bold" />
					{:else}
						<X class="h-5 min-w-5 fill-[currentcolors]" />
					{/if}
				</button>
			</div>
			<div>
				<h1 class="text-lg font-semibold text-neutral-200">
					{title}
				</h1>
			</div>
			<p class="flex items-center gap-1">
				<a
					href={`/svelted/media/`}
					class="rounded-sm px-2 py-0.5 text-neutral-500 hover:bg-svelted-gray-700 hover:text-svelted-primary-500"
				>
					<span>media</span>
				</a>
			</p>
		</div>
		<div class="flex bg-neutral-950">
			<!-- <div class="flex w-full flex-col justify-between p-4">
                <QuickToDo tasks={data.todo.data} />
            </div> -->
			<div class="h-full-editor relative flex w-full flex-col px-3 pt-3 text-white">
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
							placeholder="Search Files ..."
							type="text"
							class="w-full rounded-lg bg-[#161616] px-3 py-2 pl-14 text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#36bf68]"
						/>
					</div>
				</nav>

				<div class="mt-4 w-full border-b border-b-neutral-800">
					<Toaster class="absolute bottom-2 right-2 !bg-svelted-gray-700" />
					<!-- <AlertDialog
						title={client.modal.title}
						description={client.modal.description}
						action={currentAction}
					/> -->
				</div>

				<div class="max-h-[25rem] flex-grow overflow-y-auto pt-4">
					<div class="mb-3 rounded-lg bg-svelted-gray-700 px-2 pt-1">
						<div class="flex flex-col gap-1">
							<table class="w-full pb-1">
								<tbody class="text-neutral-500">
									{#each folders as folder, index (folder)}
										<tr
											class="hover:!bg-[#0a2620] hover:text-white"
											animate:flip={{ duration: 500 }}
										>
											<td class="!p-0 px-2">
												<a
													href={`selectFile(file.path)${folder.path}`}
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
													<button
														on:click={() => selectFile(folder.path)}
														on:mouseenter={() => hoverOver(`folder-edit-${index}`)}
														on:mouseleave={() => hoverOver(undefined)}
														class="rounded-sm bg-neutral-800 p-2 text-neutral-500 hover:bg-svelted-primary-700 hover:text-white"
													>
														{#if client.hoverOver == `folder-edit-${index}`}
															<Pen class="h-5 w-5 fill-[currentcolor]" weight="fill" />
														{:else}
															<Pen class="h-5 w-5 fill-[currentcolor]" />
														{/if}
													</button>
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

					<!-- Card Display -->
					{#if client.display == 'cards'}
						<div class="rounded-lg bg-svelted-gray-700 p-2 pb-2 pt-1">
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
														<button
															on:click={() => selectFile(`${file.path}`)}
															on:mouseenter={() => hoverOver(`file-edit-${index}`)}
															on:mouseleave={() => hoverOver(undefined)}
															class="grid max-h-9 min-w-9 items-center justify-center rounded-sm bg-neutral-800 text-neutral-500 hover:bg-svelted-primary-700 hover:text-neutral-300"
														>
															{#if client.hoverOver == `file-edit-${index}`}
																<Pen class="h-5 w-5 fill-[currentcolor]" weight="fill" />
															{:else}
																<Pen class="h-5 w-5 fill-[currentcolor]" />
															{/if}
														</button>
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
											class="hover:!bg-[#0a2620] hover:text-white"
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
												<button
													on:click={() => selectFile(`${file.path}`)}
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
												</button>
											</td>
											<td class="border-r border-r-neutral-800 !p-0 px-2 py-2">
												<button
													on:click={() => selectFile(`${file.path}`)}
													class="flex h-10 w-full items-center px-2"
												>
													{file.extension}
												</button>
											</td>
											<td class="border-r border-r-neutral-800 !p-0 px-2 py-2">
												<button
													on:click={() => selectFile(`${file.path}`)}
													class="flex h-10 w-full items-center px-2"
												>
													{file.author}
												</button>
											</td>
											<td class="border-r border-r-neutral-800 !p-0 px-2 py-2">
												<button
													on:click={() => selectFile(`${file.path}`)}
													class="flex h-10 w-full items-center px-2"
												>
													{formatTime(file.modified)}
												</button>
											</td>
											<td class="p-0">
												<button
													on:click={() => selectFile(`${file.path}`)}
													class="flex h-10 w-full items-center px-2"
												>
													{formatTime(file.created)}
												</button>
											</td>
											<td class="w-14">
												<div class="flex gap-2">
													<a
														href={`${file.path}`}
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
									{#each $sortItems as file, index (file)}
										<tr
											class="hover:!bg-[#0a2620] hover:text-white"
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
												<button
													on:click={() => selectFile(`${file.path}`)}
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
												</button>
											</td>
											<td class="border-r border-r-neutral-800 !p-0 px-2 py-2">
												<button
													on:click={() => selectFile(`${file.path}`)}
													class="flex h-10 w-full items-center px-2"
												>
													{file.extension}
												</button>
											</td>
											<td class="border-r border-r-neutral-800 !p-0 px-2 py-2">
												<button
													on:click={() => selectFile(`${file.path}`)}
													class="flex h-10 w-full items-center px-2"
												>
													{file.author}
												</button>
											</td>
											<td class="border-r border-r-neutral-800 !p-0 px-2 py-2">
												<button
													on:click={() => selectFile(`${file.path}`)}
													class="flex h-10 w-full items-center px-2"
												>
													{formatTime(file.modified)}
												</button>
											</td>
											<td class="p-0">
												<button
													on:click={() => selectFile(`${file.path}`)}
													class="flex h-10 w-full items-center px-2"
												>
													{formatTime(file.created)}
												</button>
											</td>
											<td class="w-14">
												<div class="flex gap-2">
													<a
														href={`${file.path}`}
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
				</div>
			</div>
			<!-- {#if client.sidebar}
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
						{#if tree}
							<FileTree {tree} treeRoute="/svelted/media" />
						{/if}
					</div>
				</div>
			{/if} -->
		</div>
	</div>
</div>

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

	#popup-modal {
		transition: ease 0.35s;
		backdrop-filter: blur(2px);
		background: hsla(0, 0%, 0%, 0.5);
	}

	#popup-modal-helper {
		transition: ease 0.35s;
		transform: scale(0.9);
	}
</style>
