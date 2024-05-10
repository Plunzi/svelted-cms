<script lang="ts">
	import Navigation from '$lib/internal/svelted-core/ui/Navigation.svelte';
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
	import formatTime from '$lib/internal/svelted-core/format/time';
	import Checkbox from '$lib/internal/svelted-core/ui/checkbox/checkbox.svelte';
	import * as Tooltip from '$lib/internal/svelted-core/ui/tooltip';
	import { flip } from 'svelte/animate';

	export let data;

	let searchTerm = '';

	interface Client {
		sidebar: boolean;
	}

	const hoverOver = function (element: string | undefined) {
		client.hoverOver = element;
	};

	const createLayout = async function () {
		const formData = new FormData();
		// client.isSaving = true;
		// client.savingMessage = 'Loading ...';

		formData.append('route', client.routeInput);
		formData.append('name', client.nameInput);

		const response = await fetch('/svelted/layouts/create', {
			method: 'POST',
			body: formData
		});

		// client.isSaving = false;
		// client.savingMessage = 'Save changes';

		let result = await response.json();
		result.route = result.description.route;
		result.content = undefined;

		items.push(result);
		sortItems.set(items.slice());

		client.nameInput = '';
		client.routeInput = '';
	};

	interface Client {
		hoverOver: undefined | string;
		sidebar: boolean;
		display: string | undefined;
		routeInput: string;
		nameInput: string;
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

	let client: Client = {
		hoverOver: undefined,
		sidebar: false,
		display: 'table',
		routeInput: '',
		nameInput: '',
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

	let items = data.layouts || [];

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

	$: {
		const key = $sortKey;
		const direction = $sortDirection;
		const sorted = [...$sortItems].sort((a, b) => {
			const aVal = a.description[key];
			const bVal = b.description[key];
			if (aVal < bVal) {
				return -direction;
			} else if (aVal > bVal) {
				return direction;
			}
			return 0;
		});
		sortItems.set(sorted);
	}

	$: filteredItems = $sortItems.filter(
		(item) => item.description.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
	);
</script>

<Navigation overflow={false} site={['Layouts']} activepage="Layouts">
	<div class="flex bg-neutral-950">
		<!-- <div class="flex w-full flex-col justify-between p-4">
			<QuickToDo tasks={data.todo.data} />
        </div> -->
		<div class="flex w-full flex-col gap-4 p-3 text-white">
			<div class="flex justify-between gap-2">
				<div class="flex h-10 items-center gap-2 px-2">
					<Blueprint class="mt-0.5 h-6 w-6 fill-neutral-500" weight="regular" />
					<p class="font-medium text-neutral-500">Layouts Overview</p>
					<p class="text-neutral-500">―</p>
					<p class="text-neutral-500">
						{items.length} Layouts
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
						placeholder="Filter Pages ..."
						type="text"
						class="w-full rounded-lg bg-[#161616] px-3 py-2 pl-14 text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#36bf68]"
					/>
				</div>
			</nav>

			<hr class="border-neutral-800" />

			<div class="flex justify-between rounded-lg bg-svelted-gray-700 p-2">
				<div class="mt-5 flex">
					<div class="relative w-full">
						<label
							for="enter-layout-locatiom"
							class="absolute -top-3.5 w-fit -translate-y-2.5 whitespace-nowrap pl-1.5 pr-1.5 text-sm text-neutral-500"
						>
							Save Location
						</label>
						<input
							bind:value={client.routeInput}
							id="enter-layout-locatiom"
							class="relative h-10 w-full rounded-l-md border-r border-r-neutral-800 bg-neutral-950 p-2 focus:z-30"
							placeholder="e.g. /contact"
						/>
					</div>
					<div class="relative w-full">
						<label
							for="enter-layout-name"
							class="absolute -top-3.5 w-fit -translate-y-2.5 whitespace-nowrap pl-1.5 pr-1.5 text-sm text-neutral-500"
						>
							Layout Name
						</label>

						<input
							bind:value={client.nameInput}
							id="enter-layout-name"
							class="relative h-10 w-full rounded-r-md bg-neutral-950 p-2 focus:z-10"
							placeholder="e.g. Contact"
						/>
					</div>
				</div>
				<div class="flex">
					<button
						on:click={createLayout}
						class="mt-auto flex max-h-10 min-h-10 items-center gap-2 rounded-sm bg-neutral-800 pl-3 pr-5 text-neutral-500 hover:bg-svelted-primary-700 hover:text-white"
					>
						<Plus class="h-5 w-5 fill-[currentcolor]" />
						<span class="whitespace-nowrap">Create Layout</span>
					</button>
				</div>
			</div>

			<hr class="border-neutral-800" />

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
										<Checkbox class="border-neutral-700" id="pages-checkbox" />
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
										on:click={() => sortTable('name')}
										class="mb-2 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
									>
										<p>Name</p>
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
												<Checkbox class="border-[currentcolor]" />
											</div>
											<div class="mb-0.5 py-2">
												{item.description.name} <span class="text-neutral-800">―</span>
												{item.route}
											</div>
										</div>
										<div>
											<div class="flex w-full gap-2">
												<p class="px-2 py-2">{item.description.author}</p>
												<a
													href={`/svelted/editor?currentpage=${item.description.route}`}
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
												<a
													href={`/svelted/editor?currentpage=${item.description.route}`}
													on:mouseenter={() => hoverOver(`pages-delete-${index}`)}
													on:mouseleave={() => hoverOver(undefined)}
													class="grid max-h-9 min-w-9 items-center justify-center rounded-sm bg-neutral-800 text-neutral-500 hover:bg-red-500 hover:text-white"
												>
													{#if client.hoverOver == `pages-delete-${index}`}
														<Trash class="h-5 w-5 fill-[currentcolor]" weight="fill" />
													{:else}
														<Trash class="h-5 w-5 fill-[currentcolor]" />
													{/if}
												</a>
											</div>
										</div>
									</div>
									<div class="flex flex-col rounded-sm bg-svelted-gray-700 py-2">
										<p>
											<span class="border-r border-r-neutral-800 px-2 py-2"
												>Modified: {formatTime(item.description.modified)}</span
											>
											<span class="px-2 py-2">Created: {formatTime(item.description.created)}</span>
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
					<table class="w-full">
						<thead>
							<tr class="text-neutral-500">
								<th>
									<div class="grid h-8 max-w-10 items-center justify-center text-left">
										<Checkbox class="border-neutral-700" id="pages-checkbox" />
									</div>
								</th>
								<th>
									<button
										on:click={() => sortTable('route')}
										class="flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
									>
										<p>Route</p>
										<CaretUp weight="fill" />
									</button>
								</th>
								<th>
									<button
										on:click={() => sortTable('name')}
										class="flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
									>
										<p>Name</p>
										<CaretUp weight="fill" />
									</button>
								</th>
								<th>
									<button
										on:click={() => sortTable('author')}
										class="flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
									>
										<p>Author</p>
										<CaretUp weight="fill" />
									</button>
								</th>
								<th>
									<button
										on:click={() => sortTable('modified')}
										class="flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
									>
										<p>Modified</p>
										<CaretUp weight="fill" />
									</button>
								</th>
								<th>
									<button
										on:click={() => sortTable('created')}
										class="flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
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
										<Checkbox class="border-neutral-800" />
									</td>
									<td class="border-r border-r-neutral-800 px-2 py-2">{item.route}</td>
									<td class="border-r border-r-neutral-800 px-2 py-2">{item.description.name}</td>
									<td class="border-r border-r-neutral-800 px-2 py-2">{item.description.author}</td>
									<td class="border-r border-r-neutral-800 px-2 py-2"
										>{formatTime(item.description.modified)}</td
									>
									<td class="border-r-neutral-800 px-2 py-2"
										>{formatTime(item.description.created)}</td
									>
									<td class="w-14">
										<div class="flex gap-2">
											<a
												href={`/svelted/editor?currentpage=${item.description.route}`}
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
											<a
												href={`/svelted/editor?currentpage=${item.description.route}`}
												on:mouseenter={() => hoverOver(`pages-delete-${index}`)}
												on:mouseleave={() => hoverOver(undefined)}
												class="rounded-sm bg-neutral-800 p-2 text-neutral-500 hover:bg-red-500 hover:text-white"
											>
												{#if client.hoverOver == `pages-delete-${index}`}
													<Trash class="h-5 w-5 fill-[currentcolor]" weight="fill" />
												{:else}
													<Trash class="h-5 w-5 fill-[currentcolor]" />
												{/if}
											</a>
										</div>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
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

	tr.spacer td {
		height: 0.25rem;
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
		border-spacing: 0 0.5rem;
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
</style>
