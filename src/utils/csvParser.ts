export class CSVParser {
    private content: string;

    constructor(content: string) {
        this.content = content;
    }

    parse(): string[][] {
        // Split content into rows and then cells, trimming whitespace
        return this.content.split("\n").map(row => row.split(",").map(cell => cell.trim()));
    }
}
