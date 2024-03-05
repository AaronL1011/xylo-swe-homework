# Xylo Systems - SWE Spreadsheet Homework Task

## Description 
Write a Typescript program to parse a given CSV file and evaluate each cell by these rules:

1. Each cell is an expression in postfix notation. Please refer to the wikipedia page for a
full description.
2. Each number or operation will always be separated by one or more spaces.
3. A cell can refer to another cell, via the LETTER NUMBER notation (A2, B4, etc -
letters refer to columns, numbers to rows).
4. Support the basic arithmetic operators +, -, *, /

The output will be **a CSV file of the same dimensions**, where each cell is evaluated to its final
value. If any cell is an invalid expression, then **for that cell only** print #ERR.

For example, the following CSV input:
```csv
10, 1 3 +, 2 3 -
b1 b2 *, a1, b1 a2 / c1 +
+, 1 2 3, c3
```
might output something like:
```
10,4,-1
40,10,-0.9
#ERR,#ERR,#ERR
```

## Command line spec
Aside from reviewing the code, we run automated tests on your task. So please make sure
it confirms to the following spec exactly:

- The program should be runnable with the following command `deno run –check spreadsheet.ts $INPUT_FILE` and write its output to STDOUT.

## Program Design

### Requirements
- The system must be able to read and parse CSV files of varying sizes, correctly interpreting each cell's content.
- The system must output a CSV file of the same dimensions as the input, with each cell containing its evaluated value or an error indicator.
- Each cell must be evaluated according to postfix notation rules. The system must support the basic arithmetic operators: addition (+), subtraction (-), multiplication (*), and division (/).
- The system must correctly resolve cell references (e.g., A1, B2) within expressions, allowing cells to reference the value of other cells.
- If a cell contains an invalid expression, the system must mark that cell as #ERR.
- The system caters to edge cases as best it can given the scope and timeline.

### Edge Cases (checked = handled)

- [x] Circular cell references
- [x] Division by zero
- [x] Invalid cell references
- [x] Referencing a cell before its been evaluated
- [x] Empty cells
- [x] Empty sheets
- [ ] Inputs that aren't csv files

## Running and Testing

### Run

In the root of the project, run the program with Deno: `deno run --check --allow-read spreadsheet.ts <your_file_path>`

### Test

Test with Deno's built-in test running: `deno test --allow-read`

## Code Structure

- **`spreadsheet.ts`**: The entry point of the application that handles file reading, invoking the evaluator, and outputting results.
- **`SpreadsheetEvaluator`**: Orchestrates the parsing, evaluation, and assembly of the output CSV.
- **Utilities**:
  - **`CSVParser`**: Parses the input CSV into a 2D array.
  - **`CellReferenceResolver`**: Resolves references to other cells in expressions.
  - **`PostfixEvaluator`**: Evaluates postfix expressions in each cell.


## Limitations and Points of Note

- **Circular Reference Detection**: The implementation detects circular references but does not provide detailed information about the loop.
- **Error Handling**: Errors in expressions result in `#ERR` in the output, but specific error messages are not provided.
- **Performance**: The solution is designed for correctness and clarity rather than maximum performance. Large spreadsheets with many complex references may experience much slower evaluation times and require refactoring to suit.

## Trade-offs and Design Decisions

- **Recursive Cell Reference Resolution**: Chosen for its simplicity in handling nested references, at the cost of potentially higher stack usage for deeply nested references.
- **Case-Insensitive Column References**: Implemented to improve usability, requiring additional processing to normalize case.
- **Caching Resolved Cell Reference Values**: Reduces redundant calculations, especially beneficial for spreadsheets with repeated references to the same cells.
- **Basic Procedural Processing**: This system is quite naive and likely not suited for production use at scale. If it had to process big datasets, I would look into parallelism and batch processing where possible, and potentially exploring data structures more suited to spreadsheet data.
- **Lacking Helpful Errors**: The output of errors suits the test case but I'd like to see more helpful information returned about the type and location of the error for further diagnostics on the source data.
