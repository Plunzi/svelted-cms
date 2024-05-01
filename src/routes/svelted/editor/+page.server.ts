import fs from 'node:fs';
import path from 'node:path';

import type { PageServerLoad } from './$types';

async function getAllRoutes(directory: string, relativePath = '/') {
    try {
        const files = await fs.promises.readdir(directory);
        let pageDataFiles: any = [];
        for (const file of files) {
            const filePath = path.join(directory, file);
            const isDirectory = (await fs.promises.stat(filePath)).isDirectory();

            if (isDirectory) {
                const subdirectoryRelativePath = path.join(relativePath, file);
                const subdirectoryFiles = await getAllRoutes(filePath, subdirectoryRelativePath);
                pageDataFiles = pageDataFiles.concat(subdirectoryFiles);
            } else if (file.endsWith('page.data.json')) {
                // Replace backslashes with forward slashes (if user is on windows)
                const route = relativePath.replace(/\\/g, '/');
                pageDataFiles.push(route);
            }
        }
        return pageDataFiles;
    } catch (error) {
        console.error(`Error reading directory ${directory}:`, error);
        return [];
    }
}

export const load: PageServerLoad = async () => {
    let savedData = await fs.promises.readFile('src/lib/svelted/data/page.data.json', { encoding: 'utf8' });
    const data = await JSON.parse(savedData);

    const routes = await getAllRoutes('src/lib/svelted/data/');
    console.log(routes);

    return {
        routes: routes,
        page: {
            name: data.description.name,
            route: data.description.route,
            // updated: data.descripton.updated,
            content: data.content
        }
    };
};