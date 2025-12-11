const input = await Deno.readTextFile(new URL("input.txt", import.meta.url));

interface Device {
    deviceName: string;
    ids: string[];
    outputs: Device[];
    inputs: Device[];
}

interface PathResult {
    count: number;
    longestPath: string[] | null;
}

function parseDeviceMap(input: string) {
    const lines = input
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    const devices: Device[] = lines.map((line) => {
        const [deviceName, ...rest] = line.split(":");
        const ids = rest.join("").trim().split(/\s+/);
        return {
            deviceName,
            ids,
            outputs: [],
            inputs: []
        };
    });

    const deviceIndex: Record<string, Device> = {};
    devices.forEach((device) => {
        deviceIndex[device.deviceName] = device;
    });

    const ensureDevice = (name: string): Device => {
        if (!deviceIndex[name]) {
            deviceIndex[name] = {
                deviceName: name,
                ids: [],
                outputs: [],
                inputs: []
            };

            devices.push(deviceIndex[name]);
        }

        return deviceIndex[name];
    };

    devices.forEach((device) => {
        device.outputs = device.ids.filter(Boolean).map((id) => {
            const target = ensureDevice(id);
            target.inputs.push(device);
            return target;
        });
    });

    const findDevice = (name: string): Device => ensureDevice(name);

    return { devices, deviceIndex, findDevice };
}

interface PathCounterOptions {
    endDevice: Device;
    shouldTraverseDevice?: ((device: Device) => boolean) | null;
    requiredDevices?: Device[];
}

function createPathCounter({ shouldTraverseDevice = null, endDevice, requiredDevices = [] }: PathCounterOptions) {
    const memo = new Map<string, PathResult>();

    const requiredDeviceBits = new Map<string, number>();
    requiredDevices.forEach((device, index) => {
        requiredDeviceBits.set(device.deviceName, 1 << index);
    });
    const requiredMask = requiredDevices.length ? (1 << requiredDevices.length) - 1 : 0;

    function countPaths(device: Device, visitedMask = 0, stack = new Set<string>()): PathResult {
        const bit = requiredDeviceBits.get(device.deviceName) || 0;
        const nextMask = visitedMask | bit;
        const memoKey = `${device.deviceName}:${nextMask}`;

        if (memo.has(memoKey)) {
            return memo.get(memoKey)!;
        }

        if (stack.has(device.deviceName)) {
            // Cycle detected, no simple paths continue through this branch
            return { count: 0, longestPath: null };
        }

        if (shouldTraverseDevice && !shouldTraverseDevice(device)) {
            return { count: 0, longestPath: null };
        }

        if (device === endDevice) {
            const isValid = requiredMask === 0 ? true : nextMask === requiredMask;
            const result: PathResult = {
                count: isValid ? 1 : 0,
                longestPath: isValid ? [device.deviceName] : null
            };
            memo.set(memoKey, result);
            return result;
        }

        stack.add(device.deviceName);
        let total = 0;
        let bestPath: string[] | null = null;

        for (const outputDevice of device.outputs) {
            const childResult: PathResult = countPaths(outputDevice, nextMask, stack);
            total += childResult.count;

            if (childResult.longestPath) {
                const candidatePath: string[] = [device.deviceName, ...childResult.longestPath];
                if (!bestPath || candidatePath.length > bestPath.length) {
                    bestPath = candidatePath;
                }
            }
        }

        stack.delete(device.deviceName);

        const result: PathResult = { count: total, longestPath: bestPath };
        memo.set(memoKey, result);
        return result;
    }

    return function (startDevice: Device): PathResult {
        return countPaths(startDevice, 0, new Set());
    };
}

function part1(): number {
    const { findDevice } = parseDeviceMap(input);

    const start = findDevice("you");
    const end = findDevice("out");

    // Find every path from you to out
    const countPaths = createPathCounter({ endDevice: end });
    const result = countPaths(start);

    return result.count;
}

console.log(`Part 1: ${part1()}`);
