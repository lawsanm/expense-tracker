"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import type { Expense } from "@/lib/types";
import { formatCompactCurrency, formatCurrency } from "@/lib/utils";

interface MonthlyTrendProps {
  expenses: Expense[];
  /** Number of months back including current. Default 6. */
  months?: number;
}

export function MonthlyTrend({ expenses, months = 6 }: MonthlyTrendProps) {
  const now = new Date();
  const buckets: { key: string; label: string; year: number; month: number; value: number }[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleString("en-US", { month: "short" }),
      year: d.getFullYear(),
      month: d.getMonth(),
      value: 0,
    });
  }

  for (const e of expenses) {
    const d = new Date(e.date);
    const b = buckets.find((x) => x.year === d.getFullYear() && x.month === d.getMonth());
    if (b) b.value += e.amount;
  }

  const max = Math.max(...buckets.map((b) => b.value));
  const currentKey = `${now.getFullYear()}-${now.getMonth()}`;

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={buckets} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="#EEF2F7" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "#71717A", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#E4E4E7" }}
          />
          <YAxis
            tick={{ fill: "#71717A", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => formatCompactCurrency(Number(v))}
            width={56}
          />
          <Tooltip
            cursor={{ fill: "rgba(37,99,235,0.06)" }}
            contentStyle={{
              background: "rgba(255,255,255,0.95)",
              border: "1px solid #E4E4E7",
              borderRadius: 12,
              fontSize: 12,
              boxShadow: "0 8px 24px -8px rgba(15,23,42,0.12)",
            }}
            formatter={(value: number) => [formatCurrency(value), "Total"]}
          />
          <Bar dataKey="value" radius={[8, 8, 4, 4]} maxBarSize={48}>
            {buckets.map((b) => (
              <Cell
                key={b.key}
                fill={b.key === currentKey ? "#2563EB" : "#C7D2FE"}
                opacity={max === 0 ? 0.3 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
