<script lang="ts">
	interface ComponentData {
		class: string | undefined;
		content: {};
	}
	export let data: ComponentData;

	if (data == undefined) {
		data = {
			class: 'undefined',
			content: {}
		};
	}
</script>

<div class={`${data.class || ""} h-[50rem] w-full bg-red-500`}></div>
