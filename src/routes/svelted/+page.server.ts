
import { getCurrentCPUUsage, getCurrentProcessCPUUsage } from '$svelted/functions/usage/process';
import { getTodos } from '$svelted/functions/todos'
import os from 'node:os';

export const load = async () => {
    const totalCPUUsage = await getCurrentCPUUsage();
    const processCPUUsage = await getCurrentProcessCPUUsage();
    const cpuUsagePercentage = (processCPUUsage / totalCPUUsage) * 100;
    const todos = await getTodos();

    const memoryUsage = process.memoryUsage();
    const totalMemory = os.totalmem();

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