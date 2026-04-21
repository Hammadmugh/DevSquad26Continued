import type { InputGuardrail } from '@openai/agents';

/**
 * Keyword list of patterns that are blocked for work-safety and security.
 * Any user input matching one of these patterns will trip the guardrail.
 */
const BLOCKED_PATTERNS: string[] = [
  'hack',
  'exploit',
  'malware',
  'phishing',
  'ransomware',
  'ddos',
  'sql injection',
  'xss',
  'zero-day',
  'brute force',
  'password crack',
  'violence',
  'weapon',
  'bomb',
  'illegal',
  'nsfw',
  'pornograph',
  'explicit content',
  'hate speech',
];

/**
 * Content Safety Guardrail — attached to the Router Agent as an INPUT guardrail.
 *
 * Runs BEFORE the LLM is called (runInParallel: false) so that no tokens are
 * consumed on a blocked request.  If the input matches a blocked pattern the
 * guardrail trips, throwing InputGuardrailTripwireTriggered, and the CLI
 * catches it with a friendly message.
 */
export const contentSafetyGuardrail: InputGuardrail = {
  name: 'content-safety-guardrail',

  // Run BEFORE the model call to save tokens and prevent processing unsafe input
  runInParallel: false,

  execute: async ({ input }) => {
    // Normalise input to a plain string for matching
    const text =
      typeof input === 'string'
        ? input.toLowerCase()
        : JSON.stringify(input).toLowerCase();

    const matched = BLOCKED_PATTERNS.find((pattern) => text.includes(pattern));

    if (matched) {
      return {
        tripwireTriggered: true,
        outputInfo: {
          blocked: true,
          matchedPattern: matched,
          message: `Your request was blocked because it contains content related to "${matched}". Please keep queries work-appropriate.`,
        },
      };
    }

    return {
      tripwireTriggered: false,
      outputInfo: { blocked: false },
    };
  },
};
