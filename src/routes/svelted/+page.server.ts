import os from 'node:os';

export const load = async () => {
    function getCurrentCPUUsage() {
        const cpus = os.cpus();
        let totalUsage = 0;
    
        for (const cpu of cpus) {
            const usage = cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq;
            totalUsage += usage;
        }
    
        return totalUsage;
    }
    
    function getCurrentProcessCPUUsage() {
        const processUsage = process.cpuUsage();
        return (processUsage.user + processUsage.system) / 1000;
    }

    const totalCPUUsage = getCurrentCPUUsage();
    const processCPUUsage = getCurrentProcessCPUUsage();
    const cpuUsagePercentage = (processCPUUsage / totalCPUUsage) * 100;

    // console.log('CPU Usage Percentage:', cpuUsagePercentage.toFixed(2), '%');
    // console.log('CPU Usage Percentage:', cpuUsagePercentage, '%');
    
    const usedMemory = process.memoryUsage();
    const usedCpu = process.cpuUsage();

    function bytesToMemory(bytes: number) {
        const GB = 1024 * 1024 * 1024;
        const MB = 1024 * 1024;

        if (bytes >= GB) {
            return (bytes / GB).toFixed(2) + 'GB';
        } else if (bytes >= MB) {
            return (bytes / MB).toFixed(2) + 'MB';
        } else {
            return bytes + 'B';
        }
    }

    return {
        ressources: {
            cpuUsage: cpuUsagePercentage.toFixed(2),
            heapTotal: bytesToMemory(usedMemory.heapTotal),
            usedMemory: bytesToMemory(usedMemory.heapUsed),
            totalMemory: bytesToMemory(os.totalmem()),
        }
    };
};