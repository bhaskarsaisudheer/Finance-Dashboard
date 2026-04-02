import React from "react";
import { motion } from "framer-motion";
import { InfoCircleOutlined, BulbOutlined } from "@ant-design/icons";

export default function Insights({ insights }) {
  const items = insights?.length ? insights : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "var(--panel)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
      }}
    >
      <div style={{
        padding: "18px 24px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <div style={{ 
          width: 28, height: 28, 
          borderRadius: "50%", 
          background: "var(--accent-light)", 
          display: "flex", alignItems: "center", justifyContent: "center" 
        }}>
          <BulbOutlined style={{ color: "var(--accent)" }} />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Smart Insights</p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-secondary)", fontWeight: 400 }}>
            Automated observations based on your data
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)", fontSize: 13, fontWeight: 500 }}>
          <InfoCircleOutlined style={{ fontSize: 16, marginBottom: 8 }} />
          <div>Not enough data to generate insights yet.</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, padding: "20px 24px" }}>
          {items.map((it, idx) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.1 }}
              style={{
                padding: "16px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--border-light)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>
                {it.title}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5, fontWeight: 400 }}>
                {it.text}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
