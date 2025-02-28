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
<p contenteditable bind:textContent={data.content} class={`${data.class || "text-black text-lg"} text-left focus:outline-none`}>{data.content}</p>