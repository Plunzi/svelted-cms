import fs from 'node:fs';
import path from 'node:path';

import type { PageServerLoad } from './$types';
import { getAllPages } from '$lib/svelted/pages/pages';

export const load: PageServerLoad = async () => {
    // this route will be dynamically picked! for example "/route/any"
    let savedData = await fs.promises.readFile('data/layouts/landing/layout.json', { encoding: 'utf8' });
    const data = await JSON.parse(savedData);

    const pages = await getAllPages();
    
    // console.log("All layouts:");
    // console.log(layouts);
    // console.log("Saved data:");
    // console.log(data);

    return {
        layouts: pages,
        page: {
            name: data.description.name,
            route: data.description.route,
            // updated: data.descripton.updated,
            content: data.content
        }
    };
};