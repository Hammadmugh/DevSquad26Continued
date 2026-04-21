import { Agent } from '@openai/agents';
import { calculatorTool } from '../tools/calculator.js';

/**
 * Math Agent
 *
 * Responsibility: Handle all mathematics-related queries — arithmetic,
 * algebra, geometry, statistics, and mathematical concepts.
 *
 * Tool: calculator — used for every numerical computation so the model
 * never "makes up" a result.
 */
export const mathAgent = new Agent({
  name: 'Math Agent',
  model: 'llama-3.3-70b-versatile',
  instructions: `You are a mathematics specialist assistant.

Your responsibilities:
- Solve arithmetic, algebra, geometry, statistics, and calculus problems
- Explain mathematical concepts clearly with step-by-step reasoning
- For ALL numerical calculations, use the calculator tool — never compute mentally

When solving problems:
1. Break the problem into steps
2. Use the calculator tool for each computation step
3. Show your reasoning clearly
4. Present the final answer

Stay focused on mathematics. If asked about programming or general knowledge, politely note you specialise in math.`,
  tools: [calculatorTool],
});
