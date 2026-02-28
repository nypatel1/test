Riseva — Teacher-Controlled AI Learning System

Riseva is a web application that lets teachers configure an AI tutor for their students. Teachers define topics, learning objectives, teaching approach, and safety boundaries. Students then interact with a chatbot that follows the teacher's configuration, teaching through guided questioning, never giving away answers. Analytics flow back to teachers showing what students are asking and how they're engaging.

## What It Does

### Teacher Side
- **Sign up as Teacher** → create an account and access the teacher portal
- **Create courses** → each gets a unique class code to share with students
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

## Feature I'm Most Proud Of

**The system prompt builder** — Takes the teacher's entire configuration and constructs a detailed system prompt. 


## How to Use

1. Go to the site and dign up as a Teacher
2. Create a course ("AP Biology", etc.), note the class code
3. Add a unit - ("Cell Division", etc.), click Configure
4. Set up the AI: add objectives, choose teaching approach, set boundaries, optionally upload materials
5. Share the class code with a student
6. Student signs up, enters the code, sees the course, clicks a unit, starts learning
7. Teacher checks, student insights, to see what students are asking

