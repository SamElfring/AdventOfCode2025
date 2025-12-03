const textData = await Deno.readTextFile(new URL("input.txt", import.meta.url));
const data: [number, number][] = textData.split(",").map((chunk) => {
    const [a, b] = chunk.split("-").map(Number);
    return [a, b] as [number, number];
});

function part1() {
    let score: number = 0;

    for (const [x, y] of data) {
        for (let z = x; z <= y; z++) {
            const s = "" + z;
            const firstHalf = s.slice(0, Math.floor(s.length / 2));
            const secondHalf = s.slice(Math.floor(s.length / 2));

            if (firstHalf == secondHalf) score += z;
        }
    }

    return score;
}

function part2() {
    const repeatedPattern = (a: number): boolean => {
        const s = "" + a;
        return (s + s).slice(1, -1).includes(s);
    };

    let score: number = 0;

    for (const [x, y] of data) {
        for (let z = x; z <= y; z++) {
            if (repeatedPattern(z)) {
                score += z;
            }
        }
    }

    return score;
}

// Run
console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
