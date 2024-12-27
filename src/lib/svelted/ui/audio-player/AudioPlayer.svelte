<script lang="ts">
	import { onMount, } from 'svelte';
	import { setAudioContext } from './context';
	import { derived, writable, type Writable } from 'svelte/store';

	

	interface Props {
		/**
	 * Props
	 */
		src: string;
		children?: import('svelte').Snippet;
	}

	let { src, children }: Props = $props();
	/**
	 * States
	 */

	let prevSrc: undefined | string = $state(undefined);

	let duration = writable(Infinity);
	let currentTime = writable(0);
	let volume = writable(1);
	let muted = writable(false);
	let ended = writable(false);
	let repeat = writable(false);
	let playbackRate = writable(1);
	let paused = writable(true);
	let playing = derived(paused, ($paused) => !$paused);

	let audio: HTMLAudioElement | undefined = $state();

	/**
	 * Reactives
	 */

	$effect(() => {
		if (prevSrc !== src) {
			// fix $paused store not sync with audio.paused on src props change
			setTimeout(() => {
				if ($paused) {
					audio?.pause();
				} else {
					audio?.play();
				}
			}, 0);
		}

		prevSrc = src;
	});

	async function fetchFullAudio(url: string) {
		try {
			const response = await fetch(url);
			const blob = await response.blob();
			const audioUrl = URL.createObjectURL(blob);

			const audioElement = document.getElementById("audioplayer-element") as HTMLAudioElement;

			audioElement.src = audioUrl;
			console.log(blob);
			console.log(audioElement.duration);
		} catch (error) {
			console.error('Error fetching and processing the audio file:', error);
		}
	}

	/**
	 * Mounted
	 */
	onMount(() => {
		audio = document.getElementById('audioplayer-element') as HTMLAudioElement;
		$duration = audio?.duration;

		fetchFullAudio(src);
	});

	/**
	 * Methods
	 */

	const seekBy = (n: number) => {
		$currentTime += n;
	};

	const seekTo = (t: number) => {
		$currentTime = t;
	};

	const handleNewDuration = (e: Event) => {
		$duration == audio?.duration;
	};

	/**
	 * Context
	 */

	setAudioContext({
		currentTime,
		repeat,
		duration,
		playing,
		volume,
		muted,
		ended,
		paused,
		playbackRate,
		seekBy,
		seekTo
	});
</script>

<div>
	<audio
		id="audioplayer-element"
		oncanplaythrough={handleNewDuration}
		bind:volume={$volume}
		bind:duration={$duration}
		bind:currentTime={$currentTime}
		bind:muted={$muted}
		bind:paused={$paused}
		bind:ended={$ended}
		bind:playbackRate={$playbackRate}
		loop={$repeat}
		bind:this={audio}
		{src}
		style="display: none;"
	></audio>

	{@render children?.()}
</div>
