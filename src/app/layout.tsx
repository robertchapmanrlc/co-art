import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./variables.css";
import ThemeToggle from "@/components/themeToggle/themeToggle";
import UserContextProvider from "@/context/userContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Co Art",
  description: "Collaborate with friends to draw pictures as best you can",
  authors: [{ name: "Robert", url: "https://robert-chapman.vercel.app" }],
  applicationName: "Co Art",
  referrer: "origin-when-cross-origin",
  creator: "Robert Chapman",
  publisher: "Robert Chapman",
  formatDetection: {
    address: false,
    date: false,
    email: false,
    telephone: false,
    url: false,
  },
  icons: {
    icon: '/favicon.ico'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeToggle />
        <Toaster />
        <UserContextProvider>{children}</UserContextProvider>
      </body>
    </html>
  );
}
