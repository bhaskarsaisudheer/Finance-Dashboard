import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider, theme } from "antd";
import App from "./App.jsx";
import { AppStateProvider, AppStateContext } from "./state/AppStateProvider.jsx";
import "./styles.css";

function ThemedConfigProvider({ children }) {
  const { state } = useContext(AppStateContext);
  const isDark = state?.darkMode || false;

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: isDark ? "#4d8df5" : "#1a56db",
          colorSuccess: isDark ? "#34d399" : "#12b76a",
          colorError: isDark ? "#f87171" : "#f04438",
          colorWarning: isDark ? "#fbbf24" : "#f79009",
          colorBgBase: isDark ? "#161a22" : "#ffffff",
          colorBgContainer: isDark ? "#161a22" : "#ffffff",
          colorBgElevated: isDark ? "#1e2330" : "#ffffff",
          colorBgLayout: isDark ? "#0d0f14" : "#f8f9fb",
          colorText: isDark ? "#f0f2f5" : "#111827",
          colorTextSecondary: isDark ? "#8d95a3" : "#6b7280",
          colorBorder: isDark ? "#252a35" : "#e5e7eb",
          colorBorderSecondary: isDark ? "#1e2330" : "#f3f4f6",
          borderRadius: 10,
          borderRadiusLG: 12,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontSize: 14,
          boxShadow: isDark
            ? "0 4px 16px rgba(0,0,0,0.35)"
            : "0 4px 16px rgba(0,0,0,0.06)",
          boxShadowSecondary: isDark
            ? "0 1px 3px rgba(0,0,0,0.3)"
            : "0 1px 3px rgba(0,0,0,0.06)",
        },
        components: {
          Button: {
            borderRadius: 8,
            fontWeight: 500,
          },
          Input: {
            borderRadius: 8,
          },
          Select: {
            borderRadius: 8,
          },
          Table: {
            borderRadius: 12,
            headerBg: isDark ? "#1e2330" : "#f9fafb",
            headerColor: isDark ? "#8d95a3" : "#6b7280",
            rowHoverBg: isDark ? "#1e2330" : "#f9fafb",
          },
          Modal: {
            borderRadiusLG: 16,
          },
          Card: {
            borderRadius: 12,
          },
          Tag: {
            borderRadius: 6,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppStateProvider>
      <ThemedConfigProvider>
        <App />
      </ThemedConfigProvider>
    </AppStateProvider>
  </React.StrictMode>
);
