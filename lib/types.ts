export type CategoryId =
  | "food"
  | "transport"
  | "shopping"
  | "bills"
  | "entertainment"
  | "health"
  | "travel"
  | "education"
  | "groceries"
  | "other";

export interface Expense {
  id: string;
  amount: number;
  category: CategoryId;
  description: string;
  date: string; // ISO yyyy-mm-dd
  createdAt: number;
}

export interface ExpenseFilters {
  search: string;
  category: CategoryId | "all";
  from: string | null;
  to: string | null;
}
