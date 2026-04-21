/**
 * Part 3 – Multi-Agent CLI Assistant
 *
 * Execution flow:
 *   User Input → Router Agent (+ guardrail) → Specialist Agent (+ optional tool) → Output
 *
 * LLM Configuration levels demonstrated:
 *   • Global  : setDefaultOpenAIKey()  — sets the API key for the entire process
 *   • Runner  : new Runner({ model })  — sets a default model for every run via this runner
 *   • Agent   : new Agent({ model })   — each agent in agents/ can override the model
 *                                        (see mathAgent / programmingAgent / generalAgent)
 *
 * Tracing:
 *   Enabled by default in Node.js. Disable by setting OPENAI_AGENTS_DISABLE_TRACING=1 in .env
 *   or by passing tracingDisabled: true to the Runner constructor (shown below as an option).
 *
 * Run with:  npm run cli
 */
import 'dotenv/config';
import * as readline from 'node:readline';
import OpenAI from 'openai';
import {
  Runner,
  setDefaultOpenAIClient,
  setOpenAIAPI,
  InputGuardrailTripwireTriggered,
} from '@openai/agents';
import { routerAgent } from './agents/routerAgent.js';

// ── Guard: require API key ────────────────────────────────────────────────
if (!process.env.GROQ_API_KEY) {
  console.error('Error: GROQ_API_KEY is not set in .env');
  process.exit(1);
}

// ── Global-level configuration (Groq via OpenAI-compatible API) ──────────
const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});
setDefaultOpenAIClient(groqClient);
// Groq uses the Chat Completions interface
setOpenAIAPI('chat_completions');

// ── Runner-level configuration ────────────────────────────────────────────
// The Runner acts as the execution engine.  Setting a model here provides a
// fallback default for any Agent that doesn't specify its own model.
// tracingDisabled can be toggled here OR via the env var shown in .env.example.
const runner = new Runner({
  // Agent-level model settings (inside agents/*.ts) override this default.
  modelSettings: { temperature: 0.4 },
  // Uncomment to disable tracing programmatically (alternative to env var):
  // tracingDisabled: true,
});

// ── CLI helpers ────────────────────────────────────────────────────────────
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(question);
    rl.once('line', resolve);
  });
}

// ── Core: process one user message through the agent pipeline ─────────────
async function processMessage(userInput: string): Promise<void> {
  console.log('\n[Router] Classifying and routing your request…\n');

  try {
    // runner.run() is the Runner-level execution method (equivalent to run()).
    // All three LLM config levels are now active:
    //   Global  → API key via setDefaultOpenAIKey()
    //   Runner  → modelSettings.temperature via new Runner({ modelSettings })
    //   Agent   → each Agent can set its own model / modelSettings
    const result = await runner.run(routerAgent, userInput);

    console.log('─'.repeat(56));
    console.log(result.finalOutput ?? '(no output)');
    console.log('─'.repeat(56));
  } catch (err) {
    if (err instanceof InputGuardrailTripwireTriggered) {
      // err.result.output.outputInfo contains the object returned by our guardrail
      const info = err.result.output.outputInfo as { message?: string } | undefined;
      console.log('\n⛔  Guardrail triggered:');
      console.log(
        info?.message ??
          'Your request was blocked by the content safety guardrail.',
      );
    } else {
      console.error('\n[Error]', (err as Error).message);
    }
  }
}

// ── Main loop ─────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║          Multi-Agent CLI Assistant                   ║');
  console.log('║  Powered by OpenAI Agents SDK  |  Type "exit" to quit ║');
  console.log('╚══════════════════════════════════════════════════════╝\n');
  console.log('Available specialist agents:');
  console.log('  🔢  Math Agent        — arithmetic, algebra, equations');
  console.log('  💻  Programming Agent — code, debugging, algorithms');
  console.log('  🌍  General Agent     — history, science, general facts\n');
  console.log(
    `Tracing: ${process.env.OPENAI_AGENTS_DISABLE_TRACING === '1' ? 'disabled' : 'enabled (view at platform.openai.com/traces)'}\n`,
  );

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const input = await prompt('You: ');
    const trimmed = input.trim();

    if (!trimmed) continue;

    if (['exit', 'quit', 'q'].includes(trimmed.toLowerCase())) {
      console.log('\nGoodbye!');
      rl.close();
      break;
    }

    await processMessage(trimmed);
    console.log();
  }
}

main().catch((err: unknown) => {
  console.error('Fatal error:', (err as Error).message);
  process.exit(1);
});
