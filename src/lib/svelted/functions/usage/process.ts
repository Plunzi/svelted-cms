import os from 'node:os';

export async function getCurrentCPUUsage() {
    const cpus = os.cpus();
    let totalUsage = 0;

    for (const cpu of cpus) {
        const usage = cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq;
        totalUsage += usage;
    }

    return totalUsage;
}

export async function getCurrentProcessCPUUsage() {
    const processUsage = process.cpuUsage();
    return (processUsage.user + processUsage.system) / 1000;
}