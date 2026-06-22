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

function seedExpenses(): Expense[] {
  const now = new Date();
  const iso = (offsetDays: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - offsetDays);
    return d.toISOString().slice(0, 10);
  };
  const make = (
    amount: number,
    category: Expense["category"],
    description: string,
    offset: number
  ): Expense => ({
    id: uid(),
    amount,
    category,
    description,
    date: iso(offset),
    createdAt: Date.now() - offset * 86400000,
  });

  return [
    make(42.5, "food", "Dinner at Sakura Ramen", 0),
    make(12.0, "transport", "Uber to office", 1),
    make(86.2, "groceries", "Weekly grocery run", 2),
    make(120.0, "bills", "Internet — June", 3),
    make(58.9, "shopping", "Running shoes — Nike", 5),
    make(15.99, "entertainment", "Netflix subscription", 6),
    make(220.0, "travel", "Train tickets to Boston", 9),
    make(34.0, "health", "Pharmacy", 12),
    make(8.5, "food", "Morning coffee + bagel", 14),
    make(75.0, "groceries", "Whole Foods", 16),
    make(45.0, "transport", "Gas", 18),
    make(28.0, "entertainment", "Movie night", 22),
    make(199.0, "education", "Design book bundle", 26),
    make(64.0, "shopping", "Desk lamp", 30),
    make(110.0, "bills", "Electricity", 35),
    make(52.0, "food", "Brunch with friends", 38),
  ];
}

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
        } else {
          setExpenses(seedExpenses());
        }
      } else {
        setExpenses(seedExpenses());
      }
    } catch {
      setExpenses(seedExpenses());
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
    setExpenses(seedExpenses());
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
