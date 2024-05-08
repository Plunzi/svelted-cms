<script lang="ts">
	import { Check, CheckSquareOffset, Circle, Plus, Selection } from 'phosphor-svelte';

	let shown = false;
	let input = '';

	let tasks = {
		todo: [
			{
				name: 'Develop'
			}
		],
		done: [
			{
				name: 'Design Landingpage'
			}
		]
	};

	const addEntries = () => {
        const inputField = document.getElementById("todo-input") as HTMLInputElement;
		if (input === '') {
            if (shown) {
                inputField.blur();
            } else {
                inputField.select();
            }
            shown = !shown;
		} else {
			tasks.todo.push({ name: input });
			tasks.todo = tasks.todo;
			input = '';
			shown = false;
            inputField.blur();
		}
	};

	const checkEntry = (index: number, status: string) => {
		if (status == 'todo') {
			const entry = tasks.todo.at(index);
            console.log(entry, index);

			if (entry) {
				tasks.done.push(entry);
				tasks.todo.splice(index, 1);
				tasks.done = tasks.done;
			}
		} else {
			const entry = tasks.done.at(index);
            console.log(entry);

			if (entry) {
				tasks.todo.push(entry);
				tasks.done.splice(index, 1);
				tasks.todo = tasks.todo;
			}
		}
	};
</script>

<div
	class="flex h-10 items-center items-center justify-between gap-1 rounded-t-sm bg-[#161616] p-2 pr-1 text-neutral-500"
>
	<div class="flex items-center gap-1">
		<CheckSquareOffset class="fill-[currentcolor]" />
		<span class="mb-0.5">Quick To Do</span>
	</div>
	<button
		on:click={addEntries}
		class="p-1.5 text-neutral-400 hover:rounded-sm hover:bg-neutral-800 hover:text-white"
	>
		<Plus class="fill-[currentcolor]" />
	</button>
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
		<button on:click={() => checkEntry(index, 'todo')} class="flex items-center gap-2 px-1 hover:text-white text-neutral-500">
			<Circle class="fill-[currentcolor]" />
			<p class="mb-1">{task.name}</p>
		</button>
	{/each}

	<div class="relative my-3 flex h-[1px] items-center border-neutral-800 bg-neutral-800">
		<button
			on:click={() => (tasks.done = [])}
			class="absolute right-4 mb-1 bg-neutral-950 px-2 text-neutral-700 hover:text-neutral-500"
			>↓ Clear</button
		>
	</div>

	{#each tasks.done as task, index}
		<button on:click={() => checkEntry(index, 'done')} class="flex items-center gap-2 px-1 hover:text-white text-neutral-500">
			<Check class="fill-[currentcolor]" />
			<p class="mb-1 line-through">{task.name}</p>
		</button>
	{/each}
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
