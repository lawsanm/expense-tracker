import type { Metadata } from "next";
import "./globals.css";
import { ExpensesProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Extracker — Personal Expense Tracker",
  description:
    "A modern, minimal expense tracker. Log spending, filter your history, and see where your money goes.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAFAFA",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ExpensesProvider>{children}</ExpensesProvider>
      </body>
    </html>
  );
}
