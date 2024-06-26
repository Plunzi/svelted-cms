import fs from 'node:fs/promises';
import path from 'node:path';

import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    let page;

    try {
        // check if page exists
        const storedPageData = await fs.readFile(`data/pages/page.json`, { encoding: 'utf8' });
        const parsedPageData = await JSON.parse(storedPageData);

        if (!parsedPageData) {
            error(404, {
                message: 'Page empty',
            });
        }

        if (!parsedPageData.layout) {
            error(404, {
                message: 'Page features no layout',
            });
        }

        // if exists try loading page layout
        const localData = await fs.readFile(`data/layouts/${parsedPageData.layout}/layout.json`, { encoding: 'utf8' });
        page = await JSON.parse(localData);
    } catch (error) {
        const notfoundData = await fs.readFile(`data/layouts/404/layout.json`, { encoding: 'utf8' });
        page = await JSON.parse(notfoundData);
    }

    return {
        page: {
            name: page.description.name,
            route: page.description.route,
            content: page.content
        }
    };
};