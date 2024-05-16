import { isInternalPath } from '$svelted/checks/Paths';
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
        return new Response("Parameter route is missing", { status: 400});
    }
    
    if (hasRelativeSymbols(String(route))) {
        return new Response("Entered URL contains relative paths", { status: 422 });
    }

    if (!isValidURL(String(route))) {
        return new Response("Entered URL is not a valid url", { status: 422 });
    }

    if (isInternalPath(String(route))){
        return new Response("Cannot delete essential layout", { status: 422 });
    }

    // (everything is good)
    // handle saving changes for given route

    const filePath = `data/pages/${route}/page.json`;
    try {
        await deleteFileAndEmptyFolders(filePath);
        return new Response(`Successfully deleted page: ${route}`, { status: 201 });
    } catch (error) {
        console.error("Error deleting file and empty folders:", error);
        return new Response(`Could not delete page: ${route}`, { status: 500, statusText: "Internal Server Error" });
    }
}