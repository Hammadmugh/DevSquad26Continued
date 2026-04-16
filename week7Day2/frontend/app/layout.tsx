import type { Metadata } from "next";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/raleway/400.css";
import "@fontsource/raleway/600.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "./globals.css";
import StoreProvider from "../providers/StoreProvider";
import ThemeProvider from "../providers/ThemeProvider";

export const metadata: Metadata = {
  title: "Circlechain — Save, Buy and Sell Your Blockchain Asset",
  description: "The easy to manage and trade your cryptocurrency asset",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, backgroundColor: "#010010" }}>
        <StoreProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
