/**
 * Part 2 – Hello World Agent
 *
 * Verifies that the SDK is installed and the API key is configured.
 * Run with:  npm run hello
 *
 * LLM Configuration demonstrated here: GLOBAL level
 *   setDefaultOpenAIKey() sets the API key for every agent in the process.
 */
import 'dotenv/config';
import OpenAI from 'openai';
import { Agent, run, setDefaultOpenAIClient, setOpenAIAPI } from '@openai/agents';

// ── Global-level LLM configuration (Groq via OpenAI-compatible API) ────────
if (!process.env.GROQ_API_KEY) {
  console.error('Error: GROQ_API_KEY is not set in .env');
  process.exit(1);
}
const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});
setDefaultOpenAIClient(groqClient);
// Groq uses the Chat Completions interface
setOpenAIAPI('chat_completions');

// ── Agent definition ──────────────────────────────────────────────────────
const agent = new Agent({
  name: 'Assistant',
  instructions: 'You are a helpful assistant.',
  model: 'llama-3.3-70b-versatile',
});

// ── Run ───────────────────────────────────────────────────────────────────
console.log('=== Hello World Agent ===\n');

const result = await run(agent, 'Say hello and introduce yourself in two sentences.');

console.log('Agent:', result.finalOutput);
console.log('\n✓ SDK is working correctly.');
