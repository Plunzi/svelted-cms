import fs from 'node:fs/promises';

import type { PageServerLoad } from './$types';
import { getAllLayouts, getAllLayoutsInformation } from '$lib/svelted/layouts/layouts';

export const load: PageServerLoad = async () => {
    // this route will be dynamically picked! for example "/route/any"
    // let savedData = await fs.promises.readFile('data/layouts/landing/layout.json', { encoding: 'utf8' });
    // const data = await JSON.parse(savedData);

    const layouts = await getAllLayouts();
    const layoutData = await getAllLayoutsInformation(layouts);

    const savedData = await fs.readFile(`data/layouts/${layouts[1]}/layout.json`, { encoding: 'utf8' });
    const data = await JSON.parse(savedData);

    return {
        layouts: layoutData,
        page: {
            name: data.description.name,
            route: data.description.route,
            // updated: data.descripton.updated,
            content: data.content
        }
    };
};