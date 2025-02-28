import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ setHeaders, params }) => {
    if (!params.storage) {
        return new Response("404! File not found.", { status: 404 });
    }

    //
    // here will be authentication some time when the far far galaxy.. 🌌💫
    //

    const contentPath = `assets/${params.storage}`;

    console.log(contentPath);

    const file = Bun.file(contentPath);
    const exists = await file.exists();

    if (!exists) {
        return new Response('Ressource not found', {
            status: 404,
        });
    }

    try {
        const content = file.stream();

        setHeaders({
            'Content-Type': `${file.type}`,
            'Content-Length': `${file.size}`
        });

        return new Response(content, {
            status: 200,
        });
    } catch (error) {
        console.error('Error reading image file:', error);
        return new Response('Error reading image file', {
            status: 500
        });
    }
};