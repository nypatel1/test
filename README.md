# Riseva — Teacher-Controlled AI Learning System

**Live Demo:** [https://test-seven-rouge-40.vercel.app](https://test-seven-rouge-40.vercel.app)

Riseva is a web application that lets teachers configure an AI tutor for their students. Teachers define topics, learning objectives, teaching approach, and safety boundaries. Students then interact with a chatbot that follows the teacher's configuration — teaching through guided questioning, never giving away answers. Analytics flow back to teachers showing what students are asking and how they're engaging.

## What It Does

### Teacher Side
- **Sign up as Teacher** → create an account and access the teacher portal
- **Create courses** → each gets a unique **class code** (e.g., `AB3X9K`) to share with students
- **Add units** to courses → each unit has its own AI configuration
- **Configure the AI per unit:**
  - Learning objectives (what students should understand)
  - Teaching approach (Socratic, step-by-step, conceptual-first, example-driven)
  - Scaffolding level (how much support the AI gives)
  - Response style (length and tone)
  - Safety boundaries (toggles injected into the AI's system prompt)
  - Allowed sources
  - **Upload course materials** (PDF, TXT, or paste text) — the AI uses these as its primary reference
- **View student insights** — charts showing sessions, messages, time spent, and actual student questions
- **Dashboard** — overview of all courses, recent sessions, and activity stats

### Student Side
- **Sign up as Student** → enter a teacher's class code to join their course
- **See enrolled courses and units** → click a unit to start a tutoring session
- **Chat with the AI tutor** — the AI follows the teacher's configured approach, boundaries, and objectives
- **Quick actions** — "Explain differently", "Give me a hint", "Practice problem", "Why is this important?"
- Sessions are tracked and saved to the database

## Features I'm Most Proud Of

1. **The system prompt builder** (`src/lib/buildSystemPrompt.ts`) — Takes the teacher's entire configuration and constructs a detailed system prompt. This is the core innovation: the teacher's intent becomes the AI's instructions. When a teacher uploads materials, they're injected as the AI's primary reference.

2. **Streaming chat with graceful fallback** — Real-time token-by-token streaming from OpenAI via SSE. If no API key is configured, falls back to mock responses per-request so the UX is still functional.

3. **Class code enrollment system** — Teachers get a 6-character code per course. Students enter it to join. This required a `security definer` PostgreSQL function to bypass RLS (students can't read courses before enrolling — a chicken-and-egg problem I solved with an RPC call).

4. **Row Level Security** — Every database query is scoped to the authenticated user. Teachers only see their own courses and their students' data. Students only see courses they're enrolled in. This required solving circular RLS policy dependencies with `security definer` helper functions.

## How to Use

1. Go to the site and **Sign Up** as a Teacher
2. **Create a course** (e.g., "AP Biology") → note the class code
3. **Add a unit** (e.g., "Cell Division") → click Configure
4. **Set up the AI**: add objectives, choose teaching approach, set boundaries, optionally upload materials
5. **Click Save**
6. Share the class code with a student
7. Student signs up, enters the code → sees the course → clicks a unit → starts chatting
8. Teacher checks **Student Insights** to see what students are asking

## How to Run Locally

```bash
git clone https://github.com/nypatel1/test.git
cd test
npm install
```

Create `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=sk-your-openai-key  # optional, works in demo mode without it
```

Set up the database:
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run `supabase-schema.sql` in the SQL Editor
3. Run `supabase-fix.sql` to set up RLS policies
4. Run `supabase-join-fix.sql` to enable the class code join function
5. Disable email confirmation in Authentication → Settings (for local dev)

Then:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How Secrets Are Handled

- **OpenAI API key**: Server-side only, stored as `OPENAI_API_KEY` env var. Never sent to the client. If missing, chat runs in demo mode.
- **Supabase keys**: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are public (anon key is designed to be public). All data access is controlled by Row Level Security policies in PostgreSQL.
- **User passwords**: Handled entirely by Supabase Auth. Never stored or visible to the application.
- **`.env*` is in `.gitignore`** — no secrets are committed.

## Tech Stack

- **Next.js 16** (App Router) — React framework with API routes
- **TypeScript** — Type safety throughout
- **Tailwind CSS 4** — Utility-first styling
- **Supabase** — PostgreSQL database + authentication + Row Level Security
- **OpenAI API** (GPT-4o-mini) — AI chat responses via streaming SSE
- **Recharts** — Interactive data visualization
- **pdfjs-dist** — Client-side PDF text extraction for material uploads
- **Lucide React** — Icons

## Project Structure

```
src/
├── app/
│   ├── api/chat/route.ts          # OpenAI streaming API endpoint
│   ├── auth/page.tsx              # Login/signup with role selection
│   ├── components/                # Logo, Sidebar, Layout, MaterialUpload
│   ├── student/
│   │   ├── chat/page.tsx          # AI tutoring chat interface
│   │   └── learn/page.tsx         # Student home (join classes, see units)
│   ├── teacher/
│   │   ├── courses/               # Course & unit management
│   │   │   ├── [id]/             # Unit config (objectives, approach, materials)
│   │   │   └── page.tsx
│   │   ├── dashboard/page.tsx     # Teacher dashboard
│   │   ├── insights/              # Analytics with Recharts
│   │   └── settings/page.tsx      # Links to per-unit AI config
│   ├── globals.css
│   ├── layout.tsx                 # Root layout with AuthProvider
│   └── page.tsx                   # Landing page
└── lib/
    ├── AuthContext.tsx             # Auth provider with role-based routing
    ├── buildSystemPrompt.ts       # Teacher config → AI system prompt
    ├── db.ts                      # All Supabase database operations
    ├── supabase.ts                # Supabase client
    ├── types.ts                   # TypeScript types
    └── useIsMounted.ts            # SSR-safe mounting hook
```
