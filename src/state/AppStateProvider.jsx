import React, { createContext, useEffect, useMemo, useReducer } from "react";
import { DEFAULT_TRANSACTIONS } from "../mock/mockData.js";

const STORAGE_KEY = "finance_dashboard_ui_v1";

export const AppStateContext = createContext(null);

const initialState = {
  role: "viewer", // "viewer" | "admin"
  darkMode: false,
  transactions: DEFAULT_TRANSACTIONS,
  filters: {
    type: "all", // "all" | "income" | "expense"
    category: "all",
    query: "",
    sortBy: "date_desc" // date_desc | date_asc | amount_desc | amount_asc
  }
};

function safeParseJSON(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, role: action.role };
    case "SET_DARK_MODE":
      return { ...state, darkMode: action.value };
    case "RESET_TRANSACTIONS":
      return { ...state, transactions: DEFAULT_TRANSACTIONS };
    case "SET_TRANSACTIONS":
      return { ...state, transactions: action.transactions };
    case "SET_FILTERS":
      return { ...state, filters: { ...state.filters, ...action.filters } };
    case "ADD_TRANSACTION":
      return { ...state, transactions: [action.transaction, ...state.transactions] };
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) => (t.id === action.id ? action.transaction : t))
      };
    case "DELETE_TRANSACTION":
      return { ...state, transactions: state.transactions.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
}

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    const saved = safeParseJSON(localStorage.getItem(STORAGE_KEY));
    if (!saved) return init;
    return {
      ...init,
      ...saved,
      filters: { ...init.filters, ...(saved.filters || {}) },
      transactions: Array.isArray(saved.transactions) ? saved.transactions : init.transactions,
      role: saved.role === "admin" ? "admin" : "viewer",
      darkMode: !!saved.darkMode
    };
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        role: state.role,
        darkMode: state.darkMode,
        transactions: state.transactions,
        filters: state.filters
      })
    );
  }, [state.role, state.darkMode, state.transactions, state.filters]);

  useEffect(() => {
    // Keep a simple global class for theme.
    if (state.darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [state.darkMode]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

