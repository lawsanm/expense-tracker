import type { Metadata } from "next";
import "./globals.css";
import { ExpensesProvider } from "@/lib/store";
import { ThemeProvider } from "@/lib/theme";

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
    <html lang="en" suppressHydrationWarning>
      <body className="transition-colors duration-300">
        <ThemeProvider>
          <ExpensesProvider>{children}</ExpensesProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
