import fs from 'node:fs/promises';

import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

function isValidURL(url: string) {
    if (url == "/") {
        return true;
    } else {
        var pattern = /[a-zA-Z0-9\-_~:/?#[\]@!$&'()*+,;=.]+$/;
        return pattern.test(url);
    }
}

export const load: PageServerLoad = async ({ params }) => {
    const navigatedRoute = params.path;
    
    if (!isValidURL(navigatedRoute)) {
        error(404, {
            message: 'Invalid url',
        });
    }

    let page;

    try {
        // check if page exists
        const storedPageData = await fs.readFile(`data/pages/${navigatedRoute}/page.json`, { encoding: 'utf8' });
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

        if (parsedPageData.layout == 'none') {
            const notfoundData = await fs.readFile(`data/layouts/svelted/nolayout/layout.json`, { encoding: 'utf8' });
            page = await JSON.parse(notfoundData);

            return {
                page: {
                    name: page.description.name,
                    route: page.description.route,
                    content: page.content
                }
            };
        }

        // if exists try loading page layout
        const localData = await fs.readFile(`data/layouts/${parsedPageData.layout}/layout.json`, { encoding: 'utf8' });
        page = await JSON.parse(localData);
    } catch (error) {
        const notfoundData = await fs.readFile(`data/layouts/svelted/notfound/layout.json`, { encoding: 'utf8' });
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