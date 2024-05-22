<script lang="ts">
  import RangeSlider from '$svelted/ui/audio-player/RangeSlider.svelte';

  import { getAudioContext } from '$svelted/ui/audio-player';
  import { toggle } from '$svelted/ui/audio-player/utils';
	import { SpeakerHigh, SpeakerX } from 'phosphor-svelte';

  const { volume, muted } = getAudioContext();

  let volumePercentage = 100;
  $: $volume = volumePercentage / 100;
</script>

<div class="volume flex justify-center w-full relative items-center gap-2" id="volume-control">
  <button on:click={() => toggle(muted)}>
    {#if $muted}
      <SpeakerX class="text-neutral-500" weight="fill" />
    {:else}
      <SpeakerHigh class="text-neutral-500" weight="fill" />
    {/if}
  </button>

  <div class="volume-control w-full origin-left -rotate-90 opacity-0 transition-all translate-y-1">
    <RangeSlider bind:value={volumePercentage} max={100} step={1} />
  </div>
</div>

<style>
  #volume-control:hover > div {
    opacity: 1;
  }
</style>