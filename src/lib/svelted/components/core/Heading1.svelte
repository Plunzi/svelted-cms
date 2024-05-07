<script lang="ts">
    interface ComponentData {
        class: string | undefined,
        content: string | undefined
    }
    export let data: ComponentData;
</script>
<h1 contenteditable bind:textContent={data.content} class={`${data.class || "text-black text-2xl"} text-left focus:outline-none`}>{data.content}</h1>