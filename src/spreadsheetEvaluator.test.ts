import { assertEquals } from "https://deno.land/std@0.218.2/assert/assert_equals.ts";
import { SpreadsheetEvaluator } from "../src/spreadsheetEvaluator.ts";

Deno.test("Spreadsheet Evaluator", async () => {
  const testFilesDir = new URL('../test-files/', import.meta.url);

  for await (const dirEntry of Deno.readDir(testFilesDir)) {
    if (dirEntry.isFile && dirEntry.name.endsWith('.csv')) {
      const fileName = dirEntry.name;
      const filePath = new URL(fileName, testFilesDir).pathname;
      const expectedOutputPath = new URL("../test-files/expected-outputs/" + fileName.replace('.csv', '.expected.csv'), testFilesDir).pathname;

      // Read the test CSV file and its expected output
      const csvContent = await Deno.readTextFile(filePath);
      const expectedOutput = await Deno.readTextFile(expectedOutputPath);

      // Evaluate the CSV content
      const evaluator = new SpreadsheetEvaluator(csvContent);
      const output = evaluator.evaluate();

      // Assert the output against the expected output
      assertEquals(output.trim(), expectedOutput.trim());
    }
  }
});
