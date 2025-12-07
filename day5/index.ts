const input = await Deno.readTextFile(new URL("input.txt", import.meta.url));
const data = input.split("\n\n").map((x) => x.split("\n"));

const ranges = data[0].map((x) => x.split("-").map(Number));
const ids = data[1].map(Number);

function part1() {
    let count = 0;
    for (const id of ids) {
        for (const [start, end] of ranges) {
            if (id >= start && id <= end) {
                count++;
                break;
            }
        }
    }
    return count;
}

function part2() {
    // Merge overlapping ranges to avoid double
    const sortedRanges = [...ranges].sort((a, b) => a[0] - b[0]);
    const merged: number[][] = [];

    for (const [start, end] of sortedRanges) {
        if (merged.length === 0) {
            merged.push([start, end]);
        } else {
            const last = merged[merged.length - 1];
            // If current range overlaps the last merged range
            if (start <= last[1] + 1) {
                // Extend the last range
                last[1] = Math.max(last[1], end);
            } else {
                // No overlap, add as new range
                merged.push([start, end]);
            }
        }
    }

    let count = 0;
    for (const [start, end] of merged) {
        count += end - start + 1;
    }

    return count;
}

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
