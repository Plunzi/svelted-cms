<script lang="ts">
	import FileDisplay from '$svelted/ui/file-display/FileDisplay.svelte';

	interface Props {
		file: File | undefined;
	}

	let { file = $bindable() }: Props = $props();

	let popupModal: HTMLElement | undefined = $state();
	let popupModalHelper: HTMLElement | undefined = $state();

	interface File {
		path: string;
		name: string;
		author: string;
		extension: string;
		size: number;
		description: string | undefined;
		modified: number;
		created: number;
	}

	const closeModal = async () => {
		popupModal!.style.opacity = '0';
		popupModalHelper!.style.transform = 'scale(0.9)';

		setTimeout(() => {
			popupModal!.style.display = 'none';
			file = undefined;
		}, 250);
	};

	const openFileOverlay = async () => {
		popupModal!.style.display = 'grid';
		setTimeout(() => {
			popupModal!.style.opacity = '1';
			popupModalHelper!.style.transform = 'scale(1)';
		}, 50);
	};

    const openCurrentFile = () => {
        if (!file) {
            return;
        }

        window.location.href = `/svelted/media${file.path}`;
    }

    const handleKeydown = async (e: KeyboardEvent) => {
        if (!file) {
            return;
        }

        if (e.key == "Escape") {
            closeModal();
        }
    }

	$effect(() => {
		if (file !== undefined) {
			setTimeout(() => {
				openFileOverlay();
			}, 1);
		}
	});
</script>

<svelte:window onkeydown={handleKeydown}></svelte:window>

{#if file}
    <section
		bind:this={popupModal}
		class="popup-modal absolute bottom-0 left-0 right-0 top-0 z-10 grid hidden p-32 opacity-0"
	>
		<div
			bind:this={popupModalHelper}
			class="popup-modal-helper mx-auto my-auto flex h-full min-h-48 w-3/6 w-full flex-col justify-between rounded-lg border border-neutral-800 bg-neutral-950 p-4 shadow-lg transition-transform"
		>
			<div class="w-full h-full">
				<FileDisplay {file} close={closeModal} link={openCurrentFile} />
			</div>
		</div>
	</section>
{/if}

<style>
	.popup-modal {
		transition: ease 0.35s;
		backdrop-filter: blur(2px);
		background: hsla(0, 0%, 0%, 0.5);
	}

	.popup-modal-helper {
		transition: ease 0.35s;
		transform: scale(0.9);
	}
</style>
