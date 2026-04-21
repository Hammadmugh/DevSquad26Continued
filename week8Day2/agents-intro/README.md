# agents-intro

A multi-agent CLI assistant built with the **OpenAI Agents SDK** (TypeScript).

---

## Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [How to Run](#how-to-run)
3. [Agent Roles](#agent-roles)
4. [Tools](#tools)
5. [Handoff Flow](#handoff-flow)
6. [Theory Notes](#theory-notes)
   - [What is Agentic AI?](#1-what-is-agentic-ai)
   - [Core SDK Concepts](#2-core-concepts-in-openai-agents-sdk)
   - [LLM Configuration Levels](#3-llm-configuration-levels)
   - [Prompt-based vs Agent-based](#4-prompt-based-llm-vs-agent-based-systems)
7. [Tracing & Observability](#tracing--observability)

---

## Setup Instructions

### Prerequisites

- **Node.js 22+** (required by `@openai/agents`)
- A **Groq API key** — sign up free at [console.groq.com](https://console.groq.com) → API Keys

### 1. Install dependencies

```bash
cd agents-intro
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and set your Groq API key:

```env
GROQ_API_KEY=gsk_your-key-here
```

That's it — no other keys needed.

---

## How to Run

### Hello World (Part 2 verification)

```bash
npm run hello
```

Confirms the SDK is installed and the API key works. Runs a single-agent interaction and prints the response.

### Multi-Agent CLI (Part 3)

```bash
npm run cli
```

Starts an interactive terminal session. Type any question and the Router Agent will route it to the correct specialist.

Example inputs to try:

```
You: What is (123 * 456) + 789?
You: Write a TypeScript function that reverses a string
You: Who was the first person to walk on the moon?
You: exit
```

---

## Project Structure

```
agents-intro/
├── src/
│   ├── index.ts                  # Hello World agent (Part 2)
│   ├── cli.ts                    # Multi-agent CLI entry point (Part 3)
│   ├── agents/
│   │   ├── routerAgent.ts        # Router Agent (with guardrail + handoffs)
│   │   ├── mathAgent.ts          # Math Agent (uses calculator tool)
│   │   ├── programmingAgent.ts   # Programming Agent (uses word_counter tool)
│   │   └── generalAgent.ts       # General Agent (no tools)
│   ├── tools/
│   │   ├── calculator.ts         # Arithmetic expression evaluator
│   │   └── wordCounter.ts        # Text/code metrics analyzer
│   └── guardrails/
│       └── inputGuardrail.ts     # Content safety input guardrail
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

## Agent Roles

### Router Agent

- **Purpose:** The entry point for every user message.
- **Behavior:** Classifies the intent (math / programming / general) and immediately hands off to the appropriate specialist. It **never answers directly**.
- **Guardrail:** `contentSafetyGuardrail` runs before the LLM sees the input, blocking inappropriate content.
- **Handoffs:** → Math Agent | Programming Agent | General Agent

### Math Agent

- **Purpose:** Handles all mathematics — arithmetic, algebra, geometry, statistics.
- **Tool:** `calculator` — evaluates arithmetic expressions safely (whitelist-validated input, no raw `eval`).
- **Behavior:** Breaks problems into steps, uses the calculator tool for every computation, explains reasoning.

### Programming Agent

- **Purpose:** Handles programming, debugging, algorithms, data structures, software design.
- **Tool:** `word_counter` — analyzes code/text for word count, line count, and character count.
- **Behavior:** Provides working code examples with explanations. Uses the word_counter when the user asks about code metrics.

### General Agent

- **Purpose:** Handles all other topics — history, science, geography, culture, general facts.
- **Tool:** None (general knowledge from the LLM's training data).
- **Behavior:** Gives concise, factual answers.

---

## Tools

### `calculator` (Math Agent)

- **Input:** `expression: string` — an arithmetic expression e.g. `"(3 + 5) * 2"`
- **Security:** Validates input against a whitelist regex (`/^[\d\s+\-*/().]+$/`) before evaluation. Rejects anything that isn't pure arithmetic.
- **Output:** `Result of "..." = <number>`

### `word_counter` (Programming Agent)

- **Input:** `text: string` — any text or code snippet
- **Output:** Word count, line count, characters with/without spaces

---

## Handoff Flow

```
User Input
    │
    ▼
Router Agent  ← contentSafetyGuardrail (blocks before LLM)
    │
    ├──── Math query        ──► Math Agent ──► calculator tool ──► Answer
    │
    ├──── Programming query ──► Programming Agent ──► word_counter tool ──► Answer
    │
    └──── General query     ──► General Agent ──► Answer
```

The Router Agent uses `handoffs: [mathAgent, programmingAgent, generalAgent]` — the SDK presents these as `transfer_to_math_agent`, `transfer_to_programming_agent`, and `transfer_to_general_agent` function calls to the LLM.

---

## Theory Notes

### 1. What is Agentic AI?

#### Single-Prompt LLM vs Agents

| | Single-Prompt LLM | Agent |
|---|---|---|
| **State** | Stateless — no memory between calls | Stateful — maintains context across steps |
| **Goal** | Completes a single task per call | Pursues a goal over multiple steps |
| **Actions** | Generates text only | Can call tools, delegate to other agents, loop |
| **Control flow** | One call → one response | Loop: think → act → observe → repeat |

#### Why agents are stateful, goal-driven, and tool-using

- **Stateful:** An agent remembers what it has done in the current run (previous tool calls, prior LLM outputs) and uses that history to decide the next step.
- **Goal-driven:** Given a high-level objective ("plan a trip"), an agent breaks it into sub-tasks and persists until the goal is achieved — not just until one response is generated.
- **Tool-using:** Agents are connected to real capabilities (APIs, databases, calculators) rather than relying solely on the LLM's parametric knowledge, making their outputs more accurate and grounded.

#### Real-world examples

- **POS assistant:** Takes customer orders, checks inventory via a tool, calculates totals with a calculator tool, and updates the database.
- **Customer support bot:** Classifies the issue, retrieves the customer's account via an API tool, and either resolves or escalates.
- **Planner agent:** Breaks down a large project into tasks, assigns priorities, and iteratively refines the plan based on feedback.
- **Code review agent:** Reads source code, runs tests, and produces a structured review — all orchestrated across multiple tool calls.

---

### 2. Core Concepts in OpenAI Agents SDK

#### Agent

An `Agent` is an LLM with a fixed **identity** and **purpose**, defined by:

- **`name`** — human-readable identifier (used in tracing and handoff tool names).
- **`instructions`** — the system prompt that defines the agent's role, rules, and behavior. Think of it as the agent's job description.
- **`model`** / **`modelSettings`** — which LLM to use and how (temperature, toolChoice, etc.).
- **`tools`** — functions the agent can call.
- **`handoffs`** — other agents it can delegate to.
- **`inputGuardrails`** / **`outputGuardrails`** — safety checks.

#### Tool

A tool is a **typed, executable function** the LLM can invoke by name. Tools are defined with a Zod schema so the LLM receives a JSON schema describing the arguments. When the model decides to call a tool, the SDK validates the arguments and executes the `execute` function.

> **Why agents must not hallucinate tool results:** The LLM must actually call the tool and wait for the real result. If the agent fabricates a number instead of calling the calculator, the output is unreliable and the whole point of grounding is lost. The SDK enforces this by separating "model decides to call tool" from "SDK executes the function and returns the result".

#### Handoff

A handoff transfers the conversation from one agent to another. The current agent calls a generated `transfer_to_<agent_name>` function, and the SDK switches the active agent. This is how specialization is achieved in multi-agent systems.

> **Why multiple agents?** Different tasks require different expertise, different tools, and sometimes different models. A single monolithic agent with dozens of tools becomes unpredictable. Splitting responsibilities keeps each agent focused and reliable.

> **When to hand off:** When the user's intent is outside your agent's domain, or when a more specialized capability (tool set, instructions, model) is needed to complete the task accurately.

#### Guardrail

A guardrail is a validation function that runs on the input (before the LLM) or output (after the LLM):

- **Input guardrail:** Can block a request before tokens are spent. Used for content safety, PII detection, or scope enforcement.
- **Output guardrail:** Validates or filters the LLM's response before it is returned to the user.
- **Tripwire:** When `tripwireTriggered: true` is returned, the SDK throws `InputGuardrailTripwireTriggered` or `OutputGuardrailTripwireTriggered`, halting execution immediately.

#### Runner

The `Runner` is the **execution engine** — it manages the agent loop:

1. Call the LLM
2. If the model returns a tool call → execute the tool, append the result, go to step 1
3. If the model returns a handoff → switch the active agent, go to step 1
4. If the model returns a final text response → return the result

```typescript
// Top-level convenience (uses a default runner internally)
const result = await run(agent, 'user input');

// Explicit Runner (lets you configure model, tracing, modelSettings globally)
const runner = new Runner({ modelSettings: { temperature: 0.4 } });
const result = await runner.run(agent, 'user input');

// Sync variant (blocks until done)
const result = runner.runSync(agent, 'user input');
```

#### Tracing

Tracing records every event in an agent run — LLM calls, tool invocations, handoffs, and guardrail checks — as a tree of **spans** inside a **trace**.

> **Why observability matters:** In a multi-step agentic system you cannot simply print the final answer and call it a day. You need to know: which tool was called, what arguments were passed, which agent made the decision, and how long each step took. Without tracing, debugging is guesswork.

Traces are sent to the [OpenAI Traces dashboard](https://platform.openai.com/traces) by default in Node.js. Each span includes timestamps, inputs, outputs, and nesting context.

---

### 3. LLM Configuration Levels

The SDK provides three configuration layers, from broadest to narrowest:

#### Global level

```typescript
import OpenAI from 'openai';
import { setDefaultOpenAIClient, setOpenAIAPI } from '@openai/agents';

// Use a custom OpenAI-compatible client (e.g. Groq, Azure, OpenRouter)
const groqClient = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});
setDefaultOpenAIClient(groqClient);
setOpenAIAPI('chat_completions'); // required for non-OpenAI providers
```

**When to use:** App startup, when all agents share the same provider and credentials.  
**Example use case:** A Node.js server that always calls Groq — one `setDefaultOpenAIClient()` at boot and nothing else needs to be configured.

#### Runner level

```typescript
import { Runner } from '@openai/agents';

const runner = new Runner({
  model: 'llama-3.3-70b-versatile',       // default model for all agents via this runner
  modelSettings: { temperature: 0.3 },    // default settings
  tracingDisabled: true,                  // disable tracing for this runner
});
```

**When to use:** When you want a specific execution configuration for a subset of runs (e.g. a batch-processing runner vs an interactive runner).  
**Example use case:** A background data-extraction pipeline that needs deterministic, low-temperature outputs — configured on a dedicated `Runner`.

#### Agent level

```typescript
import { Agent } from '@openai/agents';

const mathAgent = new Agent({
  name: 'Math Agent',
  model: 'llama-3.3-70b-versatile',       // this agent always uses this model
  modelSettings: { temperature: 0.0 },    // maximum determinism for calculations
  instructions: '...',
  tools: [calculatorTool],
});
```

**When to use:** When different agents in the same system need different models or settings (e.g. a cheap fast model for routing, a smarter model for reasoning).  
**Example use case:** A router agent uses a small fast model for classification while the code-writing agent uses a larger model for quality output.

> **Why agent-level configuration is preferred:**  
> It keeps each agent self-contained and portable. You can test, reuse, or replace an agent independently without worrying about external configuration. It also makes the agent's behavior explicit and reviewable in one place.

---

### 4. Prompt-based LLM vs Agent-based Systems

| Dimension | Prompt-based LLM call | Agent-based system |
|---|---|---|
| **Invocation** | Single `chat.completions.create()` call | `run()` drives a multi-step loop |
| **Memory** | No memory across calls | Maintains run history across turns |
| **Actions** | Text generation only | Tool calls, handoffs, sub-agent delegation |
| **Reliability** | LLM may hallucinate facts | Tools ground outputs in real data |
| **Complexity** | Simple; one prompt → one response | Requires orchestration, error handling, tracing |
| **Scalability** | Hard to extend (one giant prompt) | Modular — add agents or tools independently |
| **Observability** | Hard to debug (single black box) | Built-in tracing per span |
| **Best for** | One-shot tasks: summarization, translation | Goal-driven tasks: research, coding, customer service |

**Summary:** Prompt-based calls are fast and simple for single-step tasks. Agentic systems are necessary whenever a task requires multiple steps, real-world data, specialized knowledge, or autonomous decision-making.

---

## Tracing & Observability

### What tracing shows

When tracing is enabled (the default in Node.js), every `run()` call produces a **trace** containing:

- **Agent spans** — which agent was active and for how long
- **Generation spans** — the LLM prompt, model response, and token usage
- **Function spans** — tool name, input arguments, and return value
- **Guardrail spans** — whether the guardrail passed or triggered
- **Handoff spans** — which agent handed off and to which target

You can view all traces at [platform.openai.com/traces](https://platform.openai.com/traces).

### How tracing helps debug agent decisions

In a multi-agent system it's common to wonder: "Why did the router send this math question to the General Agent?" Tracing shows the exact generation span — the LLM's decision — and you can inspect the model's reasoning and adjust the router's instructions accordingly.

During development of this project, tracing revealed:

- The Router Agent occasionally misclassified borderline questions (e.g. "What is the speed of light?" → Math Agent instead of General Agent). Adjusting the routing instructions fixed this.
- The calculator tool was being called with expressions containing `^` for exponentiation, which the whitelist blocked. The error return from the tool was visible in the function span, making it straightforward to handle.
- Guardrail spans showed the exact input that was blocked, confirming the content safety check was working as intended.

### Enabling / disabling tracing

```bash
# Disable globally via environment variable
OPENAI_AGENTS_DISABLE_TRACING=1 npm run cli

# Or in code, per Runner:
const runner = new Runner({ tracingDisabled: true });
```

Tracing is **disabled** when:
- `OPENAI_AGENTS_DISABLE_TRACING=1` is set
- `NODE_ENV=test`
- Running in a browser

Tracing is **enabled** by default in all server runtimes (Node.js, Deno, Bun).
