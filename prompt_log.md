# Prompt Log —
- Claude (Cursor Agent - Opus 4.6) — Primary development for code generation, architecture planning, and debugging
- OpenAI GPT 4o-mini — AI model used in the student chat feature (via API)

---


### Phase 1: Concept & Architecture Planning

**Prompt:** The solution is for implementation in schools. We provide a way for teachers to create a model designed to only help students learn, focusing on the topics being addressed in class and the goals for actual understanding that teachers want for the students. Then the students have a chatbot where they are able to use it to learn, and it can help them learn through providing teaching catering to their learning style. I want to create the front end for this system right now to visualize what it would look like for teachers, and also on the student side. Also providing data insight from students to teachers about understanding and things. Having a mockup or prototype with examples is what we are looking for, we want to have the best enhanced user experience where the hypothetical system in action would work with the AI integration. 

**What was generated:** Initial project scaffold with Next.js 16, TypeScript, and Tailwind CSS. The basic page structure for all routes was created.


---

### Phase 2: Static Prototype (UI Mockup)

**Prompt:** I want to build the front-end prototype with:
- Landing page explaining the closed-loop system
- Teacher dashboard with live activity
- Courses & units management
- Unit configuration with teaching approach, boundaries, scaffolding
- Student insights
- AI chat interface with example conversation

**What was generated:** All 8 pages of static UI with mock data, custom color system, animations, and responsive layout. The Teacher Sidebar component, Logo component, and Teacher Layout wrapper were created.

**What I modified:**
- Reviewed and adjusted the color palette in globals.css 
- Verified the navigation links and page routing worked correctly

---

### Phase 3: Deployment Setup

**Prompt:** Configure for GitHub Pages deployment

**What was generated:** Export configuration GitHub Actions workflow.

**Issues encountered:**
- The package-lock.json had Linux-specific SWC binaries that broke on macOS — removed it from git
- GitHub Actions failed because `npm ci` requires a lock file — switched to `npm install`

**What I did:** Debugged each deployment issue, understood the cross-platform incompatibilities occur.

---

### Phase 4: Making It Functional


**Prompt:** Create the core system, an API route that takes teacher configuration and builds an AI system prompt, then streams responses from OpenAI.

**What was generated:** `buildSystemPrompt.ts` and `/api/chat/route.ts`

- **`buildSystemPrompt.ts`** — This is the most important file in the project. Designed how teacher configuration maps to AI instructions.
- **`/api/chat/route.ts`** — I structured the streaming SSE response format and the error handling that triggers mock fallback mode.

**What I did:** Had to build and deploy backend system in Vercel, connect to OpenAI API and Supabase
---

### Phase 5: Supabase Authentication & Database

**Prompt:** "Is there a way we can add a login and data storage aspect where data for a specific teacher and their students can be stored?"

**What was generated:** Initial Supabase client setup, database schema SQL, auth context provider, login/signup page

**What I wrote/substantially modified:**
- Created the auto-profile trigger: when a user signs up via Supabase Auth, a profile row is automatically created with their name and role
- Class code system: each course gets a unique 6-character alphanumeric code


---

