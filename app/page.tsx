"use client";

import { useState } from "react";
import { Sidebar, type ViewId } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { DashboardView } from "@/components/DashboardView";
import { ExpensesView } from "@/components/ExpensesView";
import { ExpenseForm } from "@/components/ExpenseForm";
import { useExpenses } from "@/lib/store";

export default function Page() {
  const [view, setView] = useState<ViewId>("dashboard");
  const [adding, setAdding] = useState(false);
  const { addExpense } = useExpenses();

  return (
    <div className="relative z-[1] mx-auto max-w-[1400px] px-4 sm:px-6 py-4 sm:py-6">
      <div className="flex gap-5">
        <Sidebar view={view} onChange={setView} />
        <main className="min-w-0 flex-1 flex flex-col gap-5">
          <TopBar view={view} onChange={setView} onAdd={() => setAdding(true)} />
          {view === "dashboard" ? (
            <DashboardView onAdd={() => setAdding(true)} />
          ) : (
            <ExpensesView onAdd={() => setAdding(true)} />
          )}
        </main>
      </div>

      <ExpenseForm
        open={adding}
        onClose={() => setAdding(false)}
        onSubmit={(data) => {
          addExpense(data);
          setAdding(false);
        }}
      />
    </div>
  );
}
