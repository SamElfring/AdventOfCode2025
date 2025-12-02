const day = Deno.args[0];
if (!day) {
    console.error("Please provide a day number");
    Deno.exit(1);
}

await import(`./day${day}/index.ts`);
