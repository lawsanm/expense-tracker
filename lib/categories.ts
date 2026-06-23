import {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Film,
  HeartPulse,
  Plane,
  GraduationCap,
  ShoppingCart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { CategoryId } from "./types";

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
  /** Tailwind text color class */
  text: string;
  /** Tailwind background color class (soft chip) — includes dark variant */
  bg: string;
  /** Dark mode background class */
  darkBg: string;
  /** Hex (used by charts) */
  hex: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: "food",          label: "Food & Dining", icon: Utensils,       text: "text-amber-700 dark:text-amber-400",     bg: "bg-amber-100",   darkBg: "dark:bg-amber-900/30",   hex: "#F59E0B" },
  { id: "groceries",     label: "Groceries",     icon: ShoppingCart,   text: "text-lime-700 dark:text-lime-400",        bg: "bg-lime-100",    darkBg: "dark:bg-lime-900/30",    hex: "#84CC16" },
  { id: "transport",     label: "Transport",     icon: Car,            text: "text-sky-700 dark:text-sky-400",          bg: "bg-sky-100",     darkBg: "dark:bg-sky-900/30",     hex: "#0EA5E9" },
  { id: "shopping",      label: "Shopping",      icon: ShoppingBag,    text: "text-pink-700 dark:text-pink-400",        bg: "bg-pink-100",    darkBg: "dark:bg-pink-900/30",    hex: "#EC4899" },
  { id: "bills",         label: "Bills & Utils", icon: Receipt,        text: "text-indigo-700 dark:text-indigo-400",    bg: "bg-indigo-100",  darkBg: "dark:bg-indigo-900/30",  hex: "#6366F1" },
  { id: "entertainment", label: "Entertainment", icon: Film,           text: "text-purple-700 dark:text-purple-400",    bg: "bg-purple-100",  darkBg: "dark:bg-purple-900/30",  hex: "#A855F7" },
  { id: "health",        label: "Health",        icon: HeartPulse,     text: "text-rose-700 dark:text-rose-400",        bg: "bg-rose-100",    darkBg: "dark:bg-rose-900/30",    hex: "#F43F5E" },
  { id: "travel",        label: "Travel",        icon: Plane,          text: "text-cyan-700 dark:text-cyan-400",        bg: "bg-cyan-100",    darkBg: "dark:bg-cyan-900/30",    hex: "#06B6D4" },
  { id: "education",     label: "Education",     icon: GraduationCap,  text: "text-emerald-700 dark:text-emerald-400",  bg: "bg-emerald-100", darkBg: "dark:bg-emerald-900/30", hex: "#10B981" },
  { id: "other",         label: "Other",         icon: Sparkles,       text: "text-ink-700 dark:text-ink-300",          bg: "bg-ink-100",     darkBg: "dark:bg-ink-800",        hex: "#71717A" },
];

export const CATEGORY_MAP: Record<CategoryId, CategoryMeta> = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.id]: c }),
  {} as Record<CategoryId, CategoryMeta>
);
