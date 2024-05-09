import { getAllPages, getAllPagesInformation } from "$lib/svelted/pages/pages";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const pages = await getAllPages();
    const pagesData = await getAllPagesInformation(pages);

    // this route will be dynamically picked! for example "/route/any"
    return { pages: pagesData};
};