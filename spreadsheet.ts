import { SpreadsheetEvaluator } from './src/spreadsheetEvaluator.ts';

function writeToStdOut(data: string): void {
    console.log(data);
}

async function main() {
    const filePath = Deno.args[0];
    if (!filePath) {
        console.error("Please specify an input file.");
        Deno.exit(1);
    }

    const fileContent = await Deno.readTextFile(filePath);
    const evaluator = new SpreadsheetEvaluator(fileContent);

    const output = evaluator.evaluate();
    
    writeToStdOut(output);
}

main();
