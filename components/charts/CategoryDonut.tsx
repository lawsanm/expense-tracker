"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { Expense } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/categories";
import { formatCurrency } from "@/lib/utils";
import { useTheme } from "@/lib/theme";

interface CategoryDonutProps {
  expenses: Expense[];
}

interface Slice {
  id: string;
  name: string;
  value: number;
  color: string;
}

export function CategoryDonut({ expenses }: CategoryDonutProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const totals = new Map<string, number>();
  for (const e of expenses) {
    totals.set(e.category, (totals.get(e.category) ?? 0) + e.amount);
  }
  const data: Slice[] = Array.from(totals.entries())
    .map(([id, value]) => ({
      id,
      name: CATEGORY_MAP[id as keyof typeof CATEGORY_MAP]?.label ?? id,
      color: CATEGORY_MAP[id as keyof typeof CATEGORY_MAP]?.hex ?? "#71717A",
      value,
    }))
    .sort((a, b) => b.value - a.value);

  const grand = data.reduce((s, d) => s + d.value, 0);

  if (data.length === 0) {
    return (
      <div className="h-64 grid place-items-center text-sm text-ink-500 dark:text-ink-400">
        No expenses yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 items-center">
      <div className="relative h-44 sm:h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={2}
              stroke={isDark ? "#18181B" : "white"}
              strokeWidth={2}
            >
              {data.map((d) => (
                <Cell key={d.id} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                background: isDark ? "rgba(39,39,42,0.95)" : "rgba(255,255,255,0.95)",
                border: `1px solid ${isDark ? "#3F3F46" : "#E4E4E7"}`,
                borderRadius: 12,
                fontSize: 12,
                boxShadow: isDark
                  ? "0 8px 24px -8px rgba(0,0,0,0.4)"
                  : "0 8px 24px -8px rgba(15,23,42,0.12)",
                color: isDark ? "#FAFAFA" : undefined,
              }}
              formatter={(value: number, name) => [formatCurrency(value), name]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-ink-500 dark:text-ink-400 font-medium">Total</div>
            <div className="text-lg font-semibold tabular-nums text-ink-900 dark:text-ink-50">{formatCurrency(grand)}</div>
          </div>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-1.5 max-h-48 overflow-auto pr-1">
        {data.map((d) => {
          const pct = grand > 0 ? (d.value / grand) * 100 : 0;
          return (
            <li key={d.id} className="flex items-center gap-3 text-sm">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: d.color }}
                aria-hidden
              />
              <span className="flex-1 min-w-0 truncate text-ink-700 dark:text-ink-300">{d.name}</span>
              <span className="tabular-nums text-ink-500 dark:text-ink-400 text-xs w-12 text-right">
                {pct.toFixed(0)}%
              </span>
              <span className="tabular-nums font-medium w-20 text-right text-ink-900 dark:text-ink-100">{formatCurrency(d.value)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
