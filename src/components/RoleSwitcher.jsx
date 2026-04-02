import React, { useContext } from "react";
import { AppStateContext } from "../state/AppStateProvider.jsx";
import { Select } from "antd";
import { SafetyCertificateOutlined } from "@ant-design/icons";

export default function RoleSwitcher() {
  const { state, dispatch } = useContext(AppStateContext);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <SafetyCertificateOutlined style={{ color: "var(--text-secondary)", fontSize: 13 }} />
      <Select
        size="small"
        variant="borderless"
        value={state.role}
        onChange={(v) => dispatch({ type: "SET_ROLE", role: v })}
        style={{ width: 85, fontSize: 13, fontWeight: 500, color: "var(--text)" }}
        dropdownStyle={{ borderRadius: 8 }}
      >
        <Select.Option value="viewer">Viewer</Select.Option>
        <Select.Option value="admin">Admin</Select.Option>
      </Select>
    </div>
  );
}
