<script>
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	const flipDurationMs = 300;

	function componentBlocksConsider(e) {
		component_blocks = e.detail.items;
	}
	function layoutBlocksFinalize(e) {
		layout_blocks = e.detail.items;
	}

	function layoutBlocksConsider(e) {
			layout_blocks[0].moved = true;

		layout_blocks = e.detail.items;
	}
	function componentBlocksFinalize(e) {
		component_blocks = e.detail.items;
	}

	let component_blocks = [
		{ id: 1, name: 'Paragraph' },
		{ id: 2, name: 'Heading', moved: false },
		{ id: 3, name: 'List', moved: false },
		{ id: 4, name: 'item4', moved: false }
	];

	let layout_blocks = [
		{ id: 1, name: 'Paragraph', moved: false },
		{ id: 2, name: 'Heading', moved: false }
	];
</script>

<main class="h-full min-h-screen w-full bg-neutral-900">
	<nav class="h-16 border-b border-b-neutral-600 bg-[#121212]">hello world</nav>
	<div class="flex gap-8">
		<nav
			class="h-full-editor flex min-w-[18rem] flex-col gap-2 border-r border-r-neutral-600 bg-[#121212] p-2"
		>
			<div>
				<input
					type="text"
					name=""
					placeholder="Search .."
					class="h-10 w-full min-w-[271.2px] items-center px-2"
					id=""
				/>
			</div>
			<li class="block w-full">
				<div
					style="user-select: none;"
					draggable="true"
					class="relative flex h-10 w-full cursor-grab items-center justify-center text-white !opacity-100 ring-1 ring-neutral-500 hover:bg-[#00342a] hover:ring-[#00e8be] focus:cursor-grabbing"
				>
					Test
				</div>
			</li>
			<ul
				use:dndzone={{ items: component_blocks, flipDurationMs }}
				on:consider={componentBlocksConsider}
				on:finalize={componentBlocksFinalize}
			>
				{#each component_blocks as item (item.id)}
					<li class="block w-full" animate:flip={{ duration: flipDurationMs }}>
						<div
							class="relative flex h-10 w-full cursor-grab items-center justify-center text-white !opacity-100 ring-1 ring-neutral-500 hover:bg-[#00342a] hover:ring-[#00e8be] focus:cursor-grabbing"
						>
							{item.name}
						</div>
					</li>
				{/each}
			</ul>
		</nav>
		<preview-wrapper class="flex-1 bg-neutral-100">
			<div class="bg-lime-500 p-4">Drag here!</div>
			<ul
				use:dndzone={{ items: layout_blocks, flipDurationMs }}
				on:consider={layoutBlocksConsider}
				on:finalize={layoutBlocksFinalize}
			>
				{#each layout_blocks as block, index (block.id)}
					<li class="relative bg-purple-500 py-5 {block.moved ? 'bg-yellow-500' : ''}">
						<p class="bg-red-600 py-10">Block: {block.id}</p>
						<div class="my-2 flex items-center">
							<button
								draggable="false"
								class="absolute z-10 left-0 right-0 flex h-4 items-center justify-center overflow-hidden bg-blue-400 transition-all hover:h-10"
							>
								<span>Add Content +</span>
							</button>
						</div>
					</li>
				{/each}
			</ul>
		</preview-wrapper>
		<control-wrapper class="h-full-editor min-w-[20rem] border-l border-l-neutral-600 bg-[#121212]">
			<ul>
				<li>1</li>
				<li>2</li>
				<li>3</li>
				<li>4</li>
				<li>6</li>
			</ul>
		</control-wrapper>
	</div>
</main>

<style>
	.h-full-editor {
		min-height: calc(100vh - 4rem);
	}
</style>
