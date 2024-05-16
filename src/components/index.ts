import BLOCK_Paragraph from '$components/core/Paragraph.svelte';
import BLOCK_Heading1 from '$components/core/Heading1.svelte';
import BLOCK_Navigation from '$components/custom/Navigation.svelte';
import BLOCK_OverflowY from '$components/tests/OverflowYComponent.svelte';
import BLOCK_Row from '$components/tests/Row.svelte';

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