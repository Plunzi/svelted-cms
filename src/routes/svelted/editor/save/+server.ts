import { isInternalPath, isValidPath, isRelativePath } from '$svelted/checks/Paths';
import type { RequestHandler } from './$types';
import fs from 'node:fs/promises'
import path from 'node:path'



export const POST: RequestHandler = async ({ request }) => {
    //
    // get client data
    //
    
    const data = await request.formData();

    const route = data.get('route');
    const content = data.get('content');
    const name = data.get('name');
    const author = "admin";
    const updated = Math.floor(new Date().getTime() / 1000);
    const created = data.get('created');

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
    
    if (isRelativePath(String(route))) {
        return new Response("Not saved!", { status: 422, statusText: "Relative URL paths could be dangerous" });
    }

    if (!isValidPath(String(route))) {
        return new Response("Not saved!", { status: 422, statusText: "Entered URL is not a valid url" });
    }

    //
    // (everything is good) -> save changes
    //

    const newData = `{"description": { "name": "${name || undefined}","route": "${route || undefined}","author": "${author}","modified": ${updated},"created": ${created} },"content": ${content}}`
    const saveLocation = `data/layouts/${route}/layout.json`;

    // DEBUG:
    // console.log(saveLocation);
    // console.log(newData);
    // console.log(route);
    // console.log(name);

    const dirname = path.dirname(saveLocation);
    await fs.mkdir(dirname, { recursive: true });
    await fs.writeFile(saveLocation, newData, { flag: "w" })

    return new Response("Saved!", { status: 201 });
}