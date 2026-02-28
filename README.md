# Riseva — Teacher-Controlled AI Learning System

**Live Demo:** [https://riseva.vercel.app](https://riseva.vercel.app) *(deploy to your own Vercel for full AI functionality)*

Riseva is a web application that lets teachers configure an AI tutor for their students. Unlike generic AI tools, Riseva keeps the teacher in control: they define what topics to cover, what depth of understanding to target, what teaching approach to use, and what boundaries the AI must follow. Students then interact with a chatbot that teaches through guided questioning — never giving away answers — while analytics flow back to teachers showing misconceptions, mastery levels, and engagement.

## What It Does

### Teacher Side
- **Dashboard** — Live overview of student activity, mastery stats, and top misconceptions across all classes
- **Courses & Units** — Organize curriculum into courses with configurable learning units
- **Unit Configuration** — Per-unit control over:
  - Learning objectives (add, remove, set depth: Explain/Analyze/Apply/Synthesize)
  - Teaching approach (Socratic, step-by-step, conceptual-first, example-driven)
  - Scaffolding level (1-5 slider controlling how much support the AI gives)
  - Safety boundaries (toggles that get injected into the AI's system prompt)
  - Allowed reference sources
- **Student Insights** — Interactive analytics dashboard with:
  - Recharts-powered engagement bar chart (switchable between sessions/minutes/questions)
  - Mastery + engagement area chart over time
  - Radar chart comparing class average vs. top quartile per objective
  - Pie chart showing mastery distribution across students
  - Color-coded mastery heatmap (students × objectives)
  - Filterable misconception list with severity and trend indicators
- **AI Settings** — Global configuration for response length, tone, hint limits, capabilities, and safety guardrails

### Student Side
- **Learning Home** — Personal progress dashboard with unit mastery rings, topic confidence, streak tracking, and learning tips
- **AI Chat** — Full tutoring interface that:
  - Streams responses from OpenAI (or falls back to demo mode without an API key)
  - Follows the teacher's configured approach, boundaries, and objectives
  - Supports quick actions: "Explain differently", "Give me a hint", "Practice problem", "Why is this important?"
  - Persists chat history across sessions via localStorage
  - Shows learning objectives, session stats, and current AI configuration in a sidebar

## Features I'm Most Proud Of

1. **The system prompt builder** (`src/lib/buildSystemPrompt.ts`) — Takes the entire teacher configuration (approach, tone, scaffolding, boundaries, objectives, sources) and constructs a detailed system prompt that controls AI behavior. This is the core innovation: the teacher's intent becomes the AI's instructions.

2. **Streaming chat with graceful fallback** — The chat interface streams tokens from OpenAI in real-time via Server-Sent Events. If no API key is configured, it automatically falls back to realistic mock responses so the full UX is still demonstrable.

3. **The interactive Recharts analytics** — Four distinct chart types (bar, area, radar, pie) with tooltips, legends, and a metric switcher, giving teachers real insight into student understanding.

4. **Full configuration persistence** — All teacher settings save to localStorage and flow through to the student chat. Change the teaching approach in settings → the AI's behavior changes in the next student session.

## How to Use

1. Start at the **landing page** to understand the system
2. Click **"Explore Teacher Dashboard"** to see the teacher experience
3. Go to **AI Settings** to configure how the AI teaches (try changing the approach or toggling boundaries)
4. Click **Save Settings**
5. Navigate to **Student View** (link in the sidebar) → **Continue Learning** or any unit
6. Chat with the AI tutor — notice how it follows the teacher's configured approach
7. Go back to **Student Insights** to see the analytics dashboard
8. Try the quick action buttons in the chat: "Give me a hint", "Practice problem", etc.

## How to Run Locally

```bash
git clone https://github.com/nypatel1/test.git
cd test
git checkout cursor/riseva-system-prototype-edd3
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### With Real AI (Optional)

Create a `.env.local` file in the project root:

```
OPENAI_API_KEY=sk-your-key-here
```

Restart the dev server. The student chat will now use OpenAI GPT-4o-mini with streaming responses. Without this key, the chat works in demo mode with pre-written responses.

## How Secrets Are Handled

- The OpenAI API key is **never committed to the repository** or exposed to the client
- It's stored as an environment variable (`OPENAI_API_KEY`) in `.env.local` locally or in Vercel's environment variable settings for production
- `.env*` is in `.gitignore`
- The API key is only used server-side in the Next.js API route (`/api/chat`)
- If the key is missing, the app gracefully falls back to demo mode — no errors, no broken UI

## Deploying to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com), import the repository
3. Add the environment variable `OPENAI_API_KEY` in Vercel's project settings
4. Deploy — Vercel handles everything automatically for Next.js

## Tech Stack

- **Next.js 16** (App Router) — React framework with API routes
- **TypeScript** — Type safety throughout
- **Tailwind CSS 4** — Utility-first styling
- **OpenAI API** (GPT-4o-mini) — AI chat responses via streaming SSE
- **Recharts** — Interactive data visualization (bar, area, radar, pie charts)
- **Lucide React** — Icon library
- **localStorage** — Client-side persistence for settings and chat history

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts          # OpenAI streaming API endpoint
│   ├── components/                 # Shared UI components (Logo, Sidebar, Layout)
│   ├── student/
│   │   ├── chat/page.tsx          # AI tutoring chat interface
│   │   └── learn/page.tsx         # Student learning home
│   ├── teacher/
│   │   ├── courses/               # Course & unit management
│   │   │   ├── [id]/             # Unit detail with AI configuration
│   │   │   └── page.tsx
│   │   ├── dashboard/page.tsx     # Teacher dashboard
│   │   ├── insights/              # Analytics with Recharts
│   │   │   ├── page.tsx
│   │   │   └── ChartsSection.tsx
│   │   └── settings/page.tsx      # Global AI configuration
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                   # Landing page
└── lib/
    ├── buildSystemPrompt.ts       # Converts teacher config → AI system prompt
    ├── storage.ts                 # localStorage read/write utilities
    ├── types.ts                   # Shared TypeScript types & defaults
    └── useIsMounted.ts            # SSR-safe mounting hook
```
