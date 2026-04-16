import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationsProvider } from "@/context/NotificationsContext";
import AuthModal from "@/components/AuthModal";
import UserProfileOverlay from "@/components/UserProfileOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SHOP.CO",
  description: "Your favourite fashion store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/satoshi" />
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/integral-cf" />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CartProvider>
            <NotificationsProvider>
              {children}
              <AuthModal />
              <UserProfileOverlay />
            </NotificationsProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
