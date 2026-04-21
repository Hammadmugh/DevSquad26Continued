import { tool } from '@openai/agents';
import { z } from 'zod';

/**
 * Safely evaluates a basic arithmetic expression.
 * Only allows digits, basic operators (+, -, *, /), parentheses, and decimals.
 * Uses a whitelist regex to prevent injection before using Function constructor.
 */
function safeEvaluate(expression: string): number {
  const sanitized = expression.trim();

  // Whitelist: only digits, operators, parentheses, decimal point, whitespace
  if (!/^[\d\s+\-*/().]+$/.test(sanitized)) {
    throw new Error(
      'Invalid expression. Only numbers and operators (+, -, *, /) are allowed.',
    );
  }

  // Reject empty or obviously invalid expressions
  if (sanitized.length === 0 || sanitized.length > 200) {
    throw new Error('Expression is empty or too long.');
  }

  let result: unknown;
  try {
    // eslint-disable-next-line no-new-func
    result = new Function(`"use strict"; return (${sanitized})`)();
  } catch {
    throw new Error('Could not evaluate the expression. Check syntax.');
  }

  if (typeof result !== 'number' || !isFinite(result)) {
    throw new Error('Expression did not produce a valid finite number.');
  }

  return result;
}

/**
 * Calculator tool — evaluates arithmetic expressions.
 * Math Agent uses this tool for all numerical computations.
 */
export const calculatorTool = tool({
  name: 'calculator',
  description:
    'Evaluates a mathematical expression and returns the numeric result. ' +
    'Supports +, -, *, / and parentheses. ' +
    'Example: "(3 + 5) * 2" returns 16.',
  parameters: z.object({
    expression: z
      .string()
      .describe('The arithmetic expression to evaluate, e.g. "(3 + 5) * 2"'),
  }),
  execute: async ({ expression }) => {
    try {
      const result = safeEvaluate(expression);
      return `Result of "${expression}" = ${result}`;
    } catch (err) {
      return `Calculator error: ${(err as Error).message}`;
    }
  },
});
