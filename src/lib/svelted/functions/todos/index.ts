import fs from 'node:fs/promises';

interface Todos {
    todo:
    {
        entry: string
    }[],
    done:
    {
        entry: string
    }[]
}

export async function getTodos(): Promise<Todos> {
    try {
        const todosStored = await fs.readFile('src/lib/svelted/ui/simple-todo/todo.data.json', { encoding: 'utf8' });
        const todos = JSON.parse(todosStored);
        return todos;
    } catch (error) {
        return {
            todo: [],
            done: []
        };
    }
}