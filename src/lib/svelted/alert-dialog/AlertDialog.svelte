<script lang="ts">
	import { Render } from '@jill64/svelte-sanitize'
	import { closeModal } from './AlertDialogControls';

	export let action;
	export let title: string = 'Are you absolutely sure?';
	export let description: string =
		"This action cannot be undone. This will permanently delete this route and remove it's data from your servers.";
</script>

<div id="popup-modal" class="absolute bottom-0 left-0 right-0 top-0 z-10 hidden opacity-0">
	<div
		id="popup-modal-helper"
		class="mx-auto my-auto flex h-48 w-3/6 flex-col justify-between rounded-lg border border-neutral-800 bg-neutral-950 p-4 shadow-lg transition-transform"
	>
		<div class="flex flex-col space-y-2">
			<h1 class="text-lg font-semibold text-neutral-200">
				<Render html={title} />
			</h1>
			<p class="text-neutral-500" style="text-wrap: balance;">
				<Render html={description} />
			</p>
		</div>
		<div class="ml-auto flex gap-2">
			<button
				on:click={closeModal}
				class="bg-svelted-gray-800 h-10 rounded-sm border px-4 hover:bg-svelted-gray-700"
			>
				Cancel
			</button>
			<button
				on:click={action}
				class="h-10 rounded-sm bg-svelted-primary-700 px-4 hover:bg-svelted-primary-500"
			>
				Continue
			</button>
		</div>
	</div>
</div>

<style>
	#popup-modal {
		transition: ease 0.35s;
		backdrop-filter: blur(2px);
		background: hsla(0, 0%, 0%, 0.5);
	}

	#popup-modal-helper {
		transition: ease 0.35s;
		transform: scale(0.9);
	}
</style>
