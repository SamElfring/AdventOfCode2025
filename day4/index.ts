const input = await Deno.readTextFile(new URL("input.txt", import.meta.url));
const grid = input.split("\n").map((x) => x.split(""));

function part1() {
    const neighbors = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1]
    ];

    let total = 0;

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] == "@") {
                let count = 0;

                neighbors.forEach(([x, y]) => {
                    const newI = i + x;
                    const newJ = j + y;

                    if (newI >= 0 && newI < grid.length && newJ >= 0 && newJ < grid[i].length) {
                        if (grid[newI][newJ] == "@") count++;
                    }
                });

                if (count < 4) total++;
            }
        }
    }

    return total;
}

console.log(`Part 1: ${part1()}`);
