"use client";

import { useMemo, useState } from "react";
import { useExpenses } from "@/lib/store";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/categories";
import type { CategoryId, Expense, ExpenseFilters } from "@/lib/types";
import { ExpenseRow } from "./ExpenseRow";
import { clsx, formatCurrency } from "@/lib/utils";
import { Filter, Search, X } from "lucide-react";
import { ExpenseForm } from "./ExpenseForm";

const ALL: ExpenseFilters = { search: "", category: "all", from: null, to: null };

function groupByDate(items: Expense[]): { date: string; items: Expense[] }[] {
  const map = new Map<string, Expense[]>();
  for (const e of items) {
    const arr = map.get(e.date) ?? [];
    arr.push(e);
    map.set(e.date, arr);
  }
  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([date, items]) => ({ date, items: items.sort((a, b) => b.createdAt - a.createdAt) }));
}

function formatGroupDate(iso: string): string {
  const today = new Date();
  const d = new Date(iso);
  const diff = Math.round((today.setHours(0, 0, 0, 0) - new Date(iso).setHours(0, 0, 0, 0)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: d.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
}

export function ExpensesView({ onAdd }: { onAdd: () => void }) {
  const { expenses, hydrated, removeExpense, updateExpense } = useExpenses();
  const [filters, setFilters] = useState<ExpenseFilters>(ALL);
  const [editing, setEditing] = useState<Expense | null>(null);

  const filtered = useMemo(() => {
    return expenses.filter((e) => {
      if (filters.category !== "all" && e.category !== filters.category) return false;
      if (filters.from && e.date < filters.from) return false;
      if (filters.to && e.date > filters.to) return false;
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const cat = CATEGORY_MAP[e.category]?.label.toLowerCase() ?? "";
        if (!e.description.toLowerCase().includes(q) && !cat.includes(q)) return false;
      }
      return true;
    });
  }, [expenses, filters]);

  const totalFiltered = useMemo(() => filtered.reduce((s, e) => s + e.amount, 0), [filtered]);
  const grouped = useMemo(() => groupByDate(filtered), [filtered]);
  const activeFilters = filters.category !== "all" || filters.from || filters.to || filters.search.trim();

  function setCategory(category: CategoryId | "all") {
    setFilters((f) => ({ ...f, category }));
  }

  if (!hydrated) {
    return <div className="h-64 glass rounded-2xl animate-pulse" />;
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Filter bar */}
      <section className="glass rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" aria-hidden />
              <input
                type="search"
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
                placeholder="Search description or category…"
                className="glass-input w-full rounded-xl pl-9 pr-3 py-2.5 text-sm"
                aria-label="Search expenses"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="from" className="text-[12.5px] text-ink-500 hidden sm:inline">From</label>
              <input
                id="from"
                type="date"
                value={filters.from ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value || null }))}
                className="glass-input rounded-xl px-3 py-2.5 text-sm"
              />
              <label htmlFor="to" className="text-[12.5px] text-ink-500 hidden sm:inline">To</label>
              <input
                id="to"
                type="date"
                value={filters.to ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value || null }))}
                className="glass-input rounded-xl px-3 py-2.5 text-sm"
              />
            </div>
            {activeFilters && (
              <button
                type="button"
                onClick={() => setFilters(ALL)}
                className="btn-ghost text-[13px]"
                aria-label="Clear all filters"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto -mx-1 px-1 pb-0.5">
            <span className="inline-flex items-center gap-1.5 text-[12px] uppercase tracking-wide text-ink-500 font-semibold shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5" />
              Category
            </span>
            <button
              type="button"
              onClick={() => setCategory("all")}
              className={clsx(
                "shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-medium border transition-colors duration-200 cursor-pointer",
                filters.category === "all"
                  ? "bg-ink-900 text-white border-ink-900"
                  : "bg-white text-ink-600 border-ink-200 hover:bg-ink-50"
              )}
            >
              All
            </button>
            {CATEGORIES.map((c) => {
              const active = filters.category === c.id;
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={clsx(
                    "shrink-0 rounded-full px-3 py-1.5 text-[12.5px] font-medium border transition-colors duration-200 cursor-pointer flex items-center gap-1.5",
                    active
                      ? "bg-ink-900 text-white border-ink-900"
                      : "bg-white text-ink-700 border-ink-200 hover:bg-ink-50"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Summary line */}
      <div className="flex items-center justify-between px-1">
        <p className="text-[13px] text-ink-600">
          <span className="font-medium text-ink-900">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "transaction" : "transactions"}
          {activeFilters && expenses.length !== filtered.length && (
            <span className="text-ink-500"> · filtered from {expenses.length}</span>
          )}
        </p>
        <p className="text-[13px] text-ink-600">
          Total{" "}
          <span className="font-semibold text-ink-900 tabular-nums">{formatCurrency(totalFiltered)}</span>
        </p>
      </div>

      {/* List */}
      <section className="glass rounded-2xl p-2 sm:p-3">
        {grouped.length === 0 ? (
          <div className="py-16 text-center px-4">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-ink-100 grid place-items-center text-ink-500 mb-3">
              <Search className="w-5 h-5" />
            </div>
            <p className="text-sm text-ink-700 font-medium">No expenses match your filters.</p>
            <p className="text-[12.5px] text-ink-500 mt-1">
              Try clearing filters or adding a new expense.
            </p>
            <button type="button" onClick={onAdd} className="btn-primary mt-4">
              Add expense
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {grouped.map((g) => {
              const dayTotal = g.items.reduce((s, e) => s + e.amount, 0);
              return (
                <div key={g.date}>
                  <div className="flex items-baseline justify-between px-3 sm:px-4 pt-3 pb-1.5">
                    <h3 className="text-[12px] uppercase tracking-wide font-semibold text-ink-500">
                      {formatGroupDate(g.date)}
                    </h3>
                    <span className="text-[12px] text-ink-500 tabular-nums">
                      {formatCurrency(dayTotal)}
                    </span>
                  </div>
                  <div className="divide-y divide-ink-100/70">
                    {g.items.map((e) => (
                      <ExpenseRow
                        key={e.id}
                        expense={e}
                        onEdit={(ex) => setEditing(ex)}
                        onDelete={(id) => {
                          if (confirm("Delete this expense?")) removeExpense(id);
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <ExpenseForm
        open={!!editing}
        initial={editing}
        onClose={() => setEditing(null)}
        onSubmit={(data) => {
          if (editing) updateExpense(editing.id, data);
          setEditing(null);
        }}
      />
    </div>
  );
}
