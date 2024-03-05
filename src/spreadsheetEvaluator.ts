import { CSVParser } from "./utils/csvParser.ts";
import { PostfixEvaluator } from "./utils/postfixEvaluator.ts";
import { CellReferenceResolver } from "./utils/cellReferenceResolver.ts";

export class SpreadsheetEvaluator {
    private csvContent: string;

    constructor(csvContent: string) {
        this.csvContent = csvContent;
    }

    evaluate(): string {
        const csvParser = new CSVParser(this.csvContent);
        const data = csvParser.parse();

        const cellReferenceResolver = new CellReferenceResolver(data);

        const evaluatedData = data.map((row) => 
            row.map((cellValue) => {
                const resolvedCellValue = cellReferenceResolver.resolveCellReferences(cellValue);
                return PostfixEvaluator.evaluatePostfixExpression(resolvedCellValue);
            })
        );

        return this.formatCsv(evaluatedData);
    }

    private formatCsv(data: string[][]): string {
        return data.map(row => row.join(",")).join("\n");
    }
}
