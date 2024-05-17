import { isRelativePath } from "$svelted/checks/Paths";
import type { PageServerLoad } from "./$types";
import { promises as fs } from 'fs';
import path from 'path';

interface Folder {
    path: string
    name: string
}

interface File {
    path: string
    name: string
    author: string
    extension: string
    size: number
    description: string | undefined
    modified: number
    created: number
}

type FilesItem = Folder | File;

export const load: PageServerLoad = async ({ params }) => {
    if (isRelativePath(params.path)) {
        return { folders: [], files: [] };
    }

    if (!(params.path.startsWith('public/') || params.path.startsWith('private/') || params.path.startsWith('data/') || params.path == 'data' || params.path == 'public' || params.path == 'private')) {
        console.log(params.path, " - ", "not allowed");
        return { folders: [], files: [], status: "not allowed" };
    }

    const baseDir = path.resolve('./');

    const currentPath = params.path ? path.join(baseDir, params.path) : baseDir;

    let files: File[] = [];
    let folders: Folder[] = [];

    try {
        const stat = await fs.stat(currentPath);
        if (stat.isDirectory()) {

            const items = await fs.readdir(currentPath, { withFileTypes: true });

            for (const item of items) {
                const itemPath = path.join(currentPath, item.name);
                const stat = await fs.stat(itemPath);

                if (item.isDirectory()) {
                    folders.push({
                        path: `/${params.path}/${item.name}`,
                        name: item.name,
                    } as Folder);
                } else if (item.isFile()) {
                    files.push({
                        path: `/${params.path}/${item.name}`,
                        name: item.name,
                        author: 'unknown', // Placeholder, replace with actual author if available
                        extension: path.extname(item.name).slice(1),
                        size: stat.size,
                        description: undefined, // Placeholder, replace with actual description if available
                        modified: stat.mtimeMs,
                        created: stat.ctimeMs,
                    } as File);
                }
            }
        } else if (stat.isFile()) {
            // Handle the case where the path is a file
            const fileStat = await fs.stat(currentPath);
            files.push({
                path: currentPath,
                name: path.basename(currentPath),
                author: 'unknown', // Placeholder, replace with actual author if available
                extension: path.extname(currentPath).slice(1),
                size: fileStat.size,
                description: undefined, // Placeholder, replace with actual description if available
                modified: fileStat.mtimeMs,
                created: fileStat.ctimeMs,
            } as File);

            return {
                folders,
                files,
                status: "file"
            };
        }
    } catch (error) {
        // console.error('Error reading directory:', error);
    }

    return {
        folders,
        files,
        status: "success"
    };
};