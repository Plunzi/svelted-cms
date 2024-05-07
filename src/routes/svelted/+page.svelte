<script lang="ts">
	import * as Avatar from '$lib/components/svelted-core/ui/avatar/index.js';
	import Navigation from '$lib/components/svelted-core/ui/Navigation.svelte';
	import { CaretDown, PuzzlePiece, UserList } from 'phosphor-svelte';
	import { onMount } from 'svelte';

	export let data;
	const ressources = data.ressources;

	// console.log(os.hostname, os.cpus, os.platform, os.homedir, os.version, os.uptime);

	let currentTime = new Date();

	let roles = [
		{
			name: 'Administrators',
			users: [
				{
					name: 'Plunzi',
					img: '',
					status: 'online'
				}
			]
		},
		{
			name: 'Developer',
			users: [
				{
					name: 'Matl044',
					img: '',
					status: 'busy'
				}
			]
		},
		{
			name: 'Users',
			users: [
				{
					name: 'Anja',
					img: '',
					status: 'online'
				},
				{
					name: 'Sebi',
					img: '',
					status: 'away'
				}
			]
		}
	];

	interface Client {
		sidebar: boolean;
	}

	type TaskList = {
		todo: string[];
		done: string[];
	};

	let tasks: TaskList = {
		todo: [],
		done: []
	};

	function enter(input: any | null) {
		if (input == null) {
			return;
		}

		const addToDo = add(input.value);
		if (addToDo) {
			input.value = '';
		} else {
			console.log('This ToDo already exists');
		}
	}

	function add(todo: string): Boolean {
		if (!tasks.todo.includes(todo) || !tasks.done.includes(todo)) {
			tasks.todo = [todo, ...tasks.todo];
			return true;
		}
		return false;
	}
	function remove(todo: string) {
		const index = tasks.todo.indexOf(todo);
		if (index !== -1) {
			tasks.todo.splice(index, 1);
			tasks.todo = [...tasks.todo];
		}
	}
	function check(todo: string) {
		remove(todo);
		tasks.done = [...tasks.done, todo];
	}
	function clear() {
		tasks.done = [];
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

	onMount(async () => {
		setInterval(function () {
			currentTime = new Date();
			console.log('refreshed');
		}, 1 * 1000);
	});
</script>

<Navigation>
	<div class="flex">
		<div class="flex w-full flex-col justify-between p-4">
			<div class="mt-8">
				<p class="clock mx-auto text-center text-[8rem] font-medium text-white">
					{`${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`}
				</p>
				<div class="-mt-4 flex items-center justify-between">
					<div class="mx-auto">
						<h1 class="mx-auto text-center text-3xl font-medium text-neutral-300">
							Wellcome Carl,
						</h1>
						<p class="mx-auto text-center font-light text-neutral-300">to your dashboard!</p>
					</div>
				</div>
			</div>

			<div
				class="absolute right-64 top-0 mr-2 mt-2 flex h-72 w-48 rounded-sm border border-neutral-800 bg-neutral-950 p-2 p-2 text-white"
			>
				ToDo
			</div>

			<div class="flex w-full gap-2 rounded-md border border-neutral-800 bg-neutral-950 p-4">
				<div
					class="h-64 w-[50%] rounded-sm border border-neutral-800 bg-neutral-950 p-2 p-2 text-white"
				>
					OVERVIEW
					<p>1 / 1 published Layouts</p>
					<p>1 Page</p>
					<p>4 Users</p>
				</div>
				<div
					class="h-64 w-[50%] rounded-sm border border-neutral-800 bg-neutral-950 p-2 p-2 text-white"
				>
					ACTIVITY
					{#if Number(ressources.cpuUsage) == 0}
						<p>CPU: {'< 0.01'}%</p>
					{:else}
						<p>CPU: {ressources.cpuUsage}%</p>
					{/if}
					<p>
						Memory: <span class="text-[#2da05a]">{ressources.usedMemory}</span> / {ressources.totalMemory}
					</p>
				</div>
				<div
					class="h-64 w-[50%] rounded-sm border border-neutral-800 bg-neutral-950 p-2 p-2 text-white"
				>
					Announcements and News
                    <br>--text: <span class="text-[#e3f7ea]">#e3f7ea</span>;
                    <br>--background: <span class="text-[#020804]">#020804</span>;
                    <br>--primary: <span class="text-[#36bf68]">#36bf68</span>;
					<br>--secondary: <span class="text-[#1e6b61]">#1e6b61</span>;
                    <br>--accent: <span class="text-[#298e8b]">#298e8b</span>;
				</div>
			</div>
		</div>
		<div
			class="h-full-editor open flex min-w-64 max-w-64 flex-col justify-between overflow-hidden border-l border-neutral-800 bg-neutral-950 p-2 transition-all"
		>
			<div id="roles" class="flex flex-col gap-3">
				{#each roles as role}
					<button class="section-description -mb-2 flex w-full justify-between transition-all">
						<h2 class="text-neutral-500">{role.name}</h2>
						<CaretDown id="extensions-btn" class="my-auto fill-neutral-500" />
					</button>
					<div id="admins" class="max-h-48 transition-all">
						{#each role.users as user}
							<button
								class="flex aspect-square h-12 w-full items-center gap-4 bg-[#161616] p-1 px-2 pl-3 hover:bg-[#278c4c] hover:outline focus:outline-none"
							>
								{#if user.status == 'online'}
									<div
										class="absolute h-6 w-6 rounded-full outline outline-[1.5px] outline-offset-2 outline-green-500"
									/>
								{:else if user.status == 'away'}
									<div
										class="absolute h-6 w-6 rounded-full outline outline-[1.5px] outline-offset-2 outline-yellow-500"
									/>
								{:else}
									<div
										class="absolute h-6 w-6 rounded-full outline outline-[1.5px] outline-offset-2 outline-red-500"
									/>
								{/if}
								<Avatar.Root class="h-6 w-6">
									<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
									<Avatar.Fallback>CN</Avatar.Fallback>
								</Avatar.Root>
								<p class="text-white">{user.name}</p>
							</button>
						{/each}
					</div>
				{/each}
			</div>
			<div>
				<button
					class="flex aspect-square h-12 w-full items-center gap-4 rounded-sm bg-[#161616] p-1 px-2 hover:bg-[#278c4c] hover:outline focus:outline-none"
					on:mouseenter={() => hoverOver('users')}
					on:mouseleave={() => hoverOver(undefined)}
					on:click={() => (client.sidebar = !client.sidebar)}
				>
					{#if client.hoverOver == 'users'}
						<UserList class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-200" weight="fill" />
						<p class="text-white">Manage Users</p>
					{:else}
						<UserList class="mx-1 my-auto min-h-6 min-w-6 fill-neutral-500" weight="regular" />
						<p class="text-neutral-500">Manage Users</p>
					{/if}
				</button>
			</div>
		</div>
	</div>
</Navigation>

<style>
	.clock {
		text-shadow: 0px 0px 40px black;
		background: linear-gradient(black, white);
		-webkit-text-stroke-width: 1px;
		-webkit-text-stroke-color: gray;
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		color: transparent;
	}

	.h-full-editor {
		min-height: calc(100vh - 4rem);
	}

	#roles button:first-of-type {
		border-top-right-radius: 0.25rem;
		border-top-left-radius: 0.25rem;
	}

	#roles button:last-of-type {
		border-bottom-right-radius: 0.25rem;
		border-bottom-left-radius: 0.25rem;
	}

	#roles button:focus-within {
		fill: white !important;
		outline: solid 1.5px #36bf68;
		background: #0a2620;
		outline-offset: -1.5px;
	}
</style>
