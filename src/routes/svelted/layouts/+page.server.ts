import { getAllLayouts, getAllLayoutsInformation } from "$svelted/functions/layouts/layouts";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const layouts = await getAllLayouts();
    const layoutsData = await getAllLayoutsInformation(layouts);

    // this route will be dynamically picked! for example "/route/any"
    return { layouts: layoutsData};
};