import type { RequestHandler } from './$types';
import fs from 'node:fs/promises';
import path from 'node:path';

function hasRelativeSymbols(url: string) {
    var pattern = /(\.\.\/|\.\.\\|\.\/|\.\\)/;
    return pattern.test(url);
}

function isValidURL(url: string) {
    if (url == "/") {
        return true;
    } else {
        var pattern = /^[a-zA-Z0-9\-_~:/?#[\]@!$&'()*+,;=.]+$/;
        return pattern.test(url);
    }
}

async function deleteFileAndEmptyFolders(filePath: string) {
    await fs.unlink(filePath);
    // console.log(filePath);
    let directory = path.dirname(filePath);
    while (directory !== 'data/layouts' && (await fs.readdir(directory)).length === 0) {
        await fs.rmdir(directory);
        // console.log(directory);
        directory = path.dirname(directory);
    }
}

export const POST: RequestHandler = async ({ request }) => {
    //
    // get client data
    //
    
    const data = await request.formData();

    const route = data.get('route');
    const author = "admin";

    //
    // check for errors (e.g. invalid content)
    //

    if (!route) {
        return new Response("Not saved!", { status: 400, statusText: "Parameter route is missing" });
    }
    
    if (hasRelativeSymbols(String(route))) {
        return new Response("Not saved!", { status: 422, statusText: "Entered URL contains relative paths" });
    }

    if (!isValidURL(String(route))) {
        return new Response("Not saved!", { status: 422, statusText: "Entered URL is not a valid url" });
    }

    // (everything is good)
    // handle saving changes for given route

    const filePath = `data/layouts/${route}/layout.json`;
    try {
        await deleteFileAndEmptyFolders(filePath);
        return new Response(JSON.stringify({ success: true, affected: route}), { status: 201 });
    } catch (error) {
        console.error("Error deleting file and empty folders:", error);
        return new Response(JSON.stringify({ success: false, affected: route}), { status: 500, statusText: "Internal Server Error" });
    }
}