<script lang="ts">
	import { FastForward, Pause, Play, Repeat, Rewind } from 'phosphor-svelte';

	export let track: string = 'Unnamed Video';
	export let src: string;

	let seekSeconds = 2;
	let videoElement: HTMLVideoElement;

	let video = {
		repeat: false,
		paused: true,
		playbackRate: 1,
		duration: 0
	};

	const togglePaused = () => {
		if (video.paused) {
			videoElement.play();
			video.paused = false;
		} else {
			videoElement.pause();
			video.paused = true;
		}
	};

	const toggleRepeat = () => {
		video.repeat = !video.repeat;

		if (video.paused) {
			video.paused = false;
		}
	};

	const seekBy = (time: number) => {
        console.log(videoElement.currentTime + time);
        videoElement.currentTime = (videoElement.currentTime + time);
        // videoElement.currentTime = ;
	};

	const seekTo = (time: number) => {
        videoElement.pause();
		videoElement.currentTime = time;
        videoElement.play();
	};

	const handlePlaybackSpeedClick = () => {
		if (video.playbackRate == 2) {
			video.playbackRate = 0.25;
		} else {
			video.playbackRate = video.playbackRate + 0.25;
		}
	};
</script>

<div
	style="max-height: calc(100vh - 14.9rem);"
	class="flex w-full min-w-[32rem] max-w-[80%] flex-col items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 shadow-md"
>
	<div class="block w-full rounded-t-xl bg-svelted-gray-800 py-3">
		<p class="text-md text-center font-medium text-neutral-200">{track}</p>
	</div>

	<hr class="w-full border-neutral-800" />

	<video
		id="videoPlayer"
		class="mx-auto h-full bg-black rounded-b-xl"
		{src}
		bind:this={videoElement}
		bind:duration={video.duration}
		bind:paused={video.paused}
		bind:playbackRate={video.playbackRate}
		loop={video.repeat}
        controls
	>
		<track kind="captions" />
	</video>

	<!-- <div class="relative my-3 flex items-center">
		<button
			class="absolute -left-16 z-10 flex min-w-12 items-center justify-center rounded-full bg-svelted-gray-700"
			on:click={toggleRepeat}
		>
			<Repeat
				class={`min-w-6" min-h-6 ${video.repeat ? 'text-svelted-primary-500' : 'text-neutral-500'}`}
			/>
		</button>

		<button
			class="rounded-full p-2 text-neutral-500 hover:bg-svelted-gray-700 hover:text-white"
			on:click={() => seekBy(-1 * seekSeconds)}
		>
			<Rewind weight="fill" class="min-h-6 min-w-6" />
		</button>
		<button
			on:click={togglePaused}
			class="mx-4 flex h-12 w-12 items-center justify-center rounded-full bg-svelted-gray-700 text-neutral-500 hover:bg-svelted-primary-700 hover:text-white"
		>
			{#if video.paused}
				<Play class="min-h-6 min-w-6" weight="fill" />
			{:else}
				<Pause class="min-h-6 min-w-6" weight="fill" />
			{/if}
		</button>

		<button
			class="rounded-full p-2 text-neutral-500 hover:bg-svelted-gray-700 hover:text-white"
			on:click={() => seekBy(seekSeconds)}
		>
			<FastForward class="min-h-6 min-w-6" weight="fill" />
		</button>

		<button
			class="absolute -right-16 flex min-h-6 min-w-12 items-center justify-center rounded-full bg-svelted-gray-700"
			on:click={handlePlaybackSpeedClick}
		>
			<span class="text-sm font-semibold text-white">{video.playbackRate}x</span>
		</button>
	</div> -->
</div>
