"use client";

import { useMemo } from "react";
import { useExpenses } from "@/lib/store";
import { StatCard } from "./StatCard";
import { CategoryDonut } from "./charts/CategoryDonut";
import { MonthlyTrend } from "./charts/MonthlyTrend";
import { ExpenseRow } from "./ExpenseRow";
import { CATEGORY_MAP } from "@/lib/categories";
import { formatCurrency } from "@/lib/utils";
import { CalendarDays, CircleDollarSign, Layers, TrendingUp } from "lucide-react";

export function DashboardView({ onAdd }: { onAdd: () => void }) {
  const { expenses, hydrated } = useExpenses();

  const stats = useMemo(() => {
    const now = new Date();
    const cy = now.getFullYear();
    const cm = now.getMonth();
    const prevDate = new Date(cy, cm - 1, 1);
    const py = prevDate.getFullYear();
    const pm = prevDate.getMonth();

    let total = 0;
    let thisMonth = 0;
    let lastMonth = 0;
    const countByMonth = new Map<string, number>();
    const sumByCategory = new Map<string, number>();

    for (const e of expenses) {
      total += e.amount;
      const d = new Date(e.date);
      const y = d.getFullYear();
      const m = d.getMonth();
      const key = `${y}-${m}`;
      countByMonth.set(key, (countByMonth.get(key) ?? 0) + e.amount);
      sumByCategory.set(e.category, (sumByCategory.get(e.category) ?? 0) + e.amount);
      if (y === cy && m === cm) thisMonth += e.amount;
      if (y === py && m === pm) lastMonth += e.amount;
    }

    const monthValues = Array.from(countByMonth.values());
    const avgMonth = monthValues.length > 0 ? monthValues.reduce((a, b) => a + b, 0) / monthValues.length : 0;

    let topCat: string | null = null;
    let topVal = 0;
    sumByCategory.forEach((v, k) => {
      if (v > topVal) { topVal = v; topCat = k; }
    });

    const change = lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : undefined;

    return { total, thisMonth, avgMonth, topCat, topVal, change, count: expenses.length };
  }, [expenses]);

  const recent = useMemo(
    () =>
      [...expenses]
        .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.createdAt - a.createdAt))
        .slice(0, 6),
    [expenses]
  );

  const last30 = useMemo(() => {
    const cutoff = Date.now() - 30 * 86400000;
    return expenses.filter((e) => new Date(e.date).getTime() >= cutoff);
  }, [expenses]);

  if (!hydrated) {
    return (
      <div className="space-y-4">
        <div className="h-28 glass rounded-2xl animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 glass rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const topCatMeta = stats.topCat ? CATEGORY_MAP[stats.topCat as keyof typeof CATEGORY_MAP] : null;

  return (
    <div className="space-y-5 animate-fade-in">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="This month"
          value={formatCurrency(stats.thisMonth)}
          hint={`${recent.length > 0 ? "vs last month" : "Start tracking to see trends"}`}
          icon={CalendarDays}
          change={stats.change}
          invertChange
        />
        <StatCard
          label="All-time total"
          value={formatCurrency(stats.total)}
          hint={`${stats.count} transaction${stats.count === 1 ? "" : "s"}`}
          icon={CircleDollarSign}
        />
        <StatCard
          label="Monthly average"
          value={formatCurrency(stats.avgMonth)}
          hint="Across logged months"
          icon={TrendingUp}
        />
        <StatCard
          label="Top category"
          value={topCatMeta ? topCatMeta.label : "—"}
          hint={topCatMeta ? formatCurrency(stats.topVal) : "No expenses yet"}
          icon={Layers}
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3 glass rounded-2xl p-5">
          <div className="flex items-end justify-between mb-3">
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight text-ink-900 dark:text-ink-50">Spending over time</h2>
              <p className="text-[12.5px] text-ink-500 dark:text-ink-400">Total spend by month — current month highlighted</p>
            </div>
          </div>
          <MonthlyTrend expenses={expenses} />
        </div>

        <div className="lg:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-end justify-between mb-3">
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight text-ink-900 dark:text-ink-50">By category</h2>
              <p className="text-[12.5px] text-ink-500 dark:text-ink-400">Last 30 days · {last30.length} txn</p>
            </div>
          </div>
          <CategoryDonut expenses={last30.length > 0 ? last30 : expenses} />
        </div>
      </section>

      <section className="glass rounded-2xl p-5">
        <div className="flex items-end justify-between mb-2">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight text-ink-900 dark:text-ink-50">Recent transactions</h2>
            <p className="text-[12.5px] text-ink-500 dark:text-ink-400">Your 6 most recent expenses</p>
          </div>
          <button type="button" onClick={onAdd} className="btn-ghost text-[13px]">
            + Add new
          </button>
        </div>
        {recent.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-ink-500 dark:text-ink-400">No expenses yet — add your first one to get started.</p>
            <button type="button" onClick={onAdd} className="btn-primary mt-4">
              Add an expense
            </button>
          </div>
        ) : (
          <div className="divide-y divide-ink-100 dark:divide-ink-800">
            {recent.map((e) => (
              <ExpenseRow key={e.id} expense={e} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
