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
		Plus,
		PlusSquare,
		PuzzlePiece,
		ShieldStar,
		SquareHalf,
		UserCircle
	} from 'phosphor-svelte';

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
				href="/svelted/dashboard"
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
			<div class="text-neutral-500">/</div>
			<div class="text-neutral-500">Dashboard</div>
		</div>
		<div class="flex-grow px-8">
			<button class="contens absolute focus:bg-[#2da05a] focus:outline-none rounded-l-sm">
				<MagnifyingGlass
					class="h-10 w-11 rounded-l-lg border-r border-neutral-800 fill-white p-2 px-2.5 hover:border-r-[#278c4c] hover:bg-[#278c4c]"
				/>
			</button>
			<input
				placeholder="Search ..."
				class="w-full rounded-lg bg-[#161616] px-3 py-2 pl-14 text-neutral-300 focus:outline-none focus:ring-1 focus:ring-[#36bf68]"
			/>
		</div>
		<div class="flex pr-4">
			<button class="flex gap-2 items-center focus:bg-[#2da05a] focus:outline-none focus:ring focus:ring-[#2da05a] pl-3 rounded-sm">
				<p class="pb-0.5 text-white">Lukas</p>
				<Code class="h-6 w-6 fill-white" />
				<div
					class="grid min-h-10 min-w-10 items-center justify-center rounded-sm bg-[#161616] pb-0.5 text-xl font-medium text-neutral-600 text-white"
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
			<div class="flex flex-col gap-3">
				<button
					class="section-description -mb-2 flex justify-between transition-all"
					on:click={() => toggleSection('essentials')}
				>
					<h2 class="text-neutral-500">Essentials</h2>
					<CaretDown id="essentials-btn" class="my-auto fill-neutral-500" />
				</button>

				<div id="essentials" class="max-h-48 transition-all">
					<button
						class="flex aspect-square h-12 w-full items-center gap-4 bg-[#161616] p-1 px-2 hover:bg-[#278c4c] hover:outline focus:outline-none"
						on:mouseenter={() => hoverOver('overview')}
						on:mouseleave={() => hoverOver(undefined)}
					>
						{#if client.hoverOver == 'overview'}
							<House class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-200" weight="fill" />
							<p class="text-white">Overview</p>
						{:else}
							<House class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-500" weight="regular" />
							<p class="text-neutral-500">Overview</p>
						{/if}
					</button>
					<button
						class="flex aspect-square h-12 w-full items-center gap-4 bg-[#161616] p-1 px-2 hover:bg-[#278c4c] hover:outline focus:outline-none"
						on:mouseenter={() => hoverOver('layouts')}
						on:mouseleave={() => hoverOver(undefined)}
					>
						{#if client.hoverOver == 'layouts'}
							<Blueprint class="mx-1 my-auto min-h-6 min-w-6  fill-neutral-200" weight="fill" />
							<p class="text-neutral-300">Layouts</p>
						{:else}
							<Blueprint class="mx-1 my-auto min-h-6 min-w-6  fill-neutral-500" weight="regular" />
							<p class="text-neutral-500">Layouts</p>
						{/if}
					</button>
					<button
						class="flex aspect-square h-12 w-full items-center gap-4 bg-[#161616] p-1 px-2 hover:bg-[#278c4c] hover:outline focus:outline-none"
						on:mouseenter={() => hoverOver('pages')}
						on:mouseleave={() => hoverOver(undefined)}
					>
						{#if client.hoverOver == 'pages'}
							<Layout class="mx-1 my-auto min-h-6 min-w-6  fill-neutral-200" weight="fill" />
							<p class="text-neutral-300">Pages</p>
						{:else}
							<Layout class="mx-1 my-auto min-h-6 min-w-6  fill-neutral-500" weight="regular" />
							<p class="text-neutral-500">Pages</p>
						{/if}
					</button>
				</div>

				<button
					class="section-description -mb-2 flex justify-between text-neutral-500 transition-all"
					on:click={() => toggleSection('content')}
				>
					<h2>Content</h2>
					<CaretDown id="content-btn" class="my-auto fill-neutral-500" />
				</button>

				<div id="content" class="max-h-48 transition-all">
					<button
						class="flex aspect-square h-12 w-full items-center gap-4 bg-[#161616] p-1 px-2 hover:bg-[#278c4c] hover:outline focus:outline-none"
						on:mouseenter={() => hoverOver('media')}
						on:mouseleave={() => hoverOver(undefined)}
					>
						{#if client.hoverOver == 'media'}
							<Images class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-200" weight="fill" />
							<p class="whitespace-nowrap text-white">Media & Files</p>
						{:else}
							<Images class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-500" weight="regular" />
							<p class="whitespace-nowrap text-neutral-500">Media & Files</p>
						{/if}
					</button>
					<button
						class="flex aspect-square h-12 w-full items-center gap-4 bg-[#161616] p-1 px-2 hover:bg-[#278c4c] hover:outline focus:outline-none"
						on:mouseenter={() => hoverOver('collections')}
						on:mouseleave={() => hoverOver(undefined)}
					>
						{#if client.hoverOver == 'collections'}
							<HardDrive class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-200" weight="fill" />
							<p class="text-white">Collections</p>
						{:else}
							<HardDrive class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-500" weight="regular" />
							<p class="text-neutral-500">Collections</p>
						{/if}
					</button>
				</div>

				<button
					class="section-description -mb-2 flex justify-between text-neutral-500 transition-all"
					on:click={() => toggleSection('accounts')}
				>
					<h2>User & Roles</h2>
					<CaretDown id="accounts-btn" class="my-auto fill-neutral-500" />
				</button>

				<div id="accounts" class="max-h-48 transition-all">
					<button
						class="flex aspect-square h-12 w-full items-center gap-4 bg-[#161616] p-1 px-2 hover:bg-[#278c4c] hover:outline focus:outline-none"
						on:mouseenter={() => hoverOver('users')}
						on:mouseleave={() => hoverOver(undefined)}
					>
						{#if client.hoverOver == 'users'}
							<AddressBookTabs
								class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-200"
								weight="fill"
							/>
							<p class="text-white">Users</p>
						{:else}
							<AddressBookTabs
								class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-500"
								weight="regular"
							/>
							<p class="text-neutral-500">Users</p>
						{/if}
					</button>
					<button
						class="flex aspect-square h-12 w-full items-center gap-4 bg-[#161616] p-1 px-2 hover:bg-[#278c4c] hover:outline focus:outline-none"
						on:mouseenter={() => hoverOver('roles')}
						on:mouseleave={() => hoverOver(undefined)}
					>
						{#if client.hoverOver == 'roles'}
							<ShieldStar class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-200" weight="fill" />
							<p class="text-white">Roles</p>
						{:else}
							<ShieldStar class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-500" weight="regular" />
							<p class="text-neutral-500">Roles</p>
						{/if}
					</button>
				</div>

				<button
					class="section-description -mb-2 flex justify-between text-neutral-500 transition-all"
					on:click={() => toggleSection('extensions')}
				>
					<h2>Extensions</h2>
					<CaretDown id="extensions-btn" class="my-auto fill-neutral-500" />
				</button>

				<div id="extensions" class="max-h-48 transition-all">
					<button
						class="flex aspect-square h-12 w-full items-center gap-4 bg-[#161616] p-1 px-2 hover:bg-[#278c4c] hover:outline focus:outline-none"
						on:mouseenter={() => hoverOver('extensions')}
						on:mouseleave={() => hoverOver(undefined)}
					>
						{#if client.hoverOver == 'extensions'}
							<PuzzlePiece class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-200" weight="fill" />
							<p class="text-white">Extensions</p>
						{:else}
							<PuzzlePiece class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-500" weight="regular" />
							<p class="text-neutral-500">Extensions</p>
						{/if}
					</button>
				</div>
			</div>

			<div>
				<div id="settings">
					<button
						class="flex aspect-square h-12 w-full items-center gap-4 bg-[#161616] p-1 px-2 hover:bg-[#278c4c] hover:outline focus:outline-none"
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
			class="max-h-editor relative flex-1 overflow-y-auto bg-[#0e0f13] bg-[radial-gradient(#17181c_1px,transparent_1px)] [background-size:16px_16px]"
		>
			<slot/>
		</section>
	</div>
</main>

<style>
	:is(.closed .section-description, .hide) {
		max-height: 0;
		opacity: 0;
		overflow: hidden;
	}

	#essentials button:first-of-type,
	#content button:first-of-type,
	#accounts button:first-of-type,
	#extensions button:first-of-type,
	#settings button:first-of-type {
		border-top-right-radius: 0.25rem;
		border-top-left-radius: 0.25rem;
	}

	#essentials button:last-of-type,
	#content button:last-of-type,
	#accounts button:last-of-type,
	#extensions button:last-of-type,
	#settings button:last-of-type {
		border-bottom-right-radius: 0.25rem;
		border-bottom-left-radius: 0.25rem;
	}

	#essentials button:focus-within,
	#content button:focus-within,
	#accounts button:focus-within,
	#extensions button:focus-within,
	#settings button:focus-within {
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
