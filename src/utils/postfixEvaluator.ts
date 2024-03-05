export class PostfixEvaluator {
    static evaluatePostfixExpression(expression: string): string {
        const stack: number[] = [];
        const tokens = expression.split(/\s+/);

        for (const token of tokens) {
            if (this.isNumber(token)) {
                stack.push(parseFloat(token));
            } else if (this.isSupportedOperator(token)) {
                if (stack.length < 2) {
                    return "#ERR";
                }
                const rightOperand = stack.pop()!;
                const leftOperand = stack.pop()!;
                try {
                    const result = this.applyOperation(leftOperand, rightOperand, token);
                    stack.push(result);
                } catch (_error) {
                    return "#ERR";
                }
            } else {
                // Token is neither a number nor an operator, which means it's invalid.
                return "#ERR";
            }
        }

        if (stack.length !== 1) {
            return "#ERR";
        }

        return stack.pop()!.toString();
    }

    private static isNumber(token: string): boolean {
        return !isNaN(parseFloat(token)) && isFinite(parseFloat(token));
    }

    private static isSupportedOperator(token: string): boolean {
        return ['+', '-', '*', '/'].includes(token);
    }

    private static applyOperation(leftOperand: number, rightOperand: number, operator: string): number {
        switch (operator) {
            case '+':
                return leftOperand + rightOperand;
            case '-':
                return leftOperand - rightOperand;
            case '*':
                return leftOperand * rightOperand;
            case '/':
                if (rightOperand === 0) {
                    throw new Error("Division by zero.");
                }
                return leftOperand / rightOperand;
            default:
                throw new Error("Invalid operator.");
        }
    }
}
