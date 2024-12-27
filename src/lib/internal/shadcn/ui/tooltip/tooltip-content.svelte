<script lang="ts">
	import { Tooltip as TooltipPrimitive } from "bits-ui";
	import { cn, flyAndScale } from "$lib/internal/shadcn/utils.js";

	type $$Props = TooltipPrimitive.ContentProps;

	interface Props {
		class?: $$Props["class"];
		sideOffset?: $$Props["sideOffset"];
		transition?: $$Props["transition"];
		transitionConfig?: $$Props["transitionConfig"];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let {
		class: className = undefined,
		sideOffset = 4,
		transition = flyAndScale,
		transitionConfig = {
		y: 8,
		duration: 150,
	},
		children,
		...rest
	}: Props = $props();
	
</script>

<TooltipPrimitive.Content
	{transition}
	{transitionConfig}
	{sideOffset}
	class={cn(
		"z-50 shadow overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground",
		className
	)}
	style="box-shadow: 0px 2px 10px #1d1d1d !important;"
	{...rest}
>
	{@render children?.()}
</TooltipPrimitive.Content>
