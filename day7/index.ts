const input = await Deno.readTextFile(new URL("input.txt", import.meta.url));
const lines = input.split("\n");

function part1(): number {
    const sLocationX = lines[0].indexOf("S");
    let beams = [sLocationX];
    let splitCount = 0;

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        const newBeams = [];

        for (const beamX of beams) {
            if (line[beamX] === "^") {
                // Beam hits a splitter
                splitCount++;
                newBeams.push(beamX - 1);
                newBeams.push(beamX + 1);
            } else {
                // Beam continues straight
                newBeams.push(beamX);
            }
        }

        // Remove duplicates and out of bounds beams
        beams = [...new Set(newBeams)].filter((x) => x >= 0 && x < line.length);
    }

    return splitCount;
}

console.log(`Part 1: ${part1()}`);
