<script lang="ts">
    interface ComponentData {
        class: string | undefined,
        content: string | undefined
    }
    interface Props {
        data: ComponentData;
    }

    let { data = $bindable() }: Props = $props();
</script>
<h1 contenteditable bind:textContent={data.content} class={`${data.class || "text-black text-2xl"} text-left focus:outline-none`}>{data.content}</h1>