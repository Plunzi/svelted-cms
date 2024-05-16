import fs from 'node:fs/promises';

import type { PageServerLoad } from './$types';
import { getAllLayouts, getAllLayoutsInformation } from '$svelted/functions/layouts/layouts';

export const load: PageServerLoad = async ({ url }) => {
    const layouts = await getAllLayouts();
    const layoutData = await getAllLayoutsInformation(layouts);

    const editPage = url.searchParams.get('currentpage') || layouts[0];

    const savedData = await fs.readFile(`data/layouts/${editPage}/layout.json`, { encoding: 'utf8' });
    const data = await JSON.parse(savedData);

    return {
        layouts: layoutData,
        page: {
            name: data.description.name,
            route: data.description.route,
            created: data.description.created,
            content: data.content,
        }
    };
};