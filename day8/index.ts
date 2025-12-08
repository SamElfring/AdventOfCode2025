const input = await Deno.readTextFile(new URL("input.txt", import.meta.url));

interface Box {
    x: number;
    y: number;
    z: number;
}

const boxes: Box[] = input.split("\n").map((x) => {
    const coords = x.split(",").map(Number);
    return {
        x: coords[0],
        y: coords[1],
        z: coords[2]
    };
});

function part1() {
    const distances: { distance: number; boxes: number[] }[] = [];

    for (let a = 0; a < boxes.length; a++) {
        for (let b = a + 1; b < boxes.length; b++) {
            const boxA = boxes[a];
            const boxB = boxes[b];

            // Straight line Euclidean
            const distance = Math.sqrt(
                Math.pow(boxA.x - boxB.x, 2) + Math.pow(boxA.y - boxB.y, 2) + Math.pow(boxA.z - boxB.z, 2)
            );

            distances.push({
                distance,
                boxes: [a, b]
            });
        }
    }

    distances.sort((a, b) => a.distance - b.distance);

    // Union find
    const parent = Array.from({ length: boxes.length }, (_, i) => i);
    const size = Array(boxes.length).fill(1);

    const find = (x: number): number => {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    };

    const union = (x: number, y: number): boolean => {
        const rootX = find(x);
        const rootY = find(y);

        if (rootX === rootY) return false;

        if (size[rootX] < size[rootY]) {
            parent[rootX] = rootY;
            size[rootY] += size[rootX];
        } else {
            parent[rootY] = rootX;
            size[rootX] += size[rootY];
        }

        return true;
    };

    let attempts = 0;
    let connections = 0;

    for (const {
        boxes: [a, b]
    } of distances) {
        attempts++;
        if (union(a, b)) connections++;
        if (attempts === 1000) break;
    }

    // Get circuit sizes
    const rootSizes = new Map<number, number>();
    for (let i = 0; i < boxes.length; i++) {
        const root = find(i);
        if (!rootSizes.has(root)) {
            rootSizes.set(root, size[root]);
        }
    }

    const circuitSizes = Array.from(rootSizes.values()).sort((a, b) => b - a);
    return circuitSizes[0] * circuitSizes[1] * circuitSizes[2];
}

console.log(`Part 1: ${part1()}`);
