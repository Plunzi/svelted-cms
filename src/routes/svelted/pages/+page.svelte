<script lang="ts">
	import Navigation from '$lib/internal/svelted-core/ui/Navigation.svelte';
	import { Blueprint, CaretUp, Funnel, Pen, Plus, Trash, UserList } from 'phosphor-svelte';
	import { writable } from 'svelte/store';
	import formatTime from '$lib/internal/svelted-core/format/time';
	import Checkbox from '$lib/internal/svelted-core/ui/checkbox/checkbox.svelte';

	let searchTerm = '';

	interface Client {
		sidebar: boolean;
	}

	const hoverOver = function (element: string | undefined) {
		client.hoverOver = element;
	};

	interface Client {
		hoverOver: undefined | string;
		sidebar: boolean;
	}

	let client: Client = {
		hoverOver: undefined,
		sidebar: false
	};

	const toggleSection = function (element: string) {
		const target = document.getElementById(element);
		const button = document.getElementById(element + '-btn');

		console.log(target);
		console.log(button);

		if (target!.classList.contains('hide')) {
			target!.classList.remove('hide');
			button!.style.transform = 'rotate(0deg)';
		} else {
			target!.classList.add('hide');
			button!.style.transform = 'rotate(90deg)';
		}
	};

	const now = new Date();
	const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000); // One hour ago
	const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // One day ago
	const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // One week ago
	const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // One month ago

	let items = [
		{
			route: '/',
			name: 'Home',
			author: 'Plunzi',
			status: 'published',
			modified: now.getTime(),
			created: oneWeekAgo.getTime()
		},
		{
			route: '/about',
			name: 'About',
			author: 'Plunzi',
			status: 'draft',
			modified: oneHourAgo.getTime(),
			created: oneDayAgo.getTime()
		},
		{
			route: '/contact',
			name: 'Contact',
			status: 'draft',
			author: 'Jasi',
			modified: oneDayAgo.getTime(),
			created: oneMonthAgo.getTime()
		},
		{
			route: '/faq',
			name: 'FAQ',
			status: 'published',
			author: 'Matl044',
			modified: oneWeekAgo.getTime(),
			created: oneWeekAgo.getTime()
		}
	];

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
			// @ts-ignore
			const aVal = a[key];
			// @ts-ignore
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

	$: filteredItems = $sortItems.filter(
		(item) => item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
	);
</script>

<Navigation overflow={false} site={['Pages']}>
	<div class="flex bg-neutral-950">
		<!-- <div class="flex w-full flex-col justify-between p-4">
			<QuickToDo tasks={data.todo.data} />
        </div> -->
		<div class="flex w-full flex-col gap-4 p-3 text-white">
			<div class="flex h-10 items-center gap-2 rounded bg-svelted-gray-700 px-2">
				<Blueprint class="h-5 w-5 fill-neutral-500" weight="regular" />
				<p class="font-medium text-neutral-500">Pages Overview</p>
				<p class="text-neutral-500">―</p>
				<p class="text-neutral-500">
					All {items.length}, Published {items.filter((item) => item.status == 'published').length},
					Drafts {items.filter((item) => item.status == 'draft').length}
				</p>
			</div>
			<nav class="flex gap-2">
				<button
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
			<div class="rounded-lg bg-svelted-gray-700 p-2">
				<table class="w-full">
					<thead>
						<tr class="text-neutral-500">
							<th>
								<div class="mb-2 grid h-8 max-w-10 items-center justify-center text-left">
									<Checkbox class="border-neutral-700" id="pages-checkbox" />
								</div>
							</th>
							<th>
								<button
									on:click={() => sortTable('route')}
									class="mb-2 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
								>
									<p>Route</p>
									<CaretUp weight="fill" />
								</button>
							</th>
							<th>
								<button
									on:click={() => sortTable('name')}
									class="mb-2 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
								>
									<p>Title</p>
									<CaretUp weight="fill" />
								</button>
							</th>
							<th>
								<button
									on:click={() => sortTable('status')}
									class="mb-2 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
								>
									<p>Status</p>
									<CaretUp weight="fill" />
								</button>
							</th>
							<th>
								<button
									on:click={() => sortTable('author')}
									class="mb-2 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
								>
									<p>Author</p>
									<CaretUp weight="fill" />
								</button>
							</th>
							<th>
								<button
									on:click={() => sortTable('modified')}
									class="mb-2 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
								>
									<p>Modified</p>
									<CaretUp weight="fill" />
								</button>
							</th>
							<th>
								<button
									on:click={() => sortTable('created')}
									class="mb-2 flex h-8 w-full items-center justify-between rounded-sm px-2 text-left hover:bg-svelted-primary-700 hover:text-white"
								>
									<p>Created</p>
									<CaretUp weight="fill" />
								</button>
							</th>
						</tr>
					</thead>
					<tbody class="text-neutral-500">
						<!-- {#each $sortItems as item}
							<tr>
								<td>{item.id}</td>
								<td>{item.maker}</td>
								<td>{item.type}</td>
								<td>{item.make}</td>
							</tr>
						{/each} -->
						{#each filteredItems as item, index}
							<tr class="hover:!bg-[#0a2620] hover:text-white">
								<td class="w-[10px] border-r border-r-neutral-800 !px-3 !py-2">
									<Checkbox class="border-neutral-800" />
								</td>
								<td class="border-r border-r-neutral-800 px-2 py-2">{item.route}</td>
								<td class="border-r border-r-neutral-800 px-2 py-2">{item.name}</td>
								<td class="border-r border-r-neutral-800 px-2 py-2">{item.status}</td>
								<td class="border-r border-r-neutral-800 px-2 py-2">{item.author}</td>
								<td class="border-r border-r-neutral-800 px-2 py-2">{formatTime(item.modified)}</td>
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
							<tr class="spacer">
								<td></td>
							</tr>
						{/each}
					</tbody>
				</table>
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

	tbody tr:nth-child(odd) {
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