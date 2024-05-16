<script lang="ts">
	import {
		AddressBookTabs,
		Blueprint,
		CaretDown,
		Code,
		HardDrive,
		House,
		Images,
		Layout,
		MagnifyingGlass,
		PuzzlePiece,
		ShieldStar,
		SquareHalf
	} from 'phosphor-svelte';

	export let overflow;
	export let site;

	interface Client {
		hoverOver: undefined | string;
		sidebar: boolean;
	}

	let client: Client = {
		hoverOver: undefined,
		sidebar: false
	};

	const hoverOver = function (element: string | undefined) {
		client.hoverOver = element;
	};

	export let activepage: string = 'Overview';

	let NavigationCategories = [
		{
			name: 'Essentials',
			routes: [
				{
					name: 'Overview',
					icon: House,
					link: '/'
				},
				{
					name: 'Layouts',
					icon: Blueprint,
					link: '/layouts'
				},
				{
					name: 'Pages',
					icon: Layout,
					link: '/pages'
				}
			]
		},
		{
			name: 'Content',
			routes: [
				{
					name: 'Media & Files',
					icon: Images,
					link: '/media'
				},
				{
					name: 'Collections',
					icon: HardDrive,
					link: '/collections'
				},
			]
		},
		{
			name: 'User & Roles',
			routes: [
				{
					name: 'Users',
					icon: AddressBookTabs,
					link: '/users'
				},
				{
					name: 'Roles',
					icon: ShieldStar,
					link: '/roles'
				},
			]
		},
		{
			name: 'Extensions',
			routes: [
				{
					name: 'Extensions',
					icon: PuzzlePiece,
					link: '/extensions'
				},
			]
		}
	];

	const toggleSection = function (element: string) {
		const target = document.getElementById(element);
		const button = document.getElementById(element + '-btn');

		if (target!.classList.contains('hide')) {
			target!.classList.remove('hide');
			button!.style.transform = 'rotate(0deg)';
		} else {
			target!.classList.add('hide');
			button!.style.transform = 'rotate(90deg)';
		}
	};
</script>

