const textData = await Deno.readTextFile(new URL("input.txt", import.meta.url));
const data = textData.split("\n");

function part1() {
    let dial = 50; // 0 to 99
    let total = 0;

    for (const instr of data) {
        const amount = Number(instr.slice(1));

        if (instr[0] === "L") dial = (dial - amount + 100) % 100;
        else dial = (dial + amount) % 100;

        if (dial === 0) total++;
    }

    return total;
}

function part2() {
    let dial = 50; // 0 to 99
    let total = 0;

    for (const instr of data) {
        const direction = instr[0];
        const amount = Number(instr.slice(1));

        if (direction === "L") {
            // Moving left (decreasing)
            for (let i = 0; i < amount; i++) {
                dial = (dial - 1 + 100) % 100;
                if (dial === 0) total++;
            }
        } else {
            // Moving right (increasing)
            for (let i = 0; i < amount; i++) {
                dial = (dial + 1) % 100;
                if (dial === 0) total++;
            }
        }
    }

    return total;
}

// Run
console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
