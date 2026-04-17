import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/store/StoreProvider";
import MuiThemeProvider from "@/components/MuiThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "YourSneaker",
  description: "Nike Sneaker Shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <body style={{ margin: 0, fontFamily: 'Montserrat, sans-serif' }}>
        <StoreProvider>
          <MuiThemeProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </MuiThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
