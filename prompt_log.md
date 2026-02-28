# Prompt Log — Riseva Project

## AI Models/Tools Used
- **Claude** (Cursor AI Agent) — Primary development assistant for code generation, architecture planning, and debugging
- **ChatGPT** — Initial brainstorming for product positioning and feature specification (the "Here is what ChatGPT says" input in the project description)
- **OpenAI GPT-4o-mini** — Runtime AI model used in the student chat feature (via API)

---

## Development Process

### Phase 1: Concept & Architecture Planning

**Prompt:** Described the full Riseva concept — a teacher-controlled AI learning system for schools with teacher dashboard, student chat interface, and insight analytics. Asked for a front-end prototype with mockup data.

**What was generated:** Initial project scaffold with Next.js 16, TypeScript, and Tailwind CSS. The basic page structure for all routes was created.

**What I did:** Refined the product concept using ChatGPT's positioning (teacher-controlled AI for mastery-based learning), decided on the AP Biology example data to make the prototype feel realistic, and specified which pages/features were needed.

---

### Phase 2: Static Prototype (UI/UX Mockup)

**Prompt:** Build the front-end prototype with:
- Landing page explaining the closed-loop system
- Teacher dashboard with live activity
- Courses & units management
- Unit configuration with teaching approach, boundaries, scaffolding
- Student insights with heatmap
- Student learning home
- AI chat interface with example conversation

**What was generated:** All 8 pages of static UI with mock data, custom color system, animations, and responsive layout. The Teacher Sidebar component, Logo component, and Teacher Layout wrapper were created.

**What I modified:**
- Reviewed and adjusted the color palette in globals.css to ensure proper contrast
- Verified the navigation links and page routing worked correctly
- Cleaned up unused imports that the linter flagged

---

### Phase 3: Deployment Setup

**Prompt:** Configure for GitHub Pages deployment

**What was generated:** Static export configuration in next.config.ts, GitHub Actions workflow, and generateStaticParams for dynamic routes.

**Issues encountered:**
- The package-lock.json contained Linux-specific SWC binaries that broke on macOS — removed it from git
- GitHub Actions failed because `npm ci` requires a lock file — switched to `npm install`
- Turbopack caused WASM fallback issues on macOS ARM — added `dev:no-turbo` script

**What I did:** Debugged each deployment issue, understood why cross-platform binary incompatibilities occur, and decided the workflow needed `npm install` instead of `npm ci`.

---

### Phase 4: Making It Functional (The Real Work)

This is where the project went from mockup to working application. ~3 hours of focused work.

#### 4a. System Prompt Builder

**Prompt:** Create the core system — an API route that takes teacher configuration and builds an AI system prompt, then streams responses from OpenAI.

**What was generated:** `buildSystemPrompt.ts` and `/api/chat/route.ts`

**What I wrote/substantially modified:**
- **`buildSystemPrompt.ts`** — This is the most important file in the project. I designed how teacher configuration maps to AI instructions: how approach selection becomes pedagogical directives, how boundaries become strict rules, how scaffolding level affects guidance depth. The prompt engineering here is the core innovation — teacher intent → AI behavior.
- **`/api/chat/route.ts`** — I structured the streaming SSE response format and the error handling that triggers mock fallback mode.

**Key design decisions I made:**
- Use SSE (Server-Sent Events) for streaming instead of WebSockets — simpler, works with Vercel serverless
- Limit conversation context to last 20 messages to stay within token limits
- Return a 503 status when no API key is set (not a 500) so the client knows to switch to demo mode

#### 4b. localStorage Persistence Layer

**Prompt:** Add localStorage persistence for teacher config and chat history

**What was generated:** `storage.ts` with get/save functions for config, progress, and chat history

**What I modified:** Added `safeGet`/`safeSet` wrappers with try-catch for storage quota errors, and ensured all functions handle the SSR case (`typeof window === "undefined"`).

#### 4c. Functional Teacher Settings

**What I did:** Rewrote the AI Settings page to:
- Load config from localStorage on mount
- Every toggle, radio button, and slider updates local state
- "Save" button persists to localStorage with visual confirmation
- Configuration summary updates in real-time

**Lint challenge:** Next.js 16's ESLint rules flag `setState` inside `useEffect` as an error. I solved this by:
1. Using lazy state initialization (`useState(() => { ... })`) to read localStorage during state init instead of in an effect
2. Creating a `useIsMounted` hook using `useSyncExternalStore` to detect client-side rendering without triggering the lint rule

#### 4d. Streaming Chat Interface

**What I wrote/substantially modified:**
- The `sendToAPI` function that handles SSE streaming — reading chunks from a ReadableStream, parsing SSE `data:` lines, accumulating content, and updating the message in-place as tokens arrive
- The fallback logic: if the API returns 503 (no key) or any fetch error, automatically switch to demo mode with mock responses
- Chat history persistence — messages save to localStorage after each AI response completes

#### 4e. Interactive Recharts Visualizations

**Prompt:** Add Recharts interactive charts to the insights page

**What was generated:** ChartsSection.tsx with 4 chart types

**What I modified:**
- Added the engagement metric switcher (dropdown to toggle between sessions/minutes/questions on the bar chart)
- Configured gradient fills for the area chart
- Set up the radar chart to compare class average vs. top quartile
- Added the misconception severity filter with a dropdown

---

### Phase 5: Documentation & Polish

**What I did:**
- Wrote this prompt log documenting the full development process
- Wrote the README with usage instructions, architecture explanation, and deployment guide
- Final lint pass and build verification
- Ensured the app works fully in demo mode (no API key required to experience the UI)

---

## Important Non-Trivial Prompts

### Prompt 1: Initial Architecture
> "We provide a way for teachers to create a model designed to only help students learn, focusing on the topics being addressed in class... Create the front end for this system to visualize what it would look like for teachers, and also on the student side."

This prompt established the full scope — teacher dashboard, student chat, analytics, and the closed-loop concept.

### Prompt 2: Functional Chat System
> "Create /api/chat route that builds system prompt from teacher config and calls OpenAI... Wire up student chat to real AI with streaming responses + fallback mock mode"

This drove the core technical implementation — the API route, streaming, and graceful degradation.

### Prompt 3: Fixing ESLint Issues
> (Iterative debugging of `setState in effect` errors)

This led to learning about `useSyncExternalStore` and proper SSR-safe patterns in Next.js 16 with React 19.

---

## Summary of What I Wrote vs. AI-Generated

| Component | AI Generated | I Wrote/Modified |
|-----------|-------------|-----------------|
| Project scaffold & routing | ✅ | |
| UI components & layout | ✅ | Reviewed & adjusted |
| `buildSystemPrompt.ts` | Initial structure | ✅ Designed prompt engineering logic |
| `/api/chat/route.ts` | Initial structure | ✅ Streaming SSE, error handling, fallback |
| `storage.ts` | ✅ | Added error handling |
| Student chat streaming logic | | ✅ Full sendToAPI function |
| Recharts configuration | Base setup | ✅ Metric switcher, gradients, radar |
| `useIsMounted.ts` | | ✅ Solved SSR lint issue |
| Teacher settings state mgmt | | ✅ Rewired to localStorage |
| README.md | | ✅ |
| prompt_log.md | | ✅ |
| Deployment debugging | | ✅ All troubleshooting |

**Estimated time:** ~5.5 hours total (1hr planning, 1hr static mockup, 0.5hr deployment, 2.5hrs functional features, 0.5hr docs)
