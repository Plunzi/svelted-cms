import fs from 'node:fs';
import path from 'node:path';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    //
    // get client data
    //
    
    const data = await request.formData();
    const todos = data.get('todos');

    //
    // check for errors (e.g. invalid content)
    //

    if (!todos) {
        return new Response("Not saved!", { status: 400, statusText: "Parameter route is missing" });
    }

    // (everything is good)
    // handle saving changes for gicen route
    //

    const saveLocation = `src/lib/svelted/simple-todo/todo.data.json`;

    // console.log(saveLocation);

    const dirname = path.dirname(saveLocation);
    await fs.promises.mkdir(dirname, { recursive: true });
    await fs.promises.writeFile(saveLocation, String(todos), { flag: "w" })

    return new Response("Saved!", { status: 201 });
}