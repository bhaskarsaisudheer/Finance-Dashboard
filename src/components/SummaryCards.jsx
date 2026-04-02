import React from "react";
import { formatMoney } from "../lib/format.js";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function SummaryCards({ totalBalance, income, expenses }) {
  const isHealthy = totalBalance >= 0;
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  const cards = [
    {
      label: "Net Balance",
      value: totalBalance,
      sub: isHealthy ? "Positive cash flow" : "Spending exceeds income",
      icon: isHealthy ? ArrowUpRight : ArrowDownRight,
      iconBg: isHealthy ? "var(--success-light)" : "var(--danger-light)",
      iconColor: isHealthy ? "var(--success)" : "var(--danger)",
      borderAccent: isHealthy ? "var(--success)" : "var(--danger)",
      valueColor: isHealthy ? "var(--success)" : "var(--danger)",
    },
    {
      label: "Total Income",
      value: income,
      sub: "All inflows this period",
      icon: ArrowUpRight,
      iconBg: "var(--accent-light)",
      iconColor: "var(--accent)",
      borderAccent: "var(--accent)",
      valueColor: "var(--text)",
    },
    {
      label: "Total Expenses",
      value: expenses,
      sub: "All outflows this period",
      icon: ArrowDownRight,
      iconBg: "var(--danger-light)",
      iconColor: "var(--danger)",
      borderAccent: "var(--danger)",
      valueColor: "var(--text)",
    },
    {
      label: "Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
      raw: savingsRate,
      sub: income > 0 ? `${formatMoney(income - expenses)} saved` : "No income data",
      icon: Minus,
      iconBg: savingsRate >= 20 ? "var(--success-light)" : "var(--warning-light)",
      iconColor: savingsRate >= 20 ? "var(--success)" : "var(--warning)",
      borderAccent: savingsRate >= 20 ? "var(--success)" : "var(--warning)",
      valueColor: "var(--text)",
      isPercent: true,
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          style={{
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "20px 22px",
            boxShadow: "var(--shadow-sm)",
            position: "relative",
            overflow: "hidden",
            cursor: "default",
          }}
        >
          {/* Top accent line */}
          <div
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: 3,
              borderRadius: "14px 14px 0 0",
              background: card.borderAccent,
              opacity: 0.6,
            }}
          />

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", letterSpacing: "0.02em" }}>
              {card.label}
            </span>
            <div
              style={{
                width: 32, height: 32,
                borderRadius: 8,
                background: card.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <card.icon size={16} color={card.iconColor} strokeWidth={2.5} />
            </div>
          </div>

          <div style={{ marginBottom: 6 }}>
            <motion.span
              key={String(card.value)}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              style={{
                display: "block",
                fontSize: 26,
                fontWeight: 700,
                color: card.valueColor,
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
              }}
            >
              {card.isPercent ? card.value : formatMoney(card.value)}
            </motion.span>
          </div>

          <p style={{ fontSize: 12, color: "var(--text-secondary)", margin: 0, fontWeight: 400 }}>
            {card.sub}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
