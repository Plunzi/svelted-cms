<script lang="ts">
	import {
		Download,
		MagnifyingGlassMinus,
		Minus,
		Plus,
		Printer,
		Star
	} from 'phosphor-svelte';
	import AudioPlayer from '$svelted/ui/audio-player/AudioPlayer.svelte';
	import Player from '$svelted/ui/audio-player/Player.svelte';
	import VideoPlayer from '$svelted/ui/video-player/VideoPlayer.svelte';
	import getFileIcons from '$svelted/functions/format/fileicon';
	const fileIcons = getFileIcons();

	interface Client {
		hoverOver: undefined | string;
		sidebar: boolean;
	}

	const hoverOver = function (element: string | undefined) {
		client.hoverOver = element;
	};

	let scale = 1;

	const decreaseFileDisplay = () => {
		if (scale >= 0.3) {
			scale -= 0.1;
		}
	};

	const increaseFileDisplay = () => {
		if (scale <= 5) {
			scale += 0.1;
		}
	};

	const handleScroll = async function (e: WheelEvent) {
		console.log(e);

		if (e.deltaY > 0) {
			decreaseFileDisplay();
			return;
		}
		if (e.deltaY < 0) {
			increaseFileDisplay();
			return;
		}
	};

	function getSvgPath(extension: string): string {
		const svgPath = fileIcons[extension];
		if (!svgPath) {
			return '/file-icons/unknown';
		}
		return svgPath;
	}

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

	export let file: File;
	const validExtensions = {
		image: ['svg', 'png', 'jpeg', 'jpg', 'gif', 'bmp'],
		audio: ['wav', 'mp3', 'aac', 'adts', 'ogg', 'opus', 'caf', 'flac'],
		video: ['mp4', 'webm', '3gp', 'mpeg', 'mpg', 'mov', 'ogv']
	};

	let client: Client = {
		hoverOver: undefined,
		sidebar: false
	};

	// onMount(async () => {
	// 	window.addEventListener('wheel', handleScroll);
	// });
</script>

