"use client";

import { LayoutDashboard, ListChecks, Wallet, Sparkles } from "lucide-react";
import { clsx } from "@/lib/utils";

export type ViewId = "dashboard" | "expenses";

interface SidebarProps {
  view: ViewId;
  onChange: (v: ViewId) => void;
}

const items: { id: ViewId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "expenses", label: "Expenses", icon: ListChecks },
];

export function Sidebar({ view, onChange }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-4 self-start h-[calc(100vh-2rem)] glass rounded-2xl p-5 z-10">
      <div className="flex items-center gap-2.5 px-1">
        <div className="w-9 h-9 rounded-xl bg-ink-900 text-white grid place-items-center shadow-glow">
          <Wallet className="w-5 h-5" />
        </div>
        <div className="leading-tight">
          <div className="text-[15px] font-semibold tracking-tight">Extracker</div>
          <div className="text-[11px] text-ink-500">Personal finance</div>
        </div>
      </div>

      <nav className="mt-6 flex flex-col gap-1" aria-label="Primary">
        {items.map((it) => {
          const Icon = it.icon;
          const active = view === it.id;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => onChange(it.id)}
              className={clsx(
                "group flex items-center gap-3 w-full text-left rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer",
                active
                  ? "bg-ink-900 text-white shadow-sm"
                  : "text-ink-600 hover:text-ink-900 hover:bg-white/70"
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="w-[18px] h-[18px]" />
              <span>{it.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl bg-gradient-to-br from-brand-50 to-white border border-brand-100 p-4">
        <div className="flex items-center gap-2 text-brand-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tip</span>
        </div>
        <p className="mt-1.5 text-[12.5px] leading-snug text-ink-700">
          Log expenses the moment you spend — accurate categories make your monthly insights actually useful.
        </p>
      </div>
    </aside>
  );
}
