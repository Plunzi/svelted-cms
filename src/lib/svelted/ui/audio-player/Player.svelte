<script lang="ts">
	import { getAudioContext } from '$svelted/ui/audio-player/context';
	import { toggle, toHHMMSS } from '$svelted/ui/audio-player/utils';
	import { FastForward, Pause, Play, Repeat, Rewind } from 'phosphor-svelte';
	import RangeSlider from './RangeSlider.svelte';
	import VolumeControl from './VolumeControl.svelte';

	interface Props {
		track?: string;
	}

	let { track = 'Unnamed Music Track' }: Props = $props();

	const SEEK_SECONDS = 10;
	const PLAYBACK_SPEEDS = [1, 1.25, 1.5, 1.75, 2, 0.25, 0.5, 0.75];

	const { playing, playbackRate, paused, repeat, seekBy, currentTime, duration } = getAudioContext();
	let speedIndex = 0;

	const handlePlaybackSpeedClick = () => {
		$playbackRate = PLAYBACK_SPEEDS[++speedIndex % PLAYBACK_SPEEDS.length];
	};
</script>

<div
	class="flex w-full flex-col items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 min-w-[32rem] shadow-md"
>
	<div class="py-3 block bg-svelted-gray-800 w-full rounded-t-xl">
		<p class="text-center text-md font-medium text-neutral-200">{track}</p>
	</div>

  <hr class="w-full border-neutral-800">

	<div class="relative flex items-center my-3">
		<button
			class="absolute -left-16 z-10 flex min-w-12 items-center justify-center rounded-full bg-svelted-gray-700"
			onclick={() => toggle(repeat)}
		>
			<Repeat
				class={`min-w-6" min-h-6 ${$repeat ? 'text-svelted-primary-500' : 'text-neutral-500'}`}
			/>
		</button>

		<button
			class="rounded-full p-2 text-neutral-500 hover:bg-svelted-gray-700 hover:text-white"
			onclick={() => seekBy(-1 * SEEK_SECONDS)}
		>
			<Rewind weight="fill" class="min-h-6 min-w-6" />
		</button>
		<button
			onclick={() => toggle(paused)}
			class="mx-4 flex h-12 w-12 items-center justify-center rounded-full bg-svelted-gray-700 text-neutral-500 hover:bg-svelted-primary-700 hover:text-white"
		>
			{#if $playing}
				<Pause class="min-h-6 min-w-6" weight="fill" />
			{:else}
				<Play class="min-h-6 min-w-6" weight="fill" />
			{/if}
		</button>

		<button
			class="rounded-full p-2 text-neutral-500 hover:bg-svelted-gray-700 hover:text-white"
			onclick={() => seekBy(SEEK_SECONDS)}
		>
			<FastForward class="min-h-6 min-w-6" weight="fill" />
		</button>

		<button
			class="absolute -right-16 flex min-h-6 min-w-12 items-center justify-center rounded-full bg-svelted-gray-700"
			onclick={handlePlaybackSpeedClick}
		>
			<span class="text-sm font-semibold text-white">{$playbackRate}x</span>
		</button>
	</div>

  <div class="w-64 relative">
		<RangeSlider max={$duration} bind:value={$currentTime} />
    <div class="mt-3 absolute -right-[5.5rem] bottom-10 items-center justify-center">
      <div class="flex gap-2">
        <div class="flex w-20">
          <VolumeControl />
        </div>
      </div>
    </div>
    <div class="flex justify-between mb-6">
      <span class="text-sm text-neutral-600">{toHHMMSS($currentTime)}</span>
      {#if $duration !== Infinity}
        <span class="text-sm text-neutral-600">{toHHMMSS($duration)}</span>
      {:else}
        <span class="text-sm text-neutral-600">unknown</span>
      {/if}
    </div>
	</div>
</div>

<style lang="postcss">
	:global(.icon-4) {
		@apply h-4 w-4;
	}
</style>
