<script lang="ts">
	import { cn } from "$lib/internal/shadcn/utils.js";
	import { Popover as PopoverPrimitive } from "bits-ui";

	let {
		ref = $bindable(null),
		class: className,
		sideOffset = 4,
		align = "center",
		portalProps,
		...restProps
	}: PopoverPrimitive.ContentProps & {
		portalProps?: PopoverPrimitive.PortalProps;
	} = $props();
</script>

<PopoverPrimitive.Portal {...portalProps}>
	<PopoverPrimitive.Content
		bind:ref
		{sideOffset}
		{align}
		class={cn(
			"z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
			className
		)}
		{...restProps}
	/>
</PopoverPrimitive.Portal>
