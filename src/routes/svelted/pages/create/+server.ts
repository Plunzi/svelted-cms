import { isInternalPath, isValidPath, isRelativePath } from '$lib/svelted/tests/Paths';
import type { RequestHandler } from './$types';
import fs from 'node:fs/promises'
import path from 'node:path'

export const POST: RequestHandler = async ({ request }) => {
    //
    // get client data
    //
    
    const data = await request.formData();

    const route = data.get('route');
    const title = data.get('title');
    const status = data.get('status');
    const layout = data.get('layout');
    const author = "admin";
    const created = Math.floor(new Date().getTime() / 1000);
    const updated = created;

    //
    // check for errors (e.g. invalid content)
    //

    if (!route) {
        return new Response("Not saved!", { status: 400, statusText: "Parameter route is missing" });
    }

    if (!title) {
        return new Response("Not saved!", { status: 400, statusText: "Parameter name is missing" });
    }

    if (!status) {
        return new Response("Not saved!", { status: 400, statusText: "Parameter route is missing" });
    }

    if (!layout) {
        return new Response("Not saved!", { status: 400, statusText: "Parameter name is missing" });
    }

    if (isRelativePath(String(route))) {
        return new Response("Not saved!", { status: 422, statusText: "Relative URL paths could be dangerous" });
    }

    if (!isValidPath(String(route))) {
        return new Response("Not saved!", { status: 422, statusText: "Entered URL is not a valid url" });
    }

    if (isInternalPath(String(route))) {
        return new Response("Not saved!", { status: 422, statusText: "Cannot override internal svelted URL" });
    }

    // (everything is good)
    // handle saving changes for gicen route

    const newData = `{"allowed-roles": ["everyone"],"layout": "${layout}","title": "${title}","status": "${status}","author": "${author}","modified": ${updated},"created": ${created}}`
    const saveLocation = `data/pages/${route}/page.json`;

    // console.log(saveLocation);
    // console.log(newData);
    // console.log(route);
    // console.log(title);

    const dirname = path.dirname(saveLocation);
    await fs.mkdir(dirname, { recursive: true });
    await fs.writeFile(saveLocation, newData, { flag: "w" })

    return new Response(`{"route": "${route}", "data": ${newData}}`, { status: 201 });
}