<main class="h-full max-h-screen min-h-screen w-full bg-neutral-900">
	<nav class="flex h-16 items-center justify-between border-b border-neutral-800 bg-neutral-950">
		<div class="flex h-full items-center gap-4">
			<a
				href="/svelted"
				class="grid h-full w-16 items-center hover:bg-[#0a2620] focus:bg-[#0a2620] focus:outline-none"
			>
				<img
					class="m-auto h-10 w-10 opacity-80 transition-all"
					src="/static-svelted/svelted-color.svg"
					alt="Svelted Logo - Back"
				/>
			</a>
			<div class="flex flex-col">
				<h1 class="text-gradient text-lg font-bold text-neutral-200">Svelted CMS</h1>
				<span class="-mt-2 text-sm font-medium text-neutral-500">made by Plunzi</span>
			</div>
			{#each site as site}
				<div class="text-neutral-500">/</div>
				<div class="text-neutral-500">{site}</div>
			{/each}
		</div>
		<div class="flex-grow px-8">
			<button
				class="contens absolute rounded-l-sm text-neutral-500 hover:text-white focus:bg-[#2da05a] focus:text-white focus:outline-none"
			>
				<MagnifyingGlass
					class="h-10 w-11 rounded-l-lg border-r border-neutral-800 fill-[currentcolor] p-2 px-2.5 hover:border-r-[#278c4c] hover:bg-[#278c4c]"
				/>
			</button>
			<input
				name="quick-overall-search"
				placeholder="Search ..."
				class="w-full rounded-lg bg-[#161616] px-3 py-2 pl-14 text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#36bf68]"
			/>
		</div>
		<div class="flex pr-4">
			<button
				class="flex items-center gap-2 rounded-sm pl-3 text-neutral-500 hover:text-white focus:bg-[#2da05a] focus:text-white focus:outline-none focus:ring focus:ring-[#2da05a]"
			>
				<p class="pb-0.5">Lukas</p>
				<Code class="h-6 w-6 fill-[currentcolor]" />
				<div
					class="grid min-h-10 min-w-10 items-center justify-center rounded-sm bg-[#161616] pb-0.5 text-xl font-medium"
				>
					U
				</div>
			</button>
		</div>
	</nav>
	<div class="flex">
		<nav
			class="h-full-editor {client.sidebar
				? 'open w-[18rem] max-w-[18rem]'
				: 'closed'} flex w-16 flex-col justify-between overflow-hidden border-r border-neutral-800 bg-neutral-950 p-2 transition-all"
		>
			<div class="flex flex-col gap-3" id="primary-sidebar-navigation">
				{#each NavigationCategories as category}
					<button
						class="section-description -mb-2 flex justify-between text-neutral-500 transition-all"
						on:click={() => toggleSection(category.name.toLowerCase())}
					>
						<h2>{category.name}</h2>
						<CaretDown
							id={`${category.name.toLowerCase()}-btn`}
							class="my-auto fill-[currentcolor]"
						/>
					</button>

					<div id={category.name.toLowerCase()} class="max-h-48 transition-all">
						{#each category.routes as route}
							<a
								href={`/svelted${route.link}`}
								class="flex aspect-square h-12 w-full items-center gap-4 bg-[#161616] p-1 px-2 hover:bg-[#278c4c] focus:outline-none"
								class:!bg-neutral-800={activepage.toLowerCase() == route.name.toLowerCase()}
								class:!shadow-2xl={activepage.toLowerCase() == route.name.toLowerCase()}
								on:mouseenter={() => hoverOver(route.name.toLowerCase())}
								on:mouseleave={() => hoverOver(undefined)}
							>
								{#if client.hoverOver == route.name.toLowerCase()}
									<svelte:component
										this={route.icon}
										class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-200"
										weight="fill"
									/>
									<p class="text-white">{route.name}</p>
								{:else}
									<svelte:component
										this={route.icon}
										class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-500"
										weight="regular"
									/>
									<p class="text-neutral-500">{route.name}</p>
								{/if}
							</a>
						{/each}
					</div>
				{/each}
			</div>

			<div>
				<div id="settings">
					<button
						class="flex rounded-sm aspect-square h-12 w-full items-center gap-4 bg-[#161616] p-1 px-2 hover:bg-[#278c4c] hover:bg-white focus:bg-[#0a2620] border-svelted-primary-500 focus:outline-none"
						on:mouseenter={() => hoverOver('sidebar')}
						on:mouseleave={() => hoverOver(undefined)}
						on:click={() => (client.sidebar = !client.sidebar)}
					>
						{#if client.hoverOver == 'sidebar'}
							<SquareHalf class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-200" weight="fill" />
							<p class="text-white">Close Sidebar</p>
						{:else}
							<SquareHalf class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-500" weight="regular" />
							<p class="text-neutral-500">Close Sidebar</p>
						{/if}
					</button>
				</div>
			</div>
		</nav>
		<section
			class="max-h-editor relative flex-1 {overflow
				? 'overflow-y-auto'
				: 'overflow-y-hidden'} bg-[#0e0f13] bg-[radial-gradient(#17181c_1px,transparent_1px)] [background-size:16px_16px]"
		>
			<slot />
		</section>
	</div>
</main>

<style>
	:is(.closed .section-description, .hide) {
		max-height: 0;
		opacity: 0;
		overflow: hidden;
	}

	#primary-sidebar-navigation div button:first-of-type,
	#primary-sidebar-navigation div a:first-of-type {
		border-top-right-radius: 0.25rem;
		border-top-left-radius: 0.25rem;
	}

	#primary-sidebar-navigation div button:last-of-type,
	#primary-sidebar-navigation div a:last-of-type {
		border-bottom-right-radius: 0.25rem;
		border-bottom-left-radius: 0.25rem;
	}

	#primary-sidebar-navigation div button:focus-visible,
	#primary-sidebar-navigation div a:focus-visible,
	#settings button:focus-visible {
		fill: white !important;
		outline: solid 1.5px #36bf68;
		background: #0a2620;
		outline-offset: -1.5px;
	}

	.section-description:focus-within {
		background: #36bf68;
		outline: none;
		border-radius: 0.5rem;
		color: #000;
		padding: 0 0.75rem;
		margin-bottom: 0.1rem;
		opacity: 1;
		min-height: 0.125rem;
		max-height: 0.125rem;
	}

	:is(.open .section-description) {
		max-height: 2rem;
		opacity: 1;
	}

	.text-gradient {
		background: linear-gradient(120deg, #36bf68, #1e6b61);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.text-ghost {
		-webkit-text-stroke-width: 1px;
		-webkit-text-stroke-color: #e3f7ea;
		color: transparent;
	}

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

	.transition-width {
		transition:
			min-width ease-out 0.25s,
			max-width ease-out 0.25s;
	}
</style>
