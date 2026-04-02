import React, { useMemo } from "react";
import { monthLabelFromKey, formatMoney } from "../lib/format.js";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const isPos = val >= 0;
  return (
    <div style={{
      background: "var(--panel)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      padding: "10px 14px",
      boxShadow: "var(--shadow-md)",
      minWidth: 140,
    }}>
      <p style={{ margin: "0 0 4px", fontSize: 11, color: "var(--text-secondary)", fontWeight: 500 }}>
        {monthLabelFromKey(label)}
      </p>
      <p style={{
        margin: 0,
        fontSize: 16,
        fontWeight: 700,
        color: isPos ? "var(--success)" : "var(--danger)",
        letterSpacing: "-0.02em",
      }}>
        {isPos ? "+" : ""}{formatMoney(val)}
      </p>
    </div>
  );
};

export default function TrendChart({ series }) {
  const data = useMemo(() =>
    series.map(s => ({
      key: s.key,
      net: Number(s.net) || 0,
    })),
    [series]
  );

  const lastTwo = data.slice(-2);
  const trend = lastTwo.length === 2 ? lastTwo[1].net - lastTwo[0].net : 0;
  const TrendIcon = trend > 0 ? TrendingUp : trend < 0 ? TrendingDown : Minus;
  const trendColor = trend > 0 ? "var(--success)" : trend < 0 ? "var(--danger)" : "var(--text-secondary)";

  const hasPositive = data.some(d => d.net >= 0);
  const hasNegative = data.some(d => d.net < 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
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
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 500, color: "var(--text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Balance Trend
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--text-secondary)", fontWeight: 400 }}>
            Monthly net income vs expenses
          </p>
        </div>
        {lastTwo.length === 2 && (
          <div style={{
            display: "flex", alignItems: "center", gap: 5,
            padding: "5px 10px",
            borderRadius: 20,
            background: trend > 0 ? "var(--success-light)" : trend < 0 ? "var(--danger-light)" : "var(--border-light)",
            color: trendColor,
            fontSize: 12,
            fontWeight: 600,
          }}>
            <TrendIcon size={13} strokeWidth={2.5} />
            {trend > 0 ? "+" : ""}{formatMoney(trend)}
          </div>
        )}
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="netGradPos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a56db" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#1a56db" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="netGradNeg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f04438" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#f04438" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
              vertical={false}
            />
            <XAxis
              dataKey="key"
              tickFormatter={k => monthLabelFromKey(k).slice(0, 3)}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-secondary)", fontSize: 11, fontWeight: 500 }}
              dy={8}
            />
            <YAxis
              tickFormatter={v => {
                const abs = Math.abs(v);
                const formatted = abs >= 1000 ? `${(abs / 1000).toFixed(0)}k` : String(abs);
                return v < 0 ? `-${formatted}` : formatted;
              }}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-secondary)", fontSize: 11, fontWeight: 500 }}
              width={44}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border)", strokeWidth: 1 }} />
            {hasPositive && hasNegative && (
              <ReferenceLine y={0} stroke="var(--border)" strokeWidth={1.5} />
            )}
            <Area
              type="monotoneX"
              dataKey="net"
              stroke="#1a56db"
              strokeWidth={2}
              fill="url(#netGradPos)"
              dot={{ r: 3, fill: "var(--panel)", stroke: "#1a56db", strokeWidth: 2 }}
              activeDot={{ r: 5, fill: "var(--panel)", stroke: "#1a56db", strokeWidth: 2 }}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
