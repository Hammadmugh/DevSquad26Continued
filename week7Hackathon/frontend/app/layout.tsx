import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store/StoreProvider";
import { MuiThemeProvider } from "@/components/MuiThemeProvider";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "POS System",
  description: "Production-style Point of Sale & Inventory Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <MuiThemeProvider>
            <AppShell>{children}</AppShell>
          </MuiThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
