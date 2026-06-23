"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CATEGORIES } from "@/lib/categories";
import type { CategoryId, Expense } from "@/lib/types";
import { clsx, todayISO } from "@/lib/utils";
import { X } from "lucide-react";

interface ExpenseFormProps {
  open: boolean;
  initial?: Expense | null;
  onClose: () => void;
  onSubmit: (data: { amount: number; category: CategoryId; description: string; date: string }) => void;
}

export function ExpenseForm({ open, initial, onClose, onSubmit }: ExpenseFormProps) {
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<CategoryId>("food");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>(todayISO());
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (open) {
      if (initial) {
        setAmount(String(initial.amount));
        setCategory(initial.category);
        setDescription(initial.description);
        setDate(initial.date);
      } else {
        setAmount("");
        setCategory("food");
        setDescription("");
        setDate(todayISO());
      }
      setError(null);
      // focus the amount input
      const t = setTimeout(() => amountRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!isFinite(num) || num <= 0) {
      setError("Enter an amount greater than 0.");
      amountRef.current?.focus();
      return;
    }
    if (!date) {
      setError("Pick a date.");
      return;
    }
    onSubmit({
      amount: Math.round(num * 100) / 100,
      category,
      description: description.trim(),
      date,
    });
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={initial ? "Edit expense" : "Add expense"}
      className="fixed inset-0 z-50 grid place-items-end sm:place-items-center"
    >
      <div
        className="absolute inset-0 bg-ink-950/30 dark:bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full sm:max-w-md bg-white dark:bg-ink-900 sm:rounded-2xl rounded-t-2xl shadow-2xl border border-ink-200 dark:border-ink-700 p-5 sm:p-6 animate-fade-in transition-colors"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-ink-900 dark:text-ink-50">
              {initial ? "Edit expense" : "Add expense"}
            </h2>
            <p className="text-[12.5px] text-ink-500 dark:text-ink-400">Log a transaction in seconds.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost p-2 -m-1"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="amount" className="block text-[12.5px] font-medium text-ink-700 dark:text-ink-300 mb-1.5">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500 dark:text-ink-400 text-sm">$</span>
              <input
                id="amount"
                ref={amountRef}
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="glass-input w-full rounded-xl pl-7 pr-3 py-2.5 text-base tabular-nums"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[12.5px] font-medium text-ink-700 dark:text-ink-300 mb-1.5">Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                const active = c.id === category;
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    aria-pressed={active}
                    className={clsx(
                      "flex items-center gap-2 rounded-xl border px-2.5 py-2 text-[13px] font-medium transition-colors duration-200 cursor-pointer",
                      active
                        ? "border-brand bg-brand-50 dark:bg-brand-700/20 text-brand-700 dark:text-brand-400 ring-2 ring-brand/20"
                        : "border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 text-ink-700 dark:text-ink-300 hover:border-ink-300 dark:hover:border-ink-600 hover:bg-ink-50 dark:hover:bg-ink-700"
                    )}
                  >
                    <span className={clsx("w-6 h-6 rounded-md grid place-items-center", c.bg, c.darkBg, c.text)}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className="truncate">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-[12.5px] font-medium text-ink-700 dark:text-ink-300 mb-1.5">
              Description
            </label>
            <input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Coffee with Sam"
              className="glass-input w-full rounded-xl px-3 py-2.5 text-sm"
              maxLength={120}
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-[12.5px] font-medium text-ink-700 dark:text-ink-300 mb-1.5">
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={todayISO()}
              className="glass-input w-full rounded-xl px-3 py-2.5 text-sm"
              required
            />
          </div>

          {error && (
            <div role="alert" className="text-[13px] text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800/40 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            {initial ? "Save changes" : "Add expense"}
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}
