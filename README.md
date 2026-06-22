# Extracker

A modern, minimal personal expense tracker built with Next.js. Log spending, filter your history, and see where your money goes.

![Stack](https://img.shields.io/badge/stack-Next.js%2014%20·%20React%2018%20·%20TypeScript-2563EB)
![Style](https://img.shields.io/badge/style-glassmorphism-09090B)

## Features

- **Add expenses** — amount, date, category (10 built-in), and description, with input validation.
- **Edit / delete** — inline row actions in the Expenses list.
- **Filters** — date range (`from` / `to`), category chips, and free-text search over description + category. One-click clear.
- **Dashboard analytics**
  - This-month total with month-over-month % change
  - All-time total, monthly average, top category
  - Monthly spend trend (6-month bar chart, current month highlighted)
  - Spending by category (donut chart with legend + percentages)
  - Recent transactions feed
- **Grouped expense list** — by day (Today / Yesterday / dated), with daily subtotals.
- **Persistence** — `localStorage`; first load is seeded with realistic sample data so the dashboard isn't empty.
- **Accessible** — keyboard navigation, visible focus rings, ARIA labels on icon-only buttons, 4.5:1 contrast, `prefers-reduced-motion` respected.
- **Responsive** — tested at 375 / 768 / 1024 / 1440 widths.

## Tech stack

| Concern        | Choice                                  |
| -------------- | --------------------------------------- |
| Framework      | Next.js 14 (App Router)                 |
| Language       | TypeScript                              |
| Styling        | Tailwind CSS                            |
| Charts         | Recharts                                |
| Icons          | Lucide                                  |
| State          | React Context + `useReducer`-free store |
| Persistence    | `localStorage`                          |
| Font           | IBM Plex Sans (Google Fonts)            |

## Design system

Generated with the [`ui-ux-pro-max`](./.claude/skills/ui-ux-pro-max) skill:

- **Style:** Glassmorphism — frosted-glass panels over a soft radial gradient background
- **Palette:** Monochrome ink (`#09090B` → `#FAFAFA`) + blue accent (`#2563EB`)
- **Typography:** IBM Plex Sans, weights 300–700
- **Effects:** `backdrop-blur-xl`, subtle white borders, soft elevation shadows

## Getting started

Requirements: **Node.js 18.17+** (Node 24 verified).

```bash
npm install
npm run dev          # http://localhost:3000
```

Production:

```bash
npm run build
npm start
```

## Project structure

```
app/
  layout.tsx              # Root layout, IBM Plex Sans, ExpensesProvider
  page.tsx                # Shell — Sidebar + TopBar + active view
  globals.css             # Tailwind + glass utility classes
components/
  Sidebar.tsx             # Desktop navigation (Dashboard / Expenses)
  TopBar.tsx              # Sticky header with view switcher + Add button
  StatCard.tsx            # Dashboard KPI card with trend chip
  ExpenseForm.tsx         # Add / edit modal (portal-mounted)
  ExpenseRow.tsx          # List row with edit / delete actions
  DashboardView.tsx       # Stats + charts + recent transactions
  ExpensesView.tsx        # Filter bar + grouped list
  charts/
    CategoryDonut.tsx     # Recharts donut + legend
    MonthlyTrend.tsx      # Recharts bar chart, current month highlighted
lib/
  types.ts                # Expense, CategoryId, ExpenseFilters
  categories.ts           # 10 category definitions with icons + colors
  store.tsx               # ExpensesProvider — context + localStorage
  utils.ts                # Currency formatting, ISO date helpers, uid
```

## Data model

```ts
interface Expense {
  id: string;
  amount: number;          // positive, in dollars
  category: CategoryId;    // one of 10 fixed ids
  description: string;
  date: string;            // ISO yyyy-mm-dd
  createdAt: number;       // epoch ms — used for stable ordering
}
```

Storage key: `extracker.expenses.v1`. Reset by clearing site data in your browser or calling `resetExpenses()` from the store.

## Categories

Food & Dining, Groceries, Transport, Shopping, Bills & Utils, Entertainment, Health, Travel, Education, Other. Each category has a dedicated Lucide icon and color, used consistently across the list, filters, donut chart, and form.

## Keyboard & accessibility

- `Esc` closes the Add / Edit modal
- All interactive elements have visible focus rings (`focus-visible:ring-brand`)
- Form inputs use proper `<label for>` associations
- Icon-only buttons carry `aria-label`
- Color is never the sole indicator (icons + text accompany category colors)

## License

MIT.
