# Prompt Log — Riseva Project

## AI Models/Tools Used
- **Claude** (Cursor AI Agent) — Primary development assistant for code generation, architecture planning, and debugging
- **ChatGPT** — Initial brainstorming for product positioning and feature specification
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

**Prompt:** Configure for GitHub Pages deployment, then later migrate to Vercel

**What was generated:** Static export configuration, GitHub Actions workflow, and generateStaticParams for dynamic routes.

**Issues encountered:**
- The package-lock.json contained Linux-specific SWC binaries that broke on macOS — removed it from git
- GitHub Actions failed because `npm ci` requires a lock file — switched to `npm install`
- Turbopack caused WASM fallback issues on macOS ARM — added `dev:no-turbo` script
- Later migrated from GitHub Pages (static-only) to Vercel to support API routes

**What I did:** Debugged each deployment issue, understood why cross-platform binary incompatibilities occur, and decided the workflow needed `npm install` instead of `npm ci`. Made the decision to move to Vercel once API routes were needed.

---

### Phase 4: Making It Functional — AI Chat System

**Prompt:** Create the core system — an API route that takes teacher configuration and builds an AI system prompt, then streams responses from OpenAI.

**What was generated:** `buildSystemPrompt.ts` and `/api/chat/route.ts`

**What I wrote/substantially modified:**
- **`buildSystemPrompt.ts`** — Designed how teacher configuration maps to AI instructions: approach selection becomes pedagogical directives, boundaries become strict rules, scaffolding level controls guidance depth. This is the core innovation — teacher intent → AI behavior.
- **`/api/chat/route.ts`** — Structured the streaming SSE response format and error handling for the mock fallback mode.
- **Streaming chat client** — The `sendToAPI` function that handles SSE streaming: reading chunks from a ReadableStream, parsing `data:` lines, accumulating content, and updating messages in real-time as tokens arrive.

**Key design decisions:**
- SSE (Server-Sent Events) for streaming instead of WebSockets — simpler, works with Vercel serverless
- Limit conversation context to last 20 messages for token limits
- Return 503 when no API key is set so the client knows to switch to demo mode
- Every message always tries the API first, falls back to mock per-request (not permanently)

---

### Phase 5: Removing All Mock Data — Full Functional Rewrite

**Prompt:** "I don't want the mockup info, I want the product to be useable"

This was a pivotal moment — the entire app was rebuilt from mockup to functional product.

**What was generated:** New data model with courses, units, per-unit configs, chat sessions, and analytics events all stored in localStorage.

**What I wrote/substantially modified:**
- Redesigned the data model: `Course`, `Unit`, `UnitConfig`, `ChatSession`, `AnalyticsEvent` types
- Created the full storage layer (`storage.ts`) with CRUD operations, session tracking, and analytics aggregation
- The `getAllStats()` function that computes per-day session counts for the last 7 days
- The `getUnitStats()` function that aggregates session data per unit
- Rewired every page (Dashboard, Courses, Insights, Student Learn, Student Chat) to use real data instead of hardcoded examples
- Made all interactive elements functional: create/delete courses, add/remove units, configure per-unit AI settings, track chat sessions with duration

**Key design decisions:**
- Each unit gets its own AI configuration (not one global config)
- Chat sessions auto-save when navigating away using `useEffect` cleanup
- Insights page shows real charts from actual interaction data
- Teacher can see student questions to identify common struggles

---

### Phase 6: Course Material Upload

**Prompt:** "Can we have a feature for the teacher to upload course content or materials?"

**What was generated:** `MaterialUpload.tsx` component with file upload UI

**What I wrote/substantially modified:**
- PDF text extraction using `pdfjs-dist` — loading the library dynamically, iterating through pages, extracting text content from each page's items
- The material storage format: `CourseMaterial` type with id, name, type, content, charCount
- Integration with `buildSystemPrompt.ts` — uploaded materials get injected as a `## Uploaded Course Materials` section in the AI's system prompt, marked as the "PRIMARY source of truth"
- Content truncation at 8000 chars per material to stay within context limits
- Support for PDF, TXT/MD files, and direct text paste

---

### Phase 7: Supabase Authentication & Database

**Prompt:** "Is there a way we can add a login aspect where data for a specific teacher and their students can be stored?"

This was the largest single feature addition — migrating from localStorage to a real database with auth.

**What was generated:** Initial Supabase client setup, database schema SQL, auth context provider, login/signup page

**What I wrote/substantially modified:**

#### Database Schema Design (`supabase-schema.sql`)
- Designed the full relational schema: `profiles`, `courses`, `units`, `enrollments`, `chat_sessions`, `materials`
- Created the auto-profile trigger: when a user signs up via Supabase Auth, a profile row is automatically created with their name and role
- Class code system: each course gets a unique 6-character alphanumeric code

