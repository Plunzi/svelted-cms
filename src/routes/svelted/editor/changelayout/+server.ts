import fs from 'node:fs/promises';

import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    //
    // get client data
    //

    const data = await request.formData();
    const route = data.get('route');

    //
    // check for errors (e.g. invalid content)
    //

    if (!route) {
        return new Response("Not saved!", { status: 400, statusText: "Parameter route is missing" });
    }

    let layout;

    try {
        const localData = await fs.readFile(`data/layouts/${route}/layout.json`, { encoding: 'utf8' });
        layout = await JSON.parse(localData);
    } catch (err) {
        error(404, {
            message: 'Layout not found',
        });
    }

    return new Response(JSON.stringify({ name: layout.description.name, created: layout.description.created, layout: layout.content }), { status: 201 });
}