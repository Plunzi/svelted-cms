import fs from "node:fs/promises";
import path from "node:path";

export async function getAllPages(directory: string = "data/pages/", relativePath = '/') {
    try {
        const files = await fs.readdir(directory);
        let pageDataFiles: any = [];
        for (const file of files) {
            const filePath = path.join(directory, file);
            const isDirectory = (await fs.stat(filePath)).isDirectory();

            if (isDirectory) {
                const subdirectoryRelativePath = path.join(relativePath, file);
                const subdirectoryFiles = await getAllPages(filePath, subdirectoryRelativePath);
                pageDataFiles = pageDataFiles.concat(subdirectoryFiles);
            } else if (file.endsWith('page.json')) {
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

export async function getAllPagesInformation(pages: any): Promise<Array<any>> {
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