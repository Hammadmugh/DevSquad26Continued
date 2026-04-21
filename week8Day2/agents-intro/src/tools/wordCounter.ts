import { tool } from '@openai/agents';
import { z } from 'zod';

/**
 * Word Counter tool — analyzes text and returns word, character, and line counts.
 * Programming Agent uses this tool to analyze code snippets or text blocks.
 */
export const wordCounterTool = tool({
  name: 'word_counter',
  description:
    'Counts the number of words, characters (with and without spaces), ' +
    'and lines in a given piece of text or code snippet. ' +
    'Returns a JSON summary of the metrics.',
  parameters: z.object({
    text: z.string().describe('The text or code snippet to analyze'),
  }),
  execute: async ({ text }) => {
    const lines = text.split('\n');
    const words = text
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0);
    const charsWithSpaces = text.length;
    const charsWithoutSpaces = text.replace(/\s/g, '').length;

    const result = {
      wordCount: words.length,
      lineCount: lines.length,
      charsWithSpaces,
      charsWithoutSpaces,
    };

    return (
      `Analysis complete:\n` +
      `  Words:                  ${result.wordCount}\n` +
      `  Lines:                  ${result.lineCount}\n` +
      `  Characters (w/ spaces): ${result.charsWithSpaces}\n` +
      `  Characters (no spaces): ${result.charsWithoutSpaces}`
    );
  },
});
