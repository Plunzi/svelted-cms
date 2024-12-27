<script lang="ts">
	import { Avatar as AvatarPrimitive } from 'bits-ui';
	import { cn } from '$lib/internal/shadcn/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: AvatarPrimitive.FallbackProps = $props();
</script>

c<AvatarPrimitive.Fallback
	bind:ref
	class={cn('flex h-full w-full items-center justify-center rounded-full bg-muted', className)}
	{...restProps}
/>
