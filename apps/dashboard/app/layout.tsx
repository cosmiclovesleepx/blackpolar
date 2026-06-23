import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Black Polar — Dashboard",
  description: "Panel de administración de Black Polar",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
