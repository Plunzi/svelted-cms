import fs from 'node:fs';

export async function POST({ request }): Promise<Response> {
    const data = await request.formData();
    console.log([...data.keys()]);
    
    console.log(data);
    const content = data.get('content');
    console.log(content);

    await fs.promises.writeFile('src/lib/data/save.json', String(content) )

    return new Response("Saved!", { status: 201 });
}