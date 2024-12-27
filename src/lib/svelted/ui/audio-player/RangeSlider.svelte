<script lang="ts">
  interface Props {
    min?: number;
    max?: number;
    value: number;
    step?: number;
  }

  let {
    min = 0,
    max = 1,
    value = $bindable(),
    step = 0.01
  }: Props = $props();
</script>

<div class="relative flex items-center flex-1 rounded-sm overflow-hidden outline outline-1 outline-neutral-800">
  <div class="h-2 w-full rounded-sm"></div>
  <div
    class="h-2 bg-gradient-to-r from-emerald-500 to-svelted-primary-500 absolute"
    style={`width: ${(value * 100) / max}%;`}
></div>
  <input
    bind:value
    {min}
    {max}
    {step}
    type="range"
    class="w-full absolute h-2 appearance-none bg-transparent outline-none"
  />
</div>

<style>
  input[type='range']::-webkit-slider-thumb, input[type='range']::-moz-range-thumb {
    -webkit-appearance: none;
    -moz-appearance: none;
    background: #2dbe6e;
    border-color: #2dbe6e;
    border-radius: 100%;
    /* scale: 1.5; */
    width: 0px;
    /* @apply w-2 h-2 cursor-pointer; */
    /* @apply w-2 h-2 bg-svelted-primary-500; */
  }
</style>
