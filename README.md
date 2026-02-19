# Riseva — Teacher-Controlled AI Learning System

A front-end prototype for **Riseva**, a teacher-controlled AI learning system that personalizes instruction while staying aligned to classroom goals.

## What is Riseva?

Riseva is a **closed-loop learning system** for schools:

1. **Teachers configure** — topics, learning objectives, depth requirements, boundaries, and teaching approach
2. **AI teaches** — personalized, adaptive, mastery-focused tutoring aligned to teacher settings
3. **Students learn** — through guided questioning adapted to their learning style
4. **Insights flow back** — misconceptions, mastery levels, and engagement data return to teachers

## Pages & Features

### Teacher Portal

- **Dashboard** (`/teacher/dashboard`) — Overview of classes, live student activity, top misconceptions, mastery stats
- **Courses & Units** (`/teacher/courses`) — Manage courses, configure units with learning objectives
- **Unit Configuration** (`/teacher/courses/[id]`) — Set AI teaching approach, scaffolding level, boundaries, allowed sources, and preview student chat experience
- **Student Insights** (`/teacher/insights`) — Mastery heatmap, misconception detection, engagement analytics, struggling student alerts, skill progression
- **AI Settings** (`/teacher/settings`) — Global AI configuration: teaching approach, response style, tone, capabilities, and safety boundaries

### Student Portal

- **Learning Home** (`/student/learn`) — Unit progress, topic confidence, achievements, personalized learning tips
- **AI Chat** (`/student/chat`) — Interactive tutoring session with Socratic questioning, hints, practice problems, and real-time progress tracking

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS 4**
- **Lucide React** (icons)

## Prototype Notes

This is a UI prototype with mock data demonstrating the full user experience. All interactions are simulated — no actual AI backend is connected. The chat interface includes pre-scripted responses to demonstrate the Socratic teaching approach, hint system, practice problem generation, and how the AI stays within teacher-defined boundaries.
