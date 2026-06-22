"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Expense } from "./types";
import { uid, todayISO } from "./utils";


const STORAGE_KEY = "extracker.expenses.v1";

interface ExpensesContextValue {
  expenses: Expense[];
  hydrated: boolean;
  addExpense: (input: Omit<Expense, "id" | "createdAt">) => void;
  updateExpense: (id: string, patch: Partial<Omit<Expense, "id" | "createdAt">>) => void;
  removeExpense: (id: string) => void;
  resetExpenses: () => void;
}

const ExpensesContext = createContext<ExpensesContextValue | null>(null);

export function ExpensesProvider({ children }: { children: ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Expense[];
        if (Array.isArray(parsed)) {
          setExpenses(parsed);
        }
      }
    } catch {
      // ignore parse errors, start empty
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch {
      // ignore quota errors
    }
  }, [expenses, hydrated]);

  const addExpense = useCallback(
    (input: Omit<Expense, "id" | "createdAt">) => {
      const next: Expense = {
        ...input,
        id: uid(),
        createdAt: Date.now(),
        date: input.date || todayISO(),
      };
      setExpenses((prev) => [next, ...prev]);
    },
    []
  );

  const updateExpense = useCallback(
    (id: string, patch: Partial<Omit<Expense, "id" | "createdAt">>) => {
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...patch } : e))
      );
    },
    []
  );

  const removeExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const resetExpenses = useCallback(() => {
    setExpenses([]);
  }, []);

  const value = useMemo<ExpensesContextValue>(
    () => ({ expenses, hydrated, addExpense, updateExpense, removeExpense, resetExpenses }),
    [expenses, hydrated, addExpense, updateExpense, removeExpense, resetExpenses]
  );

  return (
    <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>
  );
}

export function useExpenses(): ExpensesContextValue {
  const ctx = useContext(ExpensesContext);
  if (!ctx) throw new Error("useExpenses must be used inside <ExpensesProvider>");
  return ctx;
}
