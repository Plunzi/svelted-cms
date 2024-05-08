<script lang="ts">
	import * as Avatar from '$lib/components/svelted-core/ui/avatar/index.js';
	import Navigation from '$lib/components/svelted-core/ui/Navigation.svelte';
	import { CaretDown, Check, Checks, CheckSquareOffset, PuzzlePiece, UserList } from 'phosphor-svelte';
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

	onMount(async () => {
		setInterval(function () {
			currentTime = new Date();
			// console.log('refreshed');
		}, 1 * 1000);
	});
</script>

<Navigation overflow={false}>
	<div class="flex">
		<div class="flex w-full flex-col justify-between p-4">
			<div class="mt-8">
				<p class="clock mx-auto text-center text-[8rem] font-medium text-white">
					{`${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`}
				</p>
				<div class="-mt-4 flex items-center justify-between">
					<div class="mx-auto">
						<h1 class="mx-auto text-center text-3xl font-medium text-neutral-300">
							Wellcome Lukas,
						</h1>
						<p class="mx-auto text-center font-light text-neutral-300">to your dashboard!</p>
					</div>
				</div>
			</div>

			<div
				class="absolute right-64 top-0 mr-2 mt-2 flex flex-col h-72 w-48 rounded-sm border border-neutral-800 bg-neutral-950 text-white"
			>
				<p class="bg-[#161616] text-neutral-500 h-10 rounded-t-sm flex gap-1 items-center items-center p-2">
					<CheckSquareOffset class="fill-[currentcolor]" />
					<span class="mb-0.5">Quick To Do</span>
				</p>
			</div>

			<div class="absolute bottom-0 left-0 mb-2 ml-2 text-neutral-500">
				<p><span class="text-[#2da05a]">4</span> Users</p>
				<p><span class="text-[#2da05a]">1</span>/1 public Pages</p>
				<p><span class="text-[#2da05a]">1</span>/1 published Layouts</p>
			</div>

			<div class="absolute bottom-0 right-64 mb-2 mr-2 text-right text-neutral-500">
				{#if Number(ressources.cpuUsage) == 0}
					<p>{'< 0.01'}% CPU</p>
				{:else}
					<p>{ressources.cpuUsage}% CPU</p>
				{/if}
				<p>
					<span class="text-[#2da05a]">{ressources.usedMemory}</span>/{ressources.totalMemory} Memory
				</p>
			</div>

			<div
				class="absolute -bottom-60 left-[50%] mx-auto flex w-[50%] -translate-x-[50%] gap-2 rounded-md pr-64 transition-all hover:-bottom-2"
			>
				<div
					class="relative flex h-64 w-full flex-col justify-between rounded-sm border border-neutral-800 bg-neutral-950 p-2 pb-4 text-white"
				>
					<p class="absolute -top-7 w-full text-center text-2xl font-medium text-neutral-500">
						...
					</p>
					<div class="text-neutral-500">
						<h2 class="text-neutral-500">Announcements and News</h2>
						<br />--text: <span class="text-[#e3f7ea]">#e3f7ea</span>;
						<br />--background: <span class="text-[#020804]">#020804</span>;
						<br />--primary: <span class="text-[#36bf68]">#36bf68</span>;
						<br />--secondary: <span class="text-[#1e6b61]">#1e6b61</span>;
						<br />--accent: <span class="text-[#298e8b]">#298e8b</span>;
					</div>
					<div class="flex w-full">
						<button
							tabindex="-1"
							class="h-10 w-full rounded-l-sm bg-[#161616] px-4 text-neutral-500 hover:bg-[#2da05a] hover:text-white"
							>Meetups</button
						>
						<button
							tabindex="-1"
							class="h-10 w-full bg-[#161616] px-4 text-neutral-500 hover:bg-[#2da05a] hover:text-white"
							>Docs</button
						>
						<button
							tabindex="-1"
							class="h-10 w-full rounded-r-sm bg-[#161616] px-4 text-neutral-500 hover:bg-[#2da05a] hover:text-white"
							>News</button
						>
					</div>
				</div>
			</div>
		</div>
		<div
			class="h-full-editor open flex min-w-64 max-w-64 flex-col justify-between overflow-hidden border-l border-neutral-800 bg-neutral-950 p-2 transition-all"
		>
			<div id="roles" class="flex flex-col gap-3">
				{#each roles as role}
					<button
						class="section-description -mb-2 flex w-full justify-between text-neutral-500 transition-all"
						on:click={() => toggleSection(`${role.name}-role`)}
					>
						<h2>{role.name}</h2>
						<CaretDown id={`${role.name}-role-btn`} class="my-auto fill-[currentcolor]" />
					</button>
					<div id={`${role.name}-role`} class="max-h-48 transition-all">
						{#each role.users as user}
							<button
								class="flex text-neutral-500 aspect-square h-12 w-full items-center gap-4 bg-[#161616] p-1 px-2 pl-3 hover:bg-[#278c4c] hover:text-white focus:outline-none"
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
									<Avatar.Fallback>{user.name.charAt(0)}</Avatar.Fallback>
								</Avatar.Root>
								<p>{user.name}</p>
							</button>
						{/each}
					</div>
				{/each}
			</div>
			<div>
				<button
					class="btn flex aspect-square h-12 w-full items-center gap-4 rounded-sm bg-[#161616] p-1 px-2 hover:bg-[#278c4c] hover:outline focus:outline-none"
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
	.section-description:focus-within {
		background: #36bf68 !important;
		outline: none;
		border-radius: 0.5rem;
		color: #000;
		padding: 0 0.75rem;
		margin-bottom: 0.1rem;
		opacity: 1;
		min-height: 0.125rem;
		max-height: 0.125rem;
		border-radius: 0.5rem !important;
	}

	.btn:focus-within {
		outline: solid 1.5px #36bf68;
		background: #0a2620;
		outline-offset: -1.5px;
	}

	:is(.open .section-description) {
		max-height: 2rem;
		opacity: 1;
	}

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

	:is(.closed .section-description, .hide) {
		max-height: 0;
		opacity: 0;
		overflow: hidden;
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
