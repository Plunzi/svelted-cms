<script lang="ts">
	interface Todos {
		todo: {
			entry: string;
		}[];
		done: {
			entry: string;
		}[];
	}

	import { Check, CheckSquareOffset, Circle, Plus, Resize, Trash } from 'phosphor-svelte';

	let shown = false;
	let input = '';
	let maximized = true;

	export let tasks: Todos = {
		todo: [
			{
				entry: 'Exampler'
			}
		],
		done: [
			{
				entry: 'Exampler Done!'
			}
		]
	};

	const saveData = async function (todos: string) {
		const formData = new FormData();

		formData.append('todos', todos);

		const response = await fetch('/svelted/simple-todo/save', {
			method: 'POST',
			body: formData
		});
	};

	const addEntries = () => {
		const inputField = document.getElementById('todo-input') as HTMLInputElement;
		if (input === '') {
			if (shown) {
				inputField.blur();
			} else {
				inputField.select();
			}
			shown = !shown;
		} else {
			tasks.todo.push({ entry: input });
			tasks.todo = tasks.todo;
			input = '';
			shown = false;
			inputField.blur();
		}

		saveData(JSON.stringify(tasks));
	};

	const checkEntry = (index: number, status: string) => {
		if (status == 'todo') {
			const entry = tasks.todo.at(index);
			// console.log(entry, index);

			if (entry) {
				tasks.done.push(entry);
				tasks.todo.splice(index, 1);
				tasks.done = tasks.done;
			}
		} else {
			const entry = tasks.done.at(index);
			// console.log(entry);

			if (entry) {
				tasks.todo.push(entry);
				tasks.done.splice(index, 1);
				tasks.todo = tasks.todo;
			}
		}

		saveData(JSON.stringify(tasks));
	};

	const clearDones = () => {
		tasks.done = [];
		saveData(JSON.stringify(tasks));
	};

	const deleteEntry = (index: number, status: string) => {
		if (status == 'todo') {
			const entry = tasks.todo.at(index);

			if (entry) {
				tasks.todo.splice(index, 1);
				tasks.todo = tasks.todo;
			}
		} else {
			const entry = tasks.done.at(index);

			if (entry) {
				tasks.done.splice(index, 1);
				tasks.done = tasks.done;
			}
		}

		saveData(JSON.stringify(tasks));
	};

	const toggleSize = () => {
		maximized = !maximized;
	};
</script>

<div
	class="absolute right-64 top-0 mr-2 mt-2 transition-all flex {maximized ? 'h-72 w-48' : 'h-[32rem] w-[20rem]' } flex-col rounded-sm border border-neutral-800 bg-neutral-950 text-white shadow-sm"
>
	<div
		class="flex h-10 items-center items-center justify-between gap-1 rounded-t-sm bg-[#161616] p-2 pr-1 text-neutral-500"
	>
		<div class="flex items-center gap-1">
			<CheckSquareOffset class="fill-[currentcolor]" />
			<span class="mb-0.5">Quick To Do</span>
		</div>
		<div class="flex">
			<button
				on:click={addEntries}
				class="p-1.5 text-neutral-400 hover:rounded-sm hover:bg-neutral-800 hover:text-white"
			>
				<Plus class="fill-[currentcolor]" />
			</button>
			<button
				on:click={toggleSize}
				class="p-1.5 text-neutral-400 hover:rounded-sm hover:bg-neutral-800 hover:text-white"
			>
				<Resize class="fill-[currentcolor]" />
			</button>
		</div>
	</div>
	<div class="flex h-full flex-col gap-1 overflow-auto">
		<input
			id="todo-input"
			on:keydown={(e) => {
				if (e.key == 'Enter') addEntries();
			}}
			bind:value={input}
			class="border-y border-neutral-800 bg-[#161616] transition-all {shown
				? 'p-2'
				: 'max-h-0 overflow-hidden p-0'} text-sm focus:outline-none"
			type="text"
		/>
		{#each tasks.todo as task, index}
			<div class="flex">
				<button
					on:click={() => checkEntry(index, 'todo')}
					class="relative flex items-center gap-2 px-1 text-neutral-500 hover:text-white"
				>
					<Circle class="fill-[currentcolor]" />
					<p class="mb-1">{task.entry}</p>
				</button>
				<button
					on:click={() => deleteEntry(index, 'done')}
					class="absolute right-2 grid h-6 w-6 items-center justify-center rounded-sm bg-neutral-900 text-neutral-500 hover:text-red-500"
				>
					<Trash class="fill-[currentcolor]" />
				</button>
			</div>
		{/each}

		<div class="relative my-3 flex h-[1px] items-center border-neutral-800 bg-neutral-800">
			<button
				on:click={clearDones}
				class="absolute right-4 mb-1 bg-neutral-950 px-2 text-neutral-700 hover:text-neutral-500"
				>↓ Clear</button
			>
		</div>

		{#each tasks.done as task, index}
			<div class="flex">
				<button
					on:click={() => checkEntry(index, 'done')}
					class="relative flex items-center gap-2 px-1 text-neutral-500 hover:text-white"
				>
					<Check class="fill-[currentcolor]" />
					<p class="mb-1 line-through">{task.entry}</p>
				</button>
				<button
					on:click={() => deleteEntry(index, 'done')}
					class="absolute right-2 grid h-6 w-6 items-center justify-center rounded-sm bg-neutral-900 text-neutral-500 hover:text-red-500"
				>
					<Trash class="fill-[currentcolor]" />
				</button>
			</div>
		{/each}
	</div>
</div>

<style>
	.overflow-auto::-webkit-scrollbar {
		width: 2px;
		background: transparent;
	}

	.overflow-auto::-webkit-scrollbar-thumb {
		width: 2px;
		background: #36bf68;
	}
</style>
