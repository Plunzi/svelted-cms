import BLOCK_Paragraph from '$lib/svelted/components/core/Paragraph.svelte';
import BLOCK_Heading1 from '$lib/svelted/components/core/Heading1.svelte';
import BLOCK_Navigation from '$lib/svelted/components/custom/Navigation.svelte';
import BLOCK_OverflowY from '$lib/svelted/components/tests/OverflowYComponent.svelte';
import BLOCK_Row from '$lib/svelted/components/tests/Row.svelte';

interface ComponentMap {
    [key: string]: any;
}

export default  {
    BLOCK_Paragraph,
    BLOCK_Heading1,
    BLOCK_Navigation,
    BLOCK_OverflowY,
    BLOCK_Row,
} as ComponentMap