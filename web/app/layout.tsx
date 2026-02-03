import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { AuthProvider } from "@/app/context/AuthContext";
import { CartProvider } from "@/app/context/CartContext";
import { AuthContextWrapper } from "@/app/components/SessionProvider";

export const metadata: Metadata = {
  title: "Food Court System",
  description: "Order food from your favorite outlets",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthContextWrapper>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </AuthContextWrapper>
      </body>
    </html>
  );
}
