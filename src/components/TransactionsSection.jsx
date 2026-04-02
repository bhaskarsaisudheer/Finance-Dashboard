import React, { useContext, useMemo } from "react";
import { AppStateContext } from "../state/AppStateProvider.jsx";
import { dateLabel, formatMoney } from "../lib/format.js";
import { formatSignedAmount } from "../lib/format.js";
import { Table, Tag, Button, Input, Select, Space, Tooltip } from "antd";
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FilterOutlined, ClearOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

const { Option } = Select;

export default function TransactionsSection({
  visibleTransactions,
  allCategories,
  role,
  onAdd,
  onEdit,
  onDelete,
}) {
  const { state, dispatch } = useContext(AppStateContext);
  const canEdit = role === "admin";

  const resetFilters = () => {
    dispatch({ type: "SET_FILTERS", filters: { type: "all", category: "all", query: "", sortBy: "date_desc" } });
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (date) => (
        <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 400 }}>
          {dateLabel(date)}
        </span>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (cat) => (
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>
          {cat || "Uncategorized"}
        </span>
      ),
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
      ellipsis: true,
      render: (notes) => (
        <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 400 }}>
          {notes || "—"}
        </span>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: 100,
      render: (type) => (
        <Tag
          style={{
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: "0.03em",
            border: "none",
            padding: "2px 8px",
            background: type === "income" ? "var(--success-light)" : "var(--danger-light)",
            color: type === "income" ? "var(--success)" : "var(--danger)",
          }}
        >
          {type === "income" ? "Income" : "Expense"}
        </Tag>
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      width: 130,
      align: "right",
      render: (_, record) => {
        const isExpense = record.type === "expense";
        return (
          <span style={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: isExpense ? "var(--danger)" : "var(--success)",
            fontVariantNumeric: "tabular-nums",
          }}>
            {formatSignedAmount(record)}
          </span>
        );
      },
    },
    ...(canEdit ? [{
      title: "",
      key: "actions",
      width: 90,
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit?.(record)}
              style={{ color: "var(--text-secondary)" }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                if (!window.confirm("Delete this transaction?")) return;
                onDelete?.(record.id);
              }}
            />
          </Tooltip>
        </Space>
      ),
    }] : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: "var(--panel)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        boxShadow: "var(--shadow-sm)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{
        padding: "18px 24px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
      }}>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Transactions</p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-secondary)", fontWeight: 400 }}>
            {visibleTransactions.length} record{visibleTransactions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {canEdit && (
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={onAdd}
              style={{ fontWeight: 600, fontSize: 13, height: 34, paddingInline: 14 }}
            >
              Add Transaction
            </Button>
          )}
          {!canEdit && (
            <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>
              Read-only mode
            </span>
          )}
        </div>
      </div>

      {/* Filters bar */}
      <div style={{
        padding: "12px 24px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexWrap: "wrap",
        background: "var(--border-light)",
      }}>
        <Input
          placeholder="Search notes, category…"
          prefix={<SearchOutlined style={{ color: "var(--text-secondary)", fontSize: 13 }} />}
          value={state.filters.query}
          onChange={e => dispatch({ type: "SET_FILTERS", filters: { query: e.target.value } })}
          size="small"
          className="w-full sm:w-[220px]"
          style={{ borderRadius: 8, fontSize: 13 }}
        />

        <Select
          size="small"
          value={state.filters.type}
          onChange={v => dispatch({ type: "SET_FILTERS", filters: { type: v } })}
          className="w-full sm:w-[130px]"
          style={{ fontSize: 13 }}
          placeholder="Type"
          suffixIcon={<FilterOutlined style={{ fontSize: 11 }} />}
        >
          <Option value="all">All Types</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>

        <Select
          size="small"
          value={state.filters.category}
          onChange={v => dispatch({ type: "SET_FILTERS", filters: { category: v } })}
          className="w-full sm:w-[160px]"
          style={{ fontSize: 13 }}
          placeholder="Category"
        >
          <Option value="all">All Categories</Option>
          {allCategories.map(c => <Option key={c} value={c}>{c}</Option>)}
        </Select>

        <Select
          size="small"
          value={state.filters.sortBy}
          onChange={v => dispatch({ type: "SET_FILTERS", filters: { sortBy: v } })}
          className="w-full sm:w-[150px]"
          style={{ fontSize: 13 }}
          placeholder="Sort by"
        >
          <Option value="date_desc">Newest First</Option>
          <Option value="date_asc">Oldest First</Option>
          <Option value="amount_desc">Highest Amount</Option>
          <Option value="amount_asc">Lowest Amount</Option>
        </Select>

        <Button
          size="small"
          icon={<ClearOutlined />}
          onClick={resetFilters}
          type="text"
          style={{ color: "var(--text-secondary)", fontSize: 13 }}
        >
          Reset
        </Button>
      </div>

      {/* Table */}
      <Table
        dataSource={visibleTransactions}
        columns={columns}
        rowKey="id"
        size="small"
        scroll={{ x: 'max-content' }}
        pagination={visibleTransactions.length > 20 ? { pageSize: 20, size: "small", showSizeChanger: false } : false}
        locale={{
          emptyText: (
            <div style={{ padding: "40px 0", textAlign: "center" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: 14, fontWeight: 500, marginBottom: 12 }}>
                No transactions match your filters
              </p>
              <Button size="small" type="text" onClick={resetFilters} style={{ color: "var(--accent)" }}>
                Clear filters
              </Button>
            </div>
          ),
        }}
        style={{
          background: "transparent",
        }}
      />
    </motion.div>
  );
}
