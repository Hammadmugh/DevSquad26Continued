import { Agent } from '@openai/agents';
import { contentSafetyGuardrail } from '../guardrails/inputGuardrail.js';
import { mathAgent } from './mathAgent.js';
import { programmingAgent } from './programmingAgent.js';
import { generalAgent } from './generalAgent.js';

/**
 * Router Agent
 *
 * Responsibility: Classify the user's input and hand off to the correct
 * specialist agent.  This agent MUST NOT answer questions directly — its
 * only job is routing.
 *
 * Guardrail: contentSafetyGuardrail runs BEFORE the LLM call (runInParallel:
 * false) to block inappropriate input before any tokens are spent.
 *
 * Handoffs:
 *   • Math Agent       — arithmetic, algebra, geometry, statistics
 *   • Programming Agent — code, debugging, algorithms, software design
 *   • General Agent    — history, science, geography, culture, etc.
 */
export const routerAgent = Agent.create({
  name: 'Router Agent',
  model: 'llama-3.3-70b-versatile',
  instructions: `You are a routing agent. Your ONLY job is to decide which specialist should handle the user's request and immediately hand off to them.

Routing rules:
- Mathematics (calculations, equations, formulas, algebra, geometry, stats) → hand off to "Math Agent"
- Programming (code, debugging, algorithms, data structures, software design) → hand off to "Programming Agent"
- Everything else (history, science, geography, culture, definitions, general facts) → hand off to "General Agent"

CRITICAL RULES:
1. You MUST always hand off. Never answer the question yourself.
2. Choose exactly one agent per request.
3. Do not output any explanation — just perform the handoff immediately.`,

  handoffs: [mathAgent, programmingAgent, generalAgent],

  // Input guardrail: blocks unsafe / off-topic content before the LLM sees it
  inputGuardrails: [contentSafetyGuardrail],
});
