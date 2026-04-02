import { monthKeyFromDate, parseISODate } from "./format.js";

export function computeMonthlyNet(transactions, monthsBack = 6) {
  const byMonth = new Map();
  for (const t of transactions) {
    const key = monthKeyFromDate(t.date);
    const prev = byMonth.get(key) || { income: 0, expense: 0, net: 0, count: 0 };
    const amt = Number(t.amount) || 0;
    if (t.type === "income") prev.income += amt;
    else prev.expense += amt;
    byMonth.set(key, { ...prev });
  }

  for (const [k, v] of byMonth.entries()) byMonth.set(k, { ...v, net: v.income - v.expense });

  // Determine latest month from transactions or today.
  let latest = null;
  for (const t of transactions) {
    const d = parseISODate(t.date);
    if (Number.isNaN(d.getTime())) continue;
    if (!latest || d > latest) latest = d;
  }
  if (!latest) latest = new Date();

  const keys = [];
  const endY = latest.getUTCFullYear();
  const endM = latest.getUTCMonth(); // 0-11
  for (let i = monthsBack - 1; i >= 0; i--) {
    const dt = new Date(Date.UTC(endY, endM - i, 1));
    keys.push(`${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}`);
  }

  return keys.map((k) => {
    const v = byMonth.get(k) || { income: 0, expense: 0, net: 0, count: 0 };
    return { key: k, ...v };
  });
}

export function computeCategoryTotals(transactions) {
  const totals = new Map();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    const cat = t.category || "Uncategorized";
    const prev = totals.get(cat) || 0;
    totals.set(cat, prev + (Number(t.amount) || 0));
  }
  // Convert to sorted list.
  return Array.from(totals.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

