import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "A simple task management application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen bg-slate-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
