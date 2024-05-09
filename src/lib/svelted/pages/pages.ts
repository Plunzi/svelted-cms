import fs from "node:fs";
import path from "node:path";

export async function getAllPages(directory: string = "data/pages/", relativePath = '/') {
    try {
        const files = await fs.promises.readdir(directory);
        let pageDataFiles: any = [];
        for (const file of files) {
            const filePath = path.join(directory, file);
            const isDirectory = (await fs.promises.stat(filePath)).isDirectory();

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