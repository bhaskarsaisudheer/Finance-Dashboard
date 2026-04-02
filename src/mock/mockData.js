export const CATEGORY_SUGGESTIONS = [
  "Salary",
  "Freelance",
  "Investments",
  "Groceries",
  "Rent",
  "Utilities",
  "Dining",
  "Transport",
  "Health",
  "Shopping",
  "Entertainment",
  "Travel",
  "Insurance",
  "Education"
];

const iso = (y, m, d) => new Date(Date.UTC(y, m - 1, d, 12, 0, 0)).toISOString();

// Mock, deterministic data across multiple months.
export const DEFAULT_TRANSACTIONS = [
  { id: "t1", date: iso(2026, 2, 1), amount: 4200, category: "Salary", type: "income", notes: "Monthly pay" },
  { id: "t2", date: iso(2026, 2, 3), amount: 860, category: "Groceries", type: "expense", notes: "Weekly groceries" },
  { id: "t3", date: iso(2026, 2, 6), amount: 1400, category: "Rent", type: "expense" },
  { id: "t4", date: iso(2026, 2, 9), amount: 120, category: "Utilities", type: "expense" },
  { id: "t5", date: iso(2026, 2, 14), amount: 58, category: "Transport", type: "expense" },
  { id: "t6", date: iso(2026, 2, 19), amount: 240, category: "Dining", type: "expense" },
  { id: "t7", date: iso(2026, 2, 24), amount: 75, category: "Health", type: "expense" },
  { id: "t8", date: iso(2026, 3, 1), amount: 4200, category: "Salary", type: "income" },
  { id: "t9", date: iso(2026, 3, 5), amount: 910, category: "Groceries", type: "expense" },
  { id: "t10", date: iso(2026, 3, 7), amount: 1400, category: "Rent", type: "expense" },
  { id: "t11", date: iso(2026, 3, 12), amount: 135, category: "Utilities", type: "expense" },
  { id: "t12", date: iso(2026, 3, 17), amount: 92, category: "Transport", type: "expense" },
  { id: "t13", date: iso(2026, 3, 22), amount: 280, category: "Dining", type: "expense" },
  { id: "t14", date: iso(2026, 3, 26), amount: 160, category: "Shopping", type: "expense" },
  { id: "t15", date: iso(2026, 4, 1), amount: 4200, category: "Salary", type: "income" },
  { id: "t16", date: iso(2026, 4, 4), amount: 740, category: "Groceries", type: "expense" },
  { id: "t17", date: iso(2026, 4, 6), amount: 1400, category: "Rent", type: "expense" },
  { id: "t18", date: iso(2026, 4, 10), amount: 125, category: "Utilities", type: "expense" },
  { id: "t19", date: iso(2026, 4, 13), amount: 110, category: "Transport", type: "expense" },
  { id: "t20", date: iso(2026, 4, 18), amount: 215, category: "Dining", type: "expense" },
  { id: "t21", date: iso(2026, 4, 22), amount: 95, category: "Health", type: "expense" }
];

