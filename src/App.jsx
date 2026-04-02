import React, { useContext, useMemo, useState } from "react";
import { AppStateContext } from "./state/AppStateProvider.jsx";
import SummaryCards from "./components/SummaryCards.jsx";
import RoleSwitcher from "./components/RoleSwitcher.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import TrendChart from "./components/TrendChart.jsx";
import SpendingBreakdown from "./components/SpendingBreakdown.jsx";
import TransactionsSection from "./components/TransactionsSection.jsx";
import Insights from "./components/Insights.jsx";
import TransactionModal from "./components/TransactionModal.jsx";
import { CATEGORY_SUGGESTIONS } from "./mock/mockData.js";
import { computeCategoryTotals, computeMonthlyNet } from "./lib/charts.js";
import { formatMoney, monthKeyFromDate, monthLabelFromKey } from "./lib/format.js";
import { motion } from "framer-motion";
import { Button, Tooltip, ConfigProvider } from "antd";
import { DownloadOutlined, ReloadOutlined, BankOutlined } from "@ant-design/icons";

function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `id_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function parseTime(iso) {
  const d = new Date(iso);
  const t = d.getTime();
  return Number.isNaN(t) ? 0 : t;
}

function sumBy(transactions, predicate) {
  let sum = 0;
  for (const t of transactions) {
    if (!predicate(t)) continue;
    sum += Number(t.amount) || 0;
  }
  return sum;
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function transactionsToCSV(transactions) {
  const header = ["Date", "Amount", "Category", "Type", "Notes"];
  const rows = transactions.map((t) => {
    const sign = t.type === "expense" ? "-" : "";
    const amt = `${sign}${Number(t.amount) || 0}`;
    return [t.date, amt, t.category || "", t.type || "", t.notes || ""];
  });
  const csvEscape = (value) => {
    const s = String(value ?? "");
    if (/[,"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  return [header.join(","), ...rows.map((r) => r.map(csvEscape).join(","))].join("\n");
}

export default function App() {
  const { state, dispatch } = useContext(AppStateContext);
  const role = state.role;

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [modalInitial, setModalInitial] = useState(null);

  const canEdit = role === "admin";
  const allTransactions = state.transactions || [];

  const allCategories = useMemo(() => {
    const set = new Set();
    for (const t of allTransactions) {
      if (t.category) set.add(t.category);
    }
    const suggested = CATEGORY_SUGGESTIONS.filter((c) => set.has(c));
    const remaining = Array.from(set).filter((c) => !suggested.includes(c)).sort((a, b) => a.localeCompare(b));
    return [...suggested, ...remaining];
  }, [allTransactions]);

  const visibleTransactions = useMemo(() => {
    const f = state.filters || {};
    const q = String(f.query || "").trim().toLowerCase();

    const filtered = allTransactions.filter((t) => {
      if (f.type !== "all" && t.type !== f.type) return false;
      if (f.category !== "all" && (t.category || "") !== f.category) return false;
      if (!q) return true;
      const haystack = `${t.category || ""} ${t.notes || ""} ${t.type || ""}`.toLowerCase();
      return haystack.includes(q);
    });

    const sorted = [...filtered];
    const sortBy = f.sortBy || "date_desc";
    sorted.sort((a, b) => {
      if (sortBy === "date_asc") return parseTime(a.date) - parseTime(b.date);
      if (sortBy === "date_desc") return parseTime(b.date) - parseTime(a.date);
      if (sortBy === "amount_asc") return (Number(a.amount) || 0) - (Number(b.amount) || 0);
      if (sortBy === "amount_desc") return (Number(b.amount) || 0) - (Number(a.amount) || 0);
      return parseTime(b.date) - parseTime(a.date);
    });

    return sorted;
  }, [allTransactions, state.filters]);

  const totals = useMemo(() => {
    const income = sumBy(allTransactions, (t) => t.type === "income");
    const expenses = sumBy(allTransactions, (t) => t.type === "expense");
    return { income, expenses, totalBalance: income - expenses };
  }, [allTransactions]);

  const trendSeries = useMemo(() => computeMonthlyNet(visibleTransactions, 6), [visibleTransactions]);
  const categoryTotals = useMemo(() => computeCategoryTotals(visibleTransactions), [visibleTransactions]);

  const insights = useMemo(() => {
    const expenseTotals = computeCategoryTotals(visibleTransactions);
    const highest = expenseTotals[0];
    const topCategoryText = highest
      ? `Based on your recent spending, ${highest.category} makes up your largest outflow at ${formatMoney(highest.total)}.`
      : "No expense categories found in the active view.";

    const now = new Date();
    let latestISO = null;
    for (const t of visibleTransactions) {
      if (!latestISO || parseTime(t.date) > parseTime(latestISO)) latestISO = t.date;
    }
    const refDate = latestISO ? new Date(latestISO) : now;
    const thisMonthKey = monthKeyFromDate(refDate.toISOString());
    const refD = new Date(Date.UTC(refDate.getUTCFullYear(), refDate.getUTCMonth(), 1, 12, 0, 0));
    const prevD = new Date(Date.UTC(refD.getUTCFullYear(), refD.getUTCMonth() - 1, 1, 12, 0, 0));
    const prevMonthKey = monthKeyFromDate(prevD.toISOString());

    let thisExpense = 0;
    let prevExpense = 0;
    for (const t of visibleTransactions) {
      if (t.type !== "expense") continue;
      const key = monthKeyFromDate(t.date);
      const amt = Number(t.amount) || 0;
      if (key === thisMonthKey) thisExpense += amt;
      if (key === prevMonthKey) prevExpense += amt;
    }

    const delta = thisExpense - prevExpense;
    const pct = prevExpense > 0 ? (delta / prevExpense) * 100 : null;
    const monthComparisonText = prevExpense <= 0
      ? `Not enough data prior to ${monthLabelFromKey(thisMonthKey)} to establish a baseline.`
      : `Expenses for ${monthLabelFromKey(thisMonthKey)} are ${delta >= 0 ? "up" : "down"} ${formatMoney(Math.abs(delta))} compared to last month.`;

    const last2 = trendSeries.slice(-2);
    const netNow = last2[1]?.net ?? 0;
    const netPrev = last2[0]?.net ?? 0;
    const observationText = (netPrev === 0 && netNow === 0)
      ? "Log both income and expenses to unlock predictive cash flow analysis."
      : `Your trailing net balance is trending ${netNow >= netPrev ? "positively" : "negatively"} over the 30-day window.`;

    return [
      { title: "Highest Allocation", text: topCategoryText },
      { title: "Period-over-Period", text: monthComparisonText },
      { title: "Trajectory", text: observationText }
    ];
  }, [trendSeries, visibleTransactions]);

  const openAdd = () => {
    if (!canEdit) return;
    setModalMode("add");
    setModalInitial(null);
    setModalOpen(true);
  };

  const openEdit = (t) => {
    if (!canEdit) return;
    setModalMode("edit");
    setModalInitial(t);
    setModalOpen(true);
  };

  const submitTransaction = (payload) => {
    if (!payload) return;
    if (modalMode === "add") {
      dispatch({ type: "ADD_TRANSACTION", transaction: { id: uid(), ...payload } });
    } else {
      dispatch({ type: "UPDATE_TRANSACTION", id: modalInitial.id, transaction: { ...modalInitial, ...payload } });
    }
    setModalOpen(false);
  };

  const deleteTransaction = (id) => {
    if (!canEdit) return;
    dispatch({ type: "DELETE_TRANSACTION", id });
  };

  const exportJSON = () => {
    const payload = { exportedAt: new Date().toISOString(), role, filters: state.filters, transactions: visibleTransactions };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    downloadBlob(`ledger_export_${Date.now()}.json`, blob);
  };

  const exportCSV = () => {
    const csv = transactionsToCSV(visibleTransactions);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    downloadBlob(`ledger_export_${Date.now()}.csv`, blob);
  };

  const resetSampleData = () => {
    if (!canEdit) return;
    if (window.confirm("Initialize clean dataset with demo records?")) {
      dispatch({ type: "RESET_TRANSACTIONS" });
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8 flex flex-col gap-6">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mb-2"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(26, 86, 219, 0.25)" }}>
            <BankOutlined style={{ fontSize: 22 }} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.03em" }}>
              Corporate Ledger
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
              Financial Performance Dashboard
            </p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <RoleSwitcher />
          <div style={{ width: 1, height: 24, background: "var(--border)" }} />
          <ThemeToggle />
          <div style={{ width: 1, height: 24, background: "var(--border)" }} />
          <div style={{ display: "flex", gap: 6 }}>
            <Tooltip title="Export to CSV">
              <Button size="small" type="text" icon={<DownloadOutlined />} onClick={exportCSV} />
            </Tooltip>
            {canEdit && (
              <Tooltip title="Reset seed data">
                <Button size="small" type="text" danger icon={<ReloadOutlined />} onClick={resetSampleData} />
              </Tooltip>
            )}
          </div>
        </div>
      </motion.header>

      <SummaryCards totalBalance={totals.totalBalance} income={totals.income} expenses={totals.expenses} />

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.2fr] gap-6 items-stretch">
        <TrendChart series={trendSeries} />
        <SpendingBreakdown categories={categoryTotals} />
      </div>

      <TransactionsSection
        visibleTransactions={visibleTransactions}
        allCategories={allCategories}
        role={role}
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={deleteTransaction}
      />

      <Insights insights={insights} />

      <TransactionModal
        open={modalOpen}
        mode={modalMode}
        initial={modalInitial}
        onClose={() => setModalOpen(false)}
        onSubmit={submitTransaction}
      />
    </div>
  );
}
