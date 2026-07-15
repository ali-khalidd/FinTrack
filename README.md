# FinTrack

A clean, modern, responsive personal finance website built with React, Vite, TypeScript, Tailwind CSS, and Supabase.

Track your income and expenses, see how much you save each month, and work towards savings goals — all in a clean dashboard with dark mode.

## Features

- **Authentication** — sign up, log in, log out. Each user only sees their own data (Row Level Security).
- **Dashboard** — current balance, monthly income, expenses, and savings (savings = income − expenses).
- **Monthly Summary** — set a savings goal and see whether you saved more or less than your target.
- **Transactions** — add, edit, and delete income & expenses with title, amount, category, and date.
- **Spending Breakdown** — pie chart of expenses by category, plus a "most spent on X" insight.
- **Savings Goals** — create goals with a target amount, track progress with a progress bar, and add funds.
- **Settings** — change your monthly savings goal and currency (17 options).
- **Dark Mode** — toggle between light and dark themes, persisted to localStorage.
- **Responsive** — works on desktop and mobile.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build tool and dev server
- **Tailwind CSS** — styling (blue & green palette, rounded corners, soft shadows)
- **Supabase** — database, authentication, and Row Level Security
- **Recharts** — pie chart
- **React Router** — routing
- **Lucide React** — icons

## Getting Started

### 1. Prerequisites

- Node.js (v18 or newer)
- A Supabase project ([create one free at supabase.com](https://supabase.com))

### 2. Database Setup

Run the SQL in your Supabase SQL Editor to create the tables, RLS policies, and trigger:

- `profiles` — one row per user (monthly savings goal, currency)
- `transactions` — income and expense records
- `savings_goals` — savings targets with progress

### 3. Install & Run

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### 4. Environment Variables

Create a `.env` file (see `.env.example`):

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Project Structure

```
src/
├── components/    # Reusable UI components
├── context/       # Auth & theme contexts
├── lib/            # Supabase client, formatters, UI helpers
├── pages/          # Route pages (Dashboard, Transactions, Goals, Settings, Login, Signup)
├── types/          # TypeScript types
├── App.tsx         # Routes
└── main.tsx        # Entry point
```

## Expense Categories

Food, Shopping, Transport, Entertainment, Bills, Other