<section class="flex-grow w-full h-full flex flex-col relative">
	<div class="h-full flex flex-col flex-grow rounded-md pt-2">
		{#if validExtensions.image.includes(file.extension)}
			<div class="relative m-auto w-full h-full">
				<div
					class="absolute left-1 top-1 z-10 flex h-12 w-fit rounded-full border bg-neutral-950 px-1 py-1 text-neutral-500 shadow-lg"
				>
					<button
						on:mouseenter={() => hoverOver('tool-print')}
						on:mouseleave={() => hoverOver(undefined)}
						class="grid h-10 w-10 items-center justify-center rounded-full hover:bg-svelted-gray-700 hover:text-white"
					>
						{#if client.hoverOver == 'tool-print'}
							<Printer class="h-5 w-5 fill-[currentcolors]" weight="fill" />
						{:else}
							<Printer class="h-5 w-5 fill-[currentcolors]" />
						{/if}
					</button>
					<a
						download
						href={`/sv-content${file.path}`}
						on:mouseenter={() => hoverOver('tool-download')}
						on:mouseleave={() => hoverOver(undefined)}
						class="grid h-10 w-10 items-center justify-center rounded-full hover:bg-svelted-gray-700 hover:text-white"
					>
						{#if client.hoverOver == 'tool-download'}
							<Download class="h-5 w-5 fill-[currentcolors]" weight="fill" />
						{:else}
							<Download class="h-5 w-5 fill-[currentcolors]" />
						{/if}
					</a>
					<button
						on:mouseenter={() => hoverOver('tool-star')}
						on:mouseleave={() => hoverOver(undefined)}
						class="grid h-10 w-10 items-center justify-center rounded-full hover:bg-svelted-gray-700 hover:text-white"
					>
						{#if client.hoverOver == 'tool-star'}
							<Star class="h-5 w-5 fill-[currentcolors]" weight="fill" />
						{:else}
							<Star class="h-5 w-5 fill-[currentcolors]" />
						{/if}
					</button>
				</div>
				<div
					class="absolute right-1 top-1 z-10 flex w-fit rounded-full border bg-neutral-950 px-1 py-1 text-neutral-500 shadow-lg"
				>
					<button
						on:mouseenter={() => hoverOver('tool-zoom-in')}
						on:mouseleave={() => hoverOver(undefined)}
						on:click={() => {
							increaseFileDisplay();
							increaseFileDisplay();
						}}
						class="grid h-10 w-10 items-center justify-center rounded-full hover:bg-svelted-gray-700 hover:text-white"
					>
						{#if client.hoverOver == 'tool-zoom-in'}
							<Plus class="h-5 w-5 fill-[currentcolors]" weight="bold" />
						{:else}
							<Plus class="h-5 w-5 fill-[currentcolors]" />
						{/if}
					</button>
					<button
						on:mouseenter={() => hoverOver('tool-zoom-back')}
						on:mouseleave={() => hoverOver(undefined)}
						on:click={() => {
							scale = 1;
						}}
						class="grid h-10 w-10 items-center justify-center rounded-full hover:bg-svelted-gray-700 hover:text-white"
						class:bg-svelted-gray-700={scale === 1}
					>
						{#if client.hoverOver == 'tool-zoom-back'}
							<MagnifyingGlassMinus class="h-5 w-5 fill-[currentcolors]" weight="fill" />
						{:else}
							<MagnifyingGlassMinus class="h-5 w-5 fill-[currentcolors]" />
						{/if}
					</button>
					<button
						on:mouseenter={() => hoverOver('tool-zoom-out')}
						on:mouseleave={() => hoverOver(undefined)}
						on:click={() => {
							decreaseFileDisplay();
							decreaseFileDisplay();
						}}
						class="grid h-10 w-10 items-center justify-center rounded-full hover:bg-svelted-gray-700 hover:text-white"
					>
						{#if client.hoverOver == 'tool-zoom-out'}
							<Minus class="h-5 min-w-5 fill-[currentcolors]" weight="bold" />
						{:else}
							<Minus class="h-5 min-w-5 fill-[currentcolors]" />
						{/if}
					</button>
				</div>
				<div class="flex h-full w-full overflow-hidden rounded-md">
					<img
						on:wheel={handleScroll}
						id="file-preview"
						style="transform: scale({scale ||
							1}); transition: ease 0.1s; max-height: calc(100vh - 14.9rem);"
						class="img-preview m-auto h-full"
						src={`/sv-content${file.path}`}
						alt={'file-icon-preview'}
					/>
				</div>
			</div>
		{:else if validExtensions.audio.includes(file.extension)}
			<div class="flex h-full w-full items-center justify-center relative">
				<div
					class="absolute left-1 top-1 z-10 flex h-12 w-fit rounded-full border bg-neutral-950 px-1 py-1 text-neutral-500 shadow-lg"
				>
					<a
						download
						href={`/sv-content${file.path}`}
						on:mouseenter={() => hoverOver('tool-download')}
						on:mouseleave={() => hoverOver(undefined)}
						class="grid h-10 w-10 items-center justify-center rounded-full hover:bg-svelted-gray-700 hover:text-white"
					>
						{#if client.hoverOver == 'tool-download'}
							<Download class="h-5 w-5 fill-[currentcolors]" weight="fill" />
						{:else}
							<Download class="h-5 w-5 fill-[currentcolors]" />
						{/if}
					</a>
					<button
						on:mouseenter={() => hoverOver('tool-star')}
						on:mouseleave={() => hoverOver(undefined)}
						class="grid h-10 w-10 items-center justify-center rounded-full hover:bg-svelted-gray-700 hover:text-white"
					>
						{#if client.hoverOver == 'tool-star'}
							<Star class="h-5 w-5 fill-[currentcolors]" weight="fill" />
						{:else}
							<Star class="h-5 w-5 fill-[currentcolors]" />
						{/if}
					</button>
				</div>
				<AudioPlayer src={`/sv-content${file.path}`}>
					<Player track={file.name} />
				</AudioPlayer>
			</div>
		{:else if validExtensions.video.includes(file.extension)}
			<div class="flex flex-grow h-full w-full items-center justify-center relative">
				<div
					class="absolute left-1 top-1 z-10 flex h-12 w-fit rounded-full border bg-neutral-950 px-1 py-1 text-neutral-500 shadow-lg"
				>
					<a
						download
						href={`/sv-content${file.path}`}
						on:mouseenter={() => hoverOver('tool-download')}
						on:mouseleave={() => hoverOver(undefined)}
						class="grid h-10 w-10 items-center justify-center rounded-full hover:bg-svelted-gray-700 hover:text-white"
					>
						{#if client.hoverOver == 'tool-download'}
							<Download class="h-5 w-5 fill-[currentcolors]" weight="fill" />
						{:else}
							<Download class="h-5 w-5 fill-[currentcolors]" />
						{/if}
					</a>
					<button
						on:mouseenter={() => hoverOver('tool-star')}
						on:mouseleave={() => hoverOver(undefined)}
						class="grid h-10 w-10 items-center justify-center rounded-full hover:bg-svelted-gray-700 hover:text-white"
					>
						{#if client.hoverOver == 'tool-star'}
							<Star class="h-5 w-5 fill-[currentcolors]" weight="fill" />
						{:else}
							<Star class="h-5 w-5 fill-[currentcolors]" />
						{/if}
					</button>
				</div>
				<VideoPlayer track={file.name} src={`/sv-content${file.path}`} />
			</div>
		{:else}
			<div class="flex h-full w-full items-center justify-center relative">
				<div
					class="absolute left-1 top-1 z-10 flex h-12 w-fit rounded-full border bg-neutral-950 px-1 py-1 text-neutral-500 shadow-lg"
				>
					<button
						on:mouseenter={() => hoverOver('tool-star')}
						on:mouseleave={() => hoverOver(undefined)}
						class="grid h-10 w-10 items-center justify-center rounded-full hover:bg-svelted-gray-700 hover:text-white"
					>
						{#if client.hoverOver == 'tool-star'}
							<Star class="h-5 w-5 fill-[currentcolors]" weight="fill" />
						{:else}
							<Star class="h-5 w-5 fill-[currentcolors]" />
						{/if}
					</button>
				</div>
				<div class="flex flex-col">
					<img src={`${getSvgPath(file.extension)}.svg` || "/file-icons/unknown.svg"} class="h-32 w-32 mx-auto" alt={"file-icon-preview"}>
					<h1 class="mb-4 text-xl text-center font-semibold text-neutral-200">{file.name}</h1>
					<p>Für diese Datei scheint es keine Vorschau zu geben, die wir Ihnen zeigen können.</p>
					<a
						download
						href={`/sv-content${file.path}`}
						on:mouseenter={() => hoverOver('tool-download')}
						on:mouseleave={() => hoverOver(undefined)}
						class="flex h-10 items-center gap-2 rounded-sm mx-auto bg-svelted-primary-700 px-4 hover:bg-svelted-primary-500 w-fit"
					>
						{#if client.hoverOver == 'tool-download'}
							<Download class="h-5 w-5 fill-[currentcolors]" weight="fill" />
						{:else}
							<Download class="h-5 w-5 fill-[currentcolors]" />
						{/if}
						Download
					</a>
				</div>
			</div>
		{/if}
	</div>
</section>

<style>
	button:focus-visible {
		fill: white !important;
		outline: solid 1.5px #36bf68;
		background: #0a2620;
		outline-offset: -1.5px;
	}

	::-webkit-scrollbar-track {
		background-color: transparent !important;
		width: 25px !important;
	}

	::-webkit-scrollbar-thumb {
		background-color: #27272a !important;
		border-radius: 20px !important;
		border: 6px solid transparent !important;
		background-clip: content-box !important;
	}

	::-webkit-scrollbar-thumb:hover {
		background-color: #36bf68 !important;
	}

	::-webkit-scrollbar-corner {
		background: transparent;
	}

	.img-preview {
		border: solid 1px #262626;
		background-color: #0a0a0a;
		border-radius: 0.25rem;
		background-image: linear-gradient(
				45deg,
				#161616 25%,
				transparent 25%,
				transparent 75%,
				#161616 75%,
				#161616
			),
			linear-gradient(45deg, #161616 25%, transparent 25%, transparent 75%, #161616 75%, #161616);
		background-position:
			0 0,
			10px 10px;
		background-size: 21px 21px;
		box-shadow: 0px 4px 15px 2px rgba(0, 0, 0, 0.35);
		-webkit-user-select: none;
		user-select: none;
		-webkit-user-drag: none;
	}
</style>
