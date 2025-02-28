<script lang="ts" module>
	const _expansionState: { [key: string]: boolean } = {};
</script>

<script lang="ts">
	import FileTree from './FileTree.svelte';
	type TreeNode = {
		label: string;
		children?: TreeNode[];
	};

	interface Props {
		tree: TreeNode;
		level?: number;
		treeRoute?: string;
	}

	let { tree, level = 0, treeRoute = $bindable('') }: Props = $props();

	import { CaretDown, File, Folder, FolderOpen } from 'phosphor-svelte';
	import { slide } from 'svelte/transition';
	const { label, children } = tree;

    if (label === '') {
        treeRoute += ``;
    } else {
        treeRoute += `/${label}`;
    }

	let expanded: boolean = $state(_expansionState[label] || true);
	const toggleExpansion = () => {
		expanded = _expansionState[label] = !expanded;
	};
</script>

<ul transition:slide class="{level == 0 || level == 1 ? "" : "pl-4 border-l border-neutral-800"} {level % 2 === 1 ? '' : 'bg-[]'}">
	<li class="bg-neutral-950 text-neutral-600">
		{#if children}
            {#if label != ''}
			<div
				class="flex items-center gap-1 rounded-md hover:bg-neutral-900 px-2 py-0.5 text-neutral-500 hover:text-neutral-200"
			>
                <button onclick={toggleExpansion} class="flex items-center gap-1">
                    <CaretDown class="transition-all" style={expanded ? '' : 'transform: rotate(-90deg);'} />
                    {#if expanded}
                        <FolderOpen color="currentcolor" weight="fill" />
                    {:else}
                        <Folder color="currentcolor" weight="fill" />
                    {/if}
                </button>
                <a data-sveltekit-reload="true" href={treeRoute}>
                    {label}
                </a>
			</div>
            {/if}
			{#if expanded}
				{#each children as child}
					<FileTree tree={child} treeRoute={treeRoute} level={level + 1} />
				{/each}
			{/if}
		{:else}
			<a data-sveltekit-reload="true" href={treeRoute} class="flex items-center gap-1 hover:text-neutral-200 rounded-md hover:bg-[#0a2620] w-fit outline-svelted-primary-500 px-1 outline-1 hover:outline">
                <File/>
				{label}
			</a>
		{/if}
	</li>
</ul>
