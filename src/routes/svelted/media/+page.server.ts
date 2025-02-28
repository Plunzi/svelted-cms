import type { PageServerLoad } from "./$types";
import fs from 'node:fs';
import path from 'node:path';

function buildTree(dirPath: string) {
    const name = path.basename(dirPath);
    const item: { label: string, children?: any } = { label: name };

    const children = fs.readdirSync(dirPath).map(childName => {
        const childPath = path.join(dirPath, childName);
        if (fs.statSync(childPath).isDirectory()) {
            return buildTree(childPath);
        } else {
            return { label: childName };
        }
    });

    if (children.length > 0) {
        item.children = children;
    }

    return item;
}

export const load: PageServerLoad = async ({ params }) => {
    const publicTree = buildTree('./assets/public');
    const privateTree = buildTree('./assets/private');
    const dataTree = buildTree('./data');
    const media = { label: "", children: [publicTree, privateTree, dataTree] };

    return { media };
};