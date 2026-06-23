"use client";

import { Plus, Wallet, Sun, Moon } from "lucide-react";
import type { ViewId } from "./Sidebar";
import { clsx } from "@/lib/utils";
import { useTheme } from "@/lib/theme";

interface TopBarProps {
  view: ViewId;
  onChange: (v: ViewId) => void;
  onAdd: () => void;
}

const titles: Record<ViewId, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Dashboard",
    subtitle: "An overview of your spending and trends.",
  },
  expenses: {
    title: "Expenses",
    subtitle: "Every transaction, filter it any way you want.",
  },
};

export function TopBar({ view, onChange, onAdd }: TopBarProps) {
  const meta = titles[view];
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-4 z-20">
      <div className="glass-strong rounded-2xl px-4 sm:px-5 py-3 flex items-center gap-3">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900 grid place-items-center">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-[17px] sm:text-lg font-semibold tracking-tight truncate text-ink-900 dark:text-ink-50">
            {meta.title}
          </h1>
          <p className="hidden sm:block text-[12.5px] text-ink-500 dark:text-ink-400 truncate">{meta.subtitle}</p>
        </div>

        {/* Mobile view switcher */}
        <div className="lg:hidden inline-flex rounded-xl border border-ink-200 dark:border-ink-700 bg-white/70 dark:bg-ink-800/70 p-0.5">
          {(["dashboard", "expenses"] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              className={clsx(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-200 cursor-pointer",
                view === v ? "bg-ink-900 dark:bg-ink-100 text-white dark:text-ink-900" : "text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-100"
              )}
            >
              {v === "dashboard" ? "Overview" : "List"}
            </button>
          ))}
        </div>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors duration-200 cursor-pointer"
          aria-label="Toggle dark mode"
        >
          {theme === "light" ? (
            <Moon className="w-[18px] h-[18px] text-ink-500" />
          ) : (
            <Sun className="w-[18px] h-[18px] text-amber-400" />
          )}
        </button>

        <button type="button" onClick={onAdd} className="btn-primary">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add expense</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </header>
  );
}
