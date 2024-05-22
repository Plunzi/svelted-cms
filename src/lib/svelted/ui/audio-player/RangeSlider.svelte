<script lang="ts">
  export let min = 0;
  export let max = 1;
  export let value: number;
  export let step = 0.01;
</script>

<div class="relative flex items-center flex-1">
  <div class="h-2 w-full rounded-sm bg-svelted-gray-700" />
  <div
    class="h-2 rounded-sm bg-svelted-primary-500 absolute"
    style={`width: ${(value * 100) / max}%;`}
  />
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
  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    background: red;
    border-radius: 100%;
    /* scale: 1.5; */
    width: 0px;
    /* @apply w-2 h-2 cursor-pointer; */
    /* @apply w-2 h-2 bg-svelted-primary-500; */
  }
</style>
