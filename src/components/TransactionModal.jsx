import React, { useEffect, useMemo, useState } from "react";
import { ConfigProvider, Modal, Form, Input, InputNumber, Select, DatePicker, message } from "antd";
import { CATEGORY_SUGGESTIONS } from "../mock/mockData.js";
import dayjs from "dayjs";

const { Option } = Select;

export default function TransactionModal({ open, mode, initial, onClose, onSubmit }) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    if (initial) {
      form.setFieldsValue({
        date: initial.date ? dayjs(initial.date) : null,
        amount: initial.amount,
        category: initial.category,
        type: initial.type,
        notes: initial.notes,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ type: "expense", date: dayjs() });
    }
  }, [open, initial, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        date: values.date ? values.date.toISOString() : null,
        amount: Number(values.amount),
        category: values.category?.trim(),
        type: values.type,
        notes: values.notes?.trim() || "",
      };
      
      if (!payload.date) {
        message.error("Please select a date.");
        return;
      }

      onSubmit?.(payload);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  };

  const title = mode === "edit" ? "Edit Transaction" : "Add Transaction";

  return (
    <Modal
      title={<span style={{ fontWeight: 700, letterSpacing: "-0.01em", fontSize: 16 }}>{title}</span>}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      okText="Save changes"
      cancelText="Cancel"
      destroyOnClose
      width={480}
      styles={{
        header: { paddingBottom: 16, borderBottom: "1px solid var(--border)", marginBottom: 20 },
        body: { padding: "0" },
        footer: { paddingTop: 16, borderTop: "1px solid var(--border)", marginTop: 20 },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ type: "expense" }}
        requireMark="optional"
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Date is required" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              { required: true, message: "Amount is required" },
              { type: "number", min: 0.01, message: "Must be > 0" }
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              prefix="$"
              placeholder="0.00"
              precision={2}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Category is required" }]}
          >
             <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Select or type..."
                optionFilterProp="children"
                filterOption={(input, option) => (option?.value ?? '').toLowerCase().includes(input.toLowerCase())}
                options={CATEGORY_SUGGESTIONS.map(c => ({ value: c, label: c }))}
             />
          </Form.Item>

          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true, message: "Type is required" }]}
          >
            <Select>
              <Option value="income">Income</Option>
              <Option value="expense">Expense</Option>
            </Select>
          </Form.Item>
        </div>

        <Form.Item name="notes" label="Notes (optional)">
          <Input.TextArea rows={2} placeholder="Add a short description..." />
        </Form.Item>
      </Form>
    </Modal>
  );
}
