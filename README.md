# Finance Dashboard UI (React + JavaScript)

This project is a clean, interactive finance dashboard UI built with **React (JavaScript)**.
It uses **mock transaction data** and demonstrates **frontend state management**, **charts**, and **role-based UI behavior** (Viewer/Admin).

## Features

- Dashboard overview
  - Summary cards: `Total Balance`, `Income`, `Expenses`
  - Time-based visualization: balance trend by month (SVG chart)
  - Categorical visualization: spending breakdown (donut chart)
- Role-based UI simulation (no backend)
  - Switch roles using the dropdown in the top bar
  - `Viewer`: can only view data (no add/edit/delete)
  - `Admin`: can add, edit, and delete transactions
- Transactions section
  - Search + filters (type + category)
  - Sorting by date/amount
  - Graceful empty-state when no results match
- Insights section
  - Highest spending category
  - Monthly comparison (this month vs last month)
  - Helpful observation derived from the data
- State management + persistence
  - Centralized state via React Context + reducer
  - Transactions + role + theme + filters persisted in `localStorage`
- Export (optional enhancement)
  - Export current filtered transactions to CSV and JSON (top bar)

## Setup

1. Install dependencies
   - `npm install`
2. Start dev server
   - `npm run dev`
3. Open the local URL shown in the terminal (usually `http://localhost:5173`)

## Notes

- This UI is frontend-only. There is no backend dependency.
- Data persistence uses `localStorage` for a realistic demo experience.
- Admin can also reset the sample data from the top bar.

