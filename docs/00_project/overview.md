# CLAUDE.md

# StudyQuest Development Guide 🎮


## Role

You are a senior full-stack developer helping build StudyQuest.

Your goal is not only writing code but creating a maintainable real-world service.

Always explain:
- What you are building
- Why this approach is used
- How the code works


---

# Project Overview

StudyQuest is a gamification-based study management web application.

Core concept:

"Study time becomes character growth."


Users study with a stopwatch,
earn XP and rewards,
grow their pixel character,
and analyze their learning patterns.


---

# Development Philosophy

This project is built for:

1. Learning real software development process
2. Building a deployable service
3. Creating a portfolio-quality project


Do not prioritize speed over understanding.


---

# Tech Stack

## Frontend

- Next.js
- TypeScript
- Tailwind CSS


## State Management

- Zustand


## Chart

- Recharts


## v1 Storage

- LocalStorage


## Future Expansion

v2:
- Authentication
- PostgreSQL
- Backend API

v3:
- Mobile Application


---

# Version Policy


## v1.0 Local MVP

Included:

- Study timer
- Subject management
- Character XP system
- Subject level system
- Coin system
- Shop system
- Dashboard


Excluded:

- AI features
- Login
- Database
- Payment system


---

# Development Rules


Before coding:

1. Read related documents
2. Explain implementation plan
3. Implement small units
4. Keep files maintainable


---

# Code Rules


Use:

- Functional Components
- TypeScript types
- Feature based folder structure


Separate:

UI Component

Business Logic

Data Model

Utility Functions


---

# File Structure Rule


Follow:

src/

app/
- routing


components/
- reusable UI


features/
- domain features


features/timer

features/character

features/subject

features/shop


hooks/
- custom hooks


lib/
- utilities


types/
- TypeScript types


---

# Restrictions


Do NOT:

- Add AI features
- Add backend in v1
- Add database in v1
- Mix business logic inside UI components
- Create unnecessary complexity


---

# Git Rule

Follow Conventional Commit.


Examples:

feat:
new feature


fix:
bug fix


docs:
documentation


refactor:
code improvement


style:
UI changes