#### Row Level Security (RLS) — This was the hardest part
- Initial policies caused infinite recursion: courses referenced enrollments, enrollments referenced courses
- First fix attempt (subqueries) still recursed
- Second fix attempt (explicit drops) — the `do $$` block to drop policies wasn't executing properly
- **Final solution:** Created `security definer` helper functions (`get_my_course_ids`, `get_my_enrolled_course_ids`, etc.) that query tables directly bypassing RLS, then used those functions in policies to break the circular dependency
- Had to manually delete old policies via Supabase UI when SQL drops failed
- Created `join_course_by_code()` RPC function — students can't read the courses table before enrolling, so the class code lookup needed to bypass RLS

#### Auth System (`AuthContext.tsx`)
- Built the auth provider with `onAuthStateChange` listener for real-time auth state
- Signup with role selection (teacher/student) — role stored in `raw_user_meta_data`
- Auto-fetch profile on login to determine role-based routing
- Protected route pattern in `TeacherLayout` — redirects to /auth if not a teacher

#### Database Operations Layer (`db.ts`)
- Wrote all CRUD operations for courses, units, enrollments, sessions, materials
- `getStudentCourses` joins enrollments → courses for the student view
- `getTeacherSessions` joins sessions → units → courses to get all sessions across a teacher's courses
- `getAllTeacherUnits` filters units by teacher ownership through the courses join
- Class code generator: random 6-char code from ambiguity-free character set (no 0/O, 1/I)

#### Page Migrations
- Rewired every page from localStorage to Supabase async queries
- Added loading states (spinner) while data fetches
- Added error handling with visible error messages
- Student join flow: enter class code → RPC call → enrolled → see courses/units
- Teacher sees class codes on course cards with copy-to-clipboard button
- Auth-protected routing: teachers → teacher portal, students → student portal

---

### Phase 8: Documentation

**What I did:**
- Updated this prompt log to cover the full development process
- Updated README with Supabase setup instructions and architecture
- Maintained the `.env.example` for environment variable documentation

---

## Important Non-Trivial Prompts

### Prompt 1: Initial Architecture
> "We provide a way for teachers to create a model designed to only help students learn... Create the front end for this system"

Established the full scope — teacher dashboard, student chat, analytics, and the closed-loop concept.

### Prompt 2: Make It Real
> "I don't want the mockup info, I want the product to be useable"

Triggered the complete rewrite from static mockup to functional application with real data flow.

### Prompt 3: Authentication & Multi-User
> "Is there a way we can add a login aspect where data for a specific teacher and their students can be stored?"

Led to the Supabase integration — the most technically challenging part of the project, especially the RLS policy circular dependency debugging.

### Prompt 4: Material Upload
> "Can we have a feature for the teacher to upload course content or materials?"

Added PDF parsing, file upload, and AI context injection for uploaded course materials.

---

## Summary of What I Wrote vs. AI-Generated

| Component | AI Generated | I Wrote/Modified |
|-----------|-------------|-----------------|
| Project scaffold & routing | ✅ | |
| UI components & layout | ✅ | Reviewed & adjusted |
| `buildSystemPrompt.ts` | Initial structure | ✅ Prompt engineering, material injection |
| `/api/chat/route.ts` | Initial structure | ✅ Streaming SSE, error handling |
| Streaming chat client | | ✅ Full sendToAPI, session tracking |
| localStorage → Supabase migration | | ✅ Full rewrite of data layer |
| Supabase RLS policies | Generated | ✅ Debugged recursion, wrote security definer functions |
| `join_course_by_code()` RPC | | ✅ Solved RLS chicken-and-egg problem |
| `AuthContext.tsx` | Generated | ✅ Role-based routing, profile fetching |
| `db.ts` database layer | Generated | ✅ Join logic, aggregation queries |
| `MaterialUpload.tsx` | Generated | ✅ PDF parsing, content injection |
| `supabase-schema.sql` | | ✅ Full schema design, triggers, functions |
| Recharts visualizations | Base setup | ✅ Metric switcher, real data binding |
| Class code system | | ✅ Code generation, copy UI, join flow |
| README.md | | ✅ |
| prompt_log.md | | ✅ |
| All deployment debugging | | ✅ |

**Estimated time:** ~8-9 hours total
- 1hr: Planning and concept
- 1hr: Static mockup
- 0.5hr: Deployment (GitHub Pages → Vercel)
- 2hr: AI chat system, streaming, system prompt builder
- 1.5hr: Full functional rewrite (removing all mock data)
- 0.5hr: Material upload feature
- 2hr: Supabase auth, database, RLS debugging, class codes
- 0.5hr: Documentation
