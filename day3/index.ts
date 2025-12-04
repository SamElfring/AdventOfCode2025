const textData = await Deno.readTextFile(new URL("input.txt", import.meta.url));
const batteries: number[][] = textData.split("\n").map((line) => [...line].map((c) => c.charCodeAt(0) - 48));

const maxJoltage = (bank: number[], battery: number, joltage = 0): number => {
    if (!battery) return joltage;

    const rating = Math.max(...bank.slice(0, bank.length - battery + 1));
    return maxJoltage(bank.slice(bank.indexOf(rating) + 1), battery - 1, joltage * 10 + rating);
};

const part1 = () => {
    return batteries.map((bank) => maxJoltage(bank, 2)).reduce((sum, val) => sum + val, 0);
};

const part2 = () => {
    return batteries.map((bank) => maxJoltage(bank, 12)).reduce((sum, val) => sum + val, 0);
};

console.log(`Part 1: ${part1()}`);
console.log(`Part 2: ${part2()}`);
