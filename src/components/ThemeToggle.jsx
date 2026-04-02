import React, { useContext } from "react";
import { AppStateContext } from "../state/AppStateProvider.jsx";
import { Button } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";

export default function ThemeToggle() {
  const { state, dispatch } = useContext(AppStateContext);

  const toggleTheme = () => {
    dispatch({ type: "SET_DARK_MODE", value: !state.darkMode });
    if (!state.darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  };

  return (
    <Button
      type="text"
      icon={state.darkMode ? <MoonOutlined style={{ color: "#4d8df5" }} /> : <SunOutlined style={{ color: "#f79009" }} />}
      onClick={toggleTheme}
      style={{
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 32,
        height: 32,
        background: "var(--border-light)"
      }}
    />
  );
}
