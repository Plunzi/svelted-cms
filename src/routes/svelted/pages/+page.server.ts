import { getAllPages } from "$lib/svelted/pages/pages";
import type { PageServerLoad } from "./$types";

import fs from "node:fs/promises";

async function processPages(pages: any) {
    const pagesData = [];
    for (const page of pages) {
        try {
            const pageData = await fs.readFile(`data/pages${page}/page.json`, { encoding: 'utf8' });
            let pageText = await JSON.parse(pageData);
            pageText.route = page;
            pagesData.push(pageText);
        } catch (error) {
            console.error(`Error reading file for page ${page}:`, error);
        }
    }
    return pagesData;
}

export const load: PageServerLoad = async () => {
    const pages = await getAllPages();
    const pagesData = await processPages(pages);

    // this route will be dynamically picked! for example "/route/any"
    return { pages: pagesData};
};