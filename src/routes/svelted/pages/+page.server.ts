import { getAllLayouts, getAllLayoutsInformation } from "$lib/svelted/layouts/layouts";
import { getAllPages, getAllPagesInformation } from "$lib/svelted/pages/pages";
import { isInternalPath } from "$lib/svelted/tests/Paths";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    const pages = await getAllPages();
    const pagesData = await getAllPagesInformation(pages);

    const layouts = await getAllLayouts();
    const layoutsData = await getAllLayoutsInformation(layouts);

    let pageLayoutOptions: any[] = [];

    layoutsData.map(layout => {
        const name = layout.description.name;
        const route = layout.description.route;

        if (isInternalPath(route)) {
            return;
        }

        pageLayoutOptions.push({ label: name, value: name.toLowerCase(), selection: route });
    });

    return { pages: pagesData, layouts: pageLayoutOptions };
};