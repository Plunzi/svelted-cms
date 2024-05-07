import fs from 'node:fs';
import path from 'node:path';

import type { RequestHandler } from './$types';

function hasRelativeSymbols(url: string) {
    var pattern = /(\.\.\/|\.\.\\|\.\/|\.\\)/;
    return pattern.test(url);
}

function isValidURL(url: string) {
    if (url == "/") {
        return true;
    } else {
        var pattern = /^\/[a-zA-Z0-9\-_~:/?#[\]@!$&'()*+,;=.]+\/$/;
        return pattern.test(url);
    }
}

export const POST: RequestHandler = async ({ request }) => {
    //
    // get client data
    //
    
    const data = await request.formData();

    const route = data.get('route');
    const content = data.get('content');
    const name = data.get('name');
    const updated = Math.floor(new Date().getTime() / 1000);

    //
    // check for errors (e.g. invalid content)
    //

    if (!route) {
        return new Response("Not saved!", { status: 400, statusText: "Parameter route is missing" });
    }

    if (!content) {
        return new Response("Not saved!", { status: 400, statusText: "Parameter content is missing" });
    }

    if (!name) {
        return new Response("Not saved!", { status: 400, statusText: "Parameter name is missing" });
    }
    
    if (hasRelativeSymbols(String(route))) {
        return new Response("Not saved!", { status: 422, statusText: "Entered URL contains relative paths" });
    }

    console.log(route);

    if (!isValidURL(String(route))) {
        return new Response("Not saved!", { status: 422, statusText: "Entered URL is not a valid url" });
    }

    // (everything is good)
    // handle saving changes for gicen route
    //

    const newData = `{"description": { "name": "${name || undefined}","route": "${route || undefined}","updated": ${updated} },"content": ${content}}`
    const saveLocation = `src/lib/svelted/layouts${route}page.data.json`;

    console.log(saveLocation);
    console.log(newData);

    const dirname = path.dirname(saveLocation);
    await fs.promises.mkdir(dirname, { recursive: true });
    await fs.promises.writeFile(saveLocation, newData, { flag: "w" })

    return new Response("Saved!", { status: 201 });
}