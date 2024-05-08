import os from 'node:os';
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

async function getTodos(): Promise<Todos> {
    try {
        const todosStored = await fs.readFile('src/lib/svelted/simple-todo/todo.data.json', { encoding: 'utf8' });
        const todos = JSON.parse(todosStored);
        return todos;
    } catch (error) {
        return {
            todo: [],
            done: []
        };
    }
}

async function getCurrentCPUUsage() {
    const cpus = os.cpus();
    let totalUsage = 0;

    for (const cpu of cpus) {
        const usage = cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq;
        totalUsage += usage;
    }

    return totalUsage;
}

async function getCurrentProcessCPUUsage() {
    const processUsage = process.cpuUsage();
    return (processUsage.user + processUsage.system) / 1000;
}

export const load = async () => {
    const totalCPUUsage = await getCurrentCPUUsage();
    const processCPUUsage = await getCurrentProcessCPUUsage();
    const cpuUsagePercentage = (processCPUUsage / totalCPUUsage) * 100;
    const todos = await getTodos();

    // console.log('CPU Usage Percentage:', cpuUsagePercentage.toFixed(2), '%');
    // console.log('CPU Usage Percentage:', cpuUsagePercentage, '%');

    const memoryUsage = process.memoryUsage();
    const totalMemory = os.totalmem()

    let ressources = {
        usedMemory: "0",
        totalMemory: "0",
        heapMemory: memoryUsage.heapTotal,
    }

    const GB = 1024 * 1024 * 1024;
    const MB = 1024 * 1024;

    if (totalMemory >= GB) {
        ressources.usedMemory = (memoryUsage.heapUsed / GB).toFixed(2)
        ressources.totalMemory = (totalMemory / GB).toFixed(2) + ' GB'
    } else if (os.totalmem() >= MB) {
        ressources.usedMemory = (memoryUsage.heapUsed / MB).toFixed(2)
        ressources.totalMemory = (totalMemory / MB).toFixed(2) + ' MB'
    } else {
        ressources.usedMemory = String(memoryUsage.heapUsed.toFixed(2))
        ressources.totalMemory = (totalMemory).toFixed(2) + 'B'
    }

    return {
        ressources: {
            cpuUsage: cpuUsagePercentage.toFixed(2),
            heapTotal: ressources.heapMemory,
            usedMemory: ressources.usedMemory,
            totalMemory: ressources.totalMemory,
        },
        todo: {
            data: todos
        }
    };
};