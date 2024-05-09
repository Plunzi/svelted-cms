import fs from "node:fs/promises";
import path from "node:path";

export async function getAllLayouts(directory: string = "data/layouts/", relativePath = '/') {
    try {
        const files = await fs.readdir(directory);
        let layoutDataFiles: any = [];
        for (const file of files) {
            const filePath = path.join(directory, file);
            const isDirectory = (await fs.stat(filePath)).isDirectory();

            if (isDirectory) {
                const subdirectoryRelativePath = path.join(relativePath, file);
                const subdirectoryFiles = await getAllLayouts(filePath, subdirectoryRelativePath);
                layoutDataFiles = layoutDataFiles.concat(subdirectoryFiles);
            } else if (file.endsWith('layout.json')) {
                // Replace backslashes with forward slashes (if user is on windows)
                const route = relativePath.replace(/\\/g, '/');
                layoutDataFiles.push(route);
            }
        }
        return layoutDataFiles;
    } catch (error) {
        console.error(`Error reading directory ${directory}:`, error);
        return [];
    }
}

export async function getAllLayoutsInformation(layouts: any): Promise<Array<any>> {
    const layoutsData = [];
    for (const layout of layouts) {
        try {
            const layoutData = await fs.readFile(`data/layouts${layout}/layout.json`, { encoding: 'utf8' });
            let layoutText = await JSON.parse(layoutData);
            layoutText.route = layout;
            layoutText.content = undefined;
            layoutsData.push(layoutText);
        } catch (error) {
            console.error(`Error reading file for page ${layout}:`, error);
        }
    }
    return layoutsData;
}