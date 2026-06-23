"use client";

import type { Expense } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/categories";
import { formatCurrency, clsx } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

interface ExpenseRowProps {
  expense: Expense;
  onEdit?: (e: Expense) => void;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function ExpenseRow({ expense, onEdit, onDelete, compact = false }: ExpenseRowProps) {
  const cat = CATEGORY_MAP[expense.category] ?? CATEGORY_MAP.other;
  const Icon = cat.icon;
  return (
    <div
      className={clsx(
        "group flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-3 rounded-xl hover:bg-white/70 dark:hover:bg-ink-800/70 transition-colors duration-200",
        compact && "px-2 py-2"
      )}
    >
      <div className={clsx("w-10 h-10 rounded-xl grid place-items-center shrink-0", cat.bg, cat.darkBg, cat.text)}>
        <Icon className="w-[18px] h-[18px]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-ink-900 dark:text-ink-50 truncate text-[14.5px]">
            {expense.description || cat.label}
          </p>
        </div>
        <div className="mt-0.5 text-[12px] text-ink-500 dark:text-ink-400 flex items-center gap-1.5 flex-wrap">
          <span className={clsx("chip", cat.bg, cat.darkBg, cat.text)}>{cat.label}</span>
          <span>·</span>
          <span>{formatDate(expense.date)}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-semibold tabular-nums text-ink-900 dark:text-ink-50">
          −{formatCurrency(expense.amount)}
        </div>
      </div>
      {(onEdit || onDelete) && (
        <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
          {onEdit && (
            <button
              type="button"
              aria-label="Edit expense"
              onClick={() => onEdit(expense)}
              className="btn-ghost p-2"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              aria-label="Delete expense"
              onClick={() => onDelete(expense.id)}
              className="btn-ghost p-2 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
