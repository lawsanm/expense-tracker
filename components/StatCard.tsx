"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { clsx } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  /** Percent change vs prior period. Positive = up. */
  change?: number;
  /** When true, an "up" change is bad (more spending). */
  invertChange?: boolean;
}

export function StatCard({ label, value, hint, icon: Icon, change, invertChange = true }: StatCardProps) {
  const hasChange = typeof change === "number" && isFinite(change);
  const up = hasChange && change! > 0;
  const flat = hasChange && Math.abs(change!) < 0.5;
  const goodColor = "text-emerald-700 bg-emerald-50 border-emerald-100";
  const badColor = "text-rose-700 bg-rose-50 border-rose-100";
  const neutralColor = "text-ink-600 bg-ink-100 border-ink-200";

  const chipColor = !hasChange || flat
    ? neutralColor
    : invertChange
      ? up ? badColor : goodColor
      : up ? goodColor : badColor;

  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-3 hover:shadow-glow transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-ink-900 text-white grid place-items-center">
          <Icon className="w-[18px] h-[18px]" />
        </div>
        {hasChange && (
          <span className={clsx("chip border", chipColor)}>
            {flat ? (
              <span>±0%</span>
            ) : up ? (
              <>
                <ArrowUpRight className="w-3 h-3" />
                {Math.abs(change!).toFixed(1)}%
              </>
            ) : (
              <>
                <ArrowDownRight className="w-3 h-3" />
                {Math.abs(change!).toFixed(1)}%
              </>
            )}
          </span>
        )}
      </div>
      <div>
        <div className="text-[12.5px] uppercase tracking-wide text-ink-500 font-medium">{label}</div>
        <div className="mt-1 text-2xl font-semibold tracking-tight tabular-nums">{value}</div>
        {hint && <div className="mt-1 text-[12.5px] text-ink-500">{hint}</div>}
      </div>
    </div>
  );
}
