import React, { useMemo, useState } from "react";
import { formatMoney, stableHashToHue } from "../lib/format.js";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Sector } from "recharts";
import { motion } from "framer-motion";

// Muted, desaturated professional palette — no neon
function colorForCategory(category) {
  const hue = stableHashToHue(category);
  return `hsl(${hue}, 42%, 52%)`;
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: "var(--panel)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      padding: "10px 14px",
      boxShadow: "var(--shadow-md)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{d.category}</span>
      </div>
      <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
        {formatMoney(d.total)}
      </p>
      <p style={{ margin: "2px 0 0", fontSize: 11, color: "var(--text-secondary)" }}>
        {d.pct}% of expenses
      </p>
    </div>
  );
};

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <Sector
      cx={cx} cy={cy}
      innerRadius={innerRadius - 3}
      outerRadius={outerRadius + 6}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      stroke="var(--panel)"
      strokeWidth={2}
    />
  );
};

export default function SpendingBreakdown({ categories }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const { slices, sum } = useMemo(() => {
    const topN = 6;
    const safe = (categories || []).filter(c => c?.category && Number(c.total) > 0);
    const totalSum = safe.reduce((acc, c) => acc + (Number(c.total) || 0), 0);
    const top = safe.slice(0, topN);
    const rest = safe.slice(topN);
    const otherSum = rest.reduce((acc, c) => acc + (Number(c.total) || 0), 0);
    if (otherSum > 0) top.push({ category: "Other", total: otherSum });

    const finalSlices = top.map(s => ({
      ...s,
      value: Number(s.total) || 0,
      color: colorForCategory(s.category),
      pct: totalSum > 0 ? ((Number(s.total) || 0) / totalSum * 100).toFixed(1) : "0.0",
    }));

    return { slices: finalSlices, sum: totalSum };
  }, [categories]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "var(--panel)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "22px 24px",
        boxShadow: "var(--shadow-sm)",
        height: 320,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
          Spending Breakdown
        </p>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-secondary)", fontWeight: 400 }}>
          Top expense categories
        </p>
      </div>

      {sum <= 0 ? (
        <div style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          border: "1.5px dashed var(--border)", borderRadius: 10,
          color: "var(--text-secondary)", fontSize: 13, fontWeight: 500,
        }}>
          No expense data to display
        </div>
      ) : (
        <div style={{ flex: 1, minHeight: 0, display: "flex", gap: 0 }}>
          {/* Chart */}
          <div style={{ flex: "0 0 50%", position: "relative" }}>
            {/* Center label placed before ResponsiveContainer with lower z-index */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              pointerEvents: "none",
              zIndex: 1
            }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>
                {formatMoney(sum)}
              </span>
              <span style={{ fontSize: 10, color: "var(--text-secondary)", fontWeight: 500, marginTop: 2 }}>
                Total
              </span>
            </div>
            
            <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={slices}
                    cx="50%"
                    cy="50%"
                    innerRadius="58%"
                    outerRadius="80%"
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    onMouseEnter={(_, i) => setActiveIndex(i)}
                    onMouseLeave={() => setActiveIndex(null)}
                    animationDuration={700}
                    animationEasing="ease-out"
                  >
                    {slices.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 100 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Legend */}
          <div style={{
            flex: 1, minWidth: 0,
            display: "flex", flexDirection: "column",
            justifyContent: "center", gap: 7,
            paddingLeft: 12,
          }}>
            {slices.map((s, i) => (
              <motion.div
                key={s.category}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  cursor: "default",
                  opacity: activeIndex !== null && activeIndex !== i ? 0.45 : 1,
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <span style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: s.color, flexShrink: 0,
                }} />
                <span style={{
                  fontSize: 11, color: "var(--text-secondary)", fontWeight: 500,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1,
                }}>
                  {s.category}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text)", flexShrink: 0 }}>
                  {s.pct}%
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
