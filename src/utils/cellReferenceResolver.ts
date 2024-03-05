export class CellReferenceResolver {
    private data: string[][];
    private evaluationCache: Map<string, string>;
    private baseCharCode = 'A'.charCodeAt(0);

    constructor(data: string[][]) {
        this.data = data;
        this.evaluationCache = new Map<string, string>();
    }

    // CAUTION: Recursion
    resolveCellReferences(expression: string): string {
        const regex = /[A-Za-z][0-9]+/g;
        let resolvedExpression = expression;

        const matches = expression.match(regex);
        if (!matches) return resolvedExpression;

        for (const match of matches) {
            const upperCaseMatch = match.toUpperCase(); // Case consistency for cache and recursion
            const referenceValue = this.resolveReference(upperCaseMatch);
            if (referenceValue === "#ERR") {
                // If any cell reference is invalid, the whole expression is invalid
                return "#ERR";
            }
            resolvedExpression = resolvedExpression.replace(match, referenceValue);
        }

        return resolvedExpression;
    }

    private resolveReference(cellRef: string): string {
        if (this.evaluationCache.has(cellRef)) {
            return this.evaluationCache.get(cellRef)!;
        }

        // Mark this cell as being evaluated to detect circular references
        this.evaluationCache.set(cellRef, "#PENDING");

        const column = cellRef.charCodeAt(0) - this.baseCharCode;
        const row = parseInt(cellRef.substring(1)) - 1; // Converting to zero-based index because arrays

        const isOutOfBounds = row < 0 || row >= this.data.length || column < 0 || column >= this.data[row].length;
        if (isOutOfBounds) {
            return "#ERR";
        }

        const cellValue = this.data[row][column];

        // Check if the cell value is a reference or an expression
        if (/[A-Za-z][0-9]+/.test(cellValue) || /\s+/.test(cellValue)) { // Inline regex not great but are moving fast
            const resolvedValue = this.resolveCellReferences(cellValue);
            if (resolvedValue === "#PENDING") {
                // Circular reference detected
                return "#ERR";
            }
            this.evaluationCache.set(cellRef, resolvedValue);
            return resolvedValue;
        } else {
            // It's a direct value
            this.evaluationCache.set(cellRef, cellValue);
            return cellValue;
        }
    }
}
