import fs from "node:fs";
import path from "node:path";

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

import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
    const publicTree = buildTree('./public');
    const privateTree = buildTree('./private');

    return new Response(JSON.stringify(publicTree), {
        status: 200,
        headers: {
            'Content-Type': 'text/plain'
        }
    });
